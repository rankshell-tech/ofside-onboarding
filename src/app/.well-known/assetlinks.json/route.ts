import { buildAssetLinksPayload } from '@/lib/universalLinks';

export async function GET() {
  const payload = buildAssetLinksPayload();
  return Response.json(payload.body, {
    status: payload.ok ? 200 : payload.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': payload.ok ? 'public, max-age=300' : 'no-store',
    },
  });
}
