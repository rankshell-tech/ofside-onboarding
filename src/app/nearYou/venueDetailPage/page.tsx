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
  const canonicalWebUrl = `https://ofside.in/nearYou/venueDetailPage${qs.toString() ? `?${qs.toString()}` : ''}`;

  return appLinkMetaToNextMetadata(
    { appPath: '/nearYou/venueDetailPage', searchParams: qs },
    canonicalWebUrl,
    'Venue on Ofside',
    'View this venue and book your slot in the Ofside app.'
  );
}

export default async function VenueOpenPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const qs = toSearchParams(raw);

  const target = { appPath: '/nearYou/venueDetailPage', searchParams: qs };

  return (
    <>
      <AppLinkInstantRedirect target={target} />
      <OpenInAppGate
        target={target}
        title="Venue on Ofside"
        description="View this venue and book your slot in the Ofside app."
      />
    </>
  );
}
