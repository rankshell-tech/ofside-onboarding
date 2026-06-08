import { APP_BUNDLE_ID } from '@/lib/mobileAppLinks';

const UNIVERSAL_LINK_PATHS = [
  '/scoring/scoringScreen',
  '/scoring/scoringScreen/*',
  '/scoring/*',
  '/live-score',
  '/live-score/*',
  '/community',
  '/community/*',
  '/invite',
  '/invite/*',
];

export function buildAppleAppSiteAssociationBody() {
  const teamId = process.env.APPLE_TEAM_ID?.trim();
  const appId = teamId ? `${teamId}.${APP_BUNDLE_ID}` : null;

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
  const fingerprint = process.env.ANDROID_SHA256_CERT_FINGERPRINT?.trim();
  if (!fingerprint) return [];

  return [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: APP_BUNDLE_ID,
        sha256_cert_fingerprints: [fingerprint],
      },
    },
  ];
}
