import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ matchId: string }>;
};

const API_URL = process.env.API_URL?.replace(/\/$/, '') ?? 'https://api.ofside.in';

/** OBS overlay lives on the API host; keep a public ofside.in alias. */
export default async function OverlayAliasPage({ params }: PageProps) {
  const { matchId } = await params;
  const id = String(matchId || '').trim();
  if (!id) {
    redirect('/');
  }
  redirect(`${API_URL}/overlay/${encodeURIComponent(id)}`);
}
