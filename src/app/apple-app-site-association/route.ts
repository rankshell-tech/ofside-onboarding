import { buildAppleAppSiteAssociationBody } from '@/lib/universalLinks';

/** Alternate path Apple may request: https://ofside.in/apple-app-site-association */
export async function GET() {
  return Response.json(buildAppleAppSiteAssociationBody(), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
