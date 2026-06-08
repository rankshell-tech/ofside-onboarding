import { buildAssetLinksBody } from '@/lib/universalLinks';

export async function GET() {
  return Response.json(buildAssetLinksBody(), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
