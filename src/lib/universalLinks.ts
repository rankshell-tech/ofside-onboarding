import { APP_BUNDLE_ID } from '@/lib/mobileAppLinks';

export const UNIVERSAL_LINK_PATHS = [
  '/score',
  '/score/*',
  '/scoring/scoringScreen',
  '/scoring/scoringScreen/*',
  '/scoring/*',
  '/live-score',
  '/live-score/*',
  '/community',
  '/community/*',
  '/invite',
  '/invite/*',
  '/nearYou/venueDetailPage',
  '/nearYou/venueDetailPage/*',
  '/nearYou/*',
];

export type UniversalLinkConfigStatus = {
  ios: { configured: boolean; appId: string | null; missing: string[] };
  android: { configured: boolean; packageName: string; missing: string[] };
};

export function getUniversalLinkConfigStatus(): UniversalLinkConfigStatus {
  const teamId = process.env.APPLE_TEAM_ID?.trim() ?? '';
  const fingerprint = process.env.ANDROID_SHA256_CERT_FINGERPRINT?.trim() ?? '';

  const iosMissing: string[] = [];
  if (!teamId) iosMissing.push('APPLE_TEAM_ID');
  if (!APP_BUNDLE_ID) iosMissing.push('bundle id');

  const androidMissing: string[] = [];
  if (!fingerprint) androidMissing.push('ANDROID_SHA256_CERT_FINGERPRINT');
  if (!APP_BUNDLE_ID) androidMissing.push('package name');

  return {
    ios: {
      configured: iosMissing.length === 0,
      appId: teamId ? `${teamId}.${APP_BUNDLE_ID}` : null,
      missing: iosMissing,
    },
    android: {
      configured: androidMissing.length === 0,
      packageName: APP_BUNDLE_ID,
      missing: androidMissing,
    },
  };
}

export function logUniversalLinkMisconfiguration(context: string): void {
  const status = getUniversalLinkConfigStatus();
  if (!status.ios.configured) {
    console.error(
      `[deep-links] ${context}: iOS Universal Links misconfigured — missing ${status.ios.missing.join(', ')}`
    );
  }
  if (!status.android.configured) {
    console.error(
      `[deep-links] ${context}: Android App Links misconfigured — missing ${status.android.missing.join(', ')}`
    );
  }
}

export function buildAppleAppSiteAssociationBody() {
  const status = getUniversalLinkConfigStatus();
  const appId = status.ios.appId;

  return {
    applinks: {
      apps: [],
      details: appId
        ? [
            {
              appID: appId,
              appIDs: [appId],
              paths: UNIVERSAL_LINK_PATHS,
            },
          ]
        : [],
    },
  };
}

export function buildAssetLinksBody() {
  // Comma/space-separated list so BOTH the Play App Signing cert and the upload/EAS keystore
  // cert can be listed — verification needs whichever key signed the installed build.
  const fingerprints = (process.env.ANDROID_SHA256_CERT_FINGERPRINT || '')
    .split(/[,\s]+/)
    .map((f) => f.trim())
    .filter(Boolean);
  if (fingerprints.length === 0) return [];

  return [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: APP_BUNDLE_ID,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];
}

export type VerificationPayloadResult =
  | { ok: true; body: Record<string, unknown> | Record<string, unknown>[] }
  | { ok: false; status: number; body: { error: string; missing: string[] } };

export function buildAppleAppSiteAssociationPayload(): VerificationPayloadResult {
  const status = getUniversalLinkConfigStatus();
  if (!status.ios.configured) {
    logUniversalLinkMisconfiguration('apple-app-site-association');
    return {
      ok: false,
      status: 503,
      body: {
        error: 'iOS Universal Links verification is not configured',
        missing: status.ios.missing,
      },
    };
  }
  return { ok: true, body: buildAppleAppSiteAssociationBody() };
}

export function buildAssetLinksPayload(): VerificationPayloadResult {
  const status = getUniversalLinkConfigStatus();
  if (!status.android.configured) {
    logUniversalLinkMisconfiguration('assetlinks.json');
    return {
      ok: false,
      status: 503,
      body: {
        error: 'Android App Links verification is not configured',
        missing: status.android.missing,
      },
    };
  }
  return { ok: true, body: buildAssetLinksBody() };
}
