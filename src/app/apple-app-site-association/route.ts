import { buildAppleAppSiteAssociationPayload } from '@/lib/universalLinks';

/** Alternate path Apple may request: https://ofside.in/apple-app-site-association */
export async function GET() {
  const payload = buildAppleAppSiteAssociationPayload();
  return Response.json(payload.body, {
    status: payload.ok ? 200 : payload.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': payload.ok ? 'public, max-age=300' : 'no-store',
    },
  });
}
