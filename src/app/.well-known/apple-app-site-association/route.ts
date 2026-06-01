import { APP_BUNDLE_ID } from '@/lib/mobileAppLinks';

/**
 * iOS Universal Links — serve at https://ofside.in/.well-known/apple-app-site-association
 * Set APPLE_TEAM_ID in the deployment env (10-character Team ID from Apple Developer).
 */
export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID?.trim();

  const body = {
    applinks: {
      apps: [],
      details: teamId
        ? [
            {
              appID: `${teamId}.${APP_BUNDLE_ID}`,
              paths: ['/scoring/*', '/live-score', '/live-score/*', '/invite', '/invite/*'],
            },
          ]
        : [],
    },
  };

  return Response.json(body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
