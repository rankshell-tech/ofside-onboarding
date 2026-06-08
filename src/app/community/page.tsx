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
  const canonicalWebUrl = `https://ofside.in/community${qs.toString() ? `?${qs.toString()}` : ''}`;

  return appLinkMetaToNextMetadata(
    { appPath: '/community', searchParams: qs },
    canonicalWebUrl,
    'Community game on Ofside',
    'View and join this community game in the Ofside app.'
  );
}

export default async function CommunityGameOpenPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const qs = toSearchParams(raw);

  const target = { appPath: '/community', searchParams: qs };

  return (
    <>
      <AppLinkInstantRedirect target={target} />
      <OpenInAppGate
        target={target}
        title="Community game on Ofside"
        description="View and join this community game in the Ofside app."
      />
    </>
  );
}
