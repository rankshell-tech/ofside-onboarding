import type { Metadata } from 'next';
import AppLinkInstantRedirect from '@/components/AppLinkInstantRedirect';
import OpenInAppGate from '@/components/OpenInAppGate';
import { appLinkMetaToNextMetadata } from '@/lib/appLinkMeta';

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

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const raw = await searchParams;
  const qs = toSearchParams(raw);
  if (!qs.get('viewScore')) qs.set('viewScore', '1');

  const canonicalWebUrl = `https://api.ofside.in/scoring/scoringScreen${qs.toString() ? `?${qs.toString()}` : ''}`;

  return appLinkMetaToNextMetadata(
    { appPath: '/scoring/scoringScreen', searchParams: qs },
    canonicalWebUrl,
    'Live score on Ofside',
    'Follow the match live in the Ofside app.'
  );
}

export default async function LiveScoreOpenPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const qs = toSearchParams(raw);

  if (!qs.get('viewScore')) {
    qs.set('viewScore', '1');
  }

  const target = { appPath: '/scoring/scoringScreen', searchParams: qs };

  return (
    <>
      <AppLinkInstantRedirect target={target} />
      <OpenInAppGate
        target={target}
        title="Live score on Ofside"
        description="Follow the match live in the Ofside app. Install the app if you do not have it yet."
      />
    </>
  );
}
