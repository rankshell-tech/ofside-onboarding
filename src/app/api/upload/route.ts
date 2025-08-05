import { NextRequest } from 'next/server';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility to convert web ReadableStream to Node.js Readable stream
function streamFromRequestBody(body: ReadableStream<Uint8Array>): Readable {
  const reader = body.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!req.body) throw new Error('No request body');

    const nodeReadable = streamFromRequestBody(req.body);
    const busboy = Busboy({ headers: Object.fromEntries(req.headers) });

    const buffers: Buffer[] = [];
    let fileMimeType = '';
    let fileName = '';

    const parsePromise = new Promise<void>((resolve, reject) => {
      busboy.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        fileMimeType = mimeType;
        fileName = `${uuidv4()}-${filename}`;

        file.on('data', (data) => buffers.push(data));
        file.on('end', () => resolve());
      });

      busboy.on('error', reject);
      busboy.on('finish', resolve);
    });

    nodeReadable.pipe(busboy);
    await parsePromise;

    // Upload to AWS S3
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      region: process.env.AWS_REGION!,
    });

    const result = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: Buffer.concat(buffers),
        ContentType: fileMimeType,
      })
      .promise();

    return new Response(
      JSON.stringify({ success: true, url: result.Location }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Upload failed:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Upload failed' }),
      { status: 500 }
    );
  }
}
