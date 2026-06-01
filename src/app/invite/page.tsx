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

/** Referral links from the app: https://api.ofside.in/invite?code=… */
export default async function InviteOpenPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const qs = toSearchParams(raw);
  const code = qs.get('code');
  const signupParams = new URLSearchParams();
  if (code) signupParams.set('referralCode', code);

  return (
    <OpenInAppGate
      target={{
        appPath: '/login/signup',
        searchParams: signupParams,
      }}
      title="Join Ofside"
      description="Install the Ofside app to sign up with your friend's referral and start playing."
    />
  );
}
