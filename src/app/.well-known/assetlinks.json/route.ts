import { APP_BUNDLE_ID } from '@/lib/mobileAppLinks';

/**
 * Android App Links — https://ofside.in/.well-known/assetlinks.json
 * Set ANDROID_SHA256_CERT_FINGERPRINT (release keystore SHA-256, colon-separated).
 */
export async function GET() {
  const fingerprint = process.env.ANDROID_SHA256_CERT_FINGERPRINT?.trim();

  const body = fingerprint
    ? [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: APP_BUNDLE_ID,
            sha256_cert_fingerprints: [fingerprint],
          },
        },
      ]
    : [];

  return Response.json(body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
