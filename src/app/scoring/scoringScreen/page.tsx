import OpenInAppGate from '@/components/OpenInAppGate';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toSearchParams(
  raw: Record<string, string | string[] | undefined>
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (value == null) continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }
  return params;
}

export default async function LiveScoreOpenPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const qs = toSearchParams(raw);

  if (!qs.get('viewScore')) {
    qs.set('viewScore', '1');
  }

  return (
    <OpenInAppGate
      target={{ appPath: '/scoring/scoringScreen', searchParams: qs }}
      title="Live score on Ofside"
      description="Follow the match live in the Ofside app. Install the app if you do not have it yet."
    />
  );
}
