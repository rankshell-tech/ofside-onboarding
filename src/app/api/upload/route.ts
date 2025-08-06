// src/app/api/upload/route.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('fileName');
  const fileType = searchParams.get('fileType');

  if (!fileName || !fileType) {
    return new Response(JSON.stringify({ success: false, message: 'Missing fileName or fileType' }), {
      status: 400,
    });
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return new Response(JSON.stringify({
      success: true,
      url: signedUrl,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (err: unknown) {
    console.error('Error generating S3 signed URL:', err);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error generating signed URL',
      error: (err as Error).message,
    }), { status: 500 });
  }
}
