import { redirect } from 'next/navigation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQueryString(raw: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (value == null) continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }
  if (!params.get('viewScore')) {
    params.set('viewScore', '1');
  }
  return params.toString();
}

/** Alias for shared links; canonical page is /scoring/scoringScreen. */
export default async function LiveScoreAliasPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const qs = toQueryString(raw);
  redirect(`/scoring/scoringScreen${qs ? `?${qs}` : ''}`);
}
