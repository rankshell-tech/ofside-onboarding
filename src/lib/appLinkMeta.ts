import {
  APP_BUNDLE_ID,
  APP_STORE_URL,
  buildCustomSchemeUrl,
  type OpenInAppTarget,
} from '@/lib/mobileAppLinks';

const APP_NAME = 'Ofside';

export function extractAppleAppStoreId(storeUrl: string): string | null {
  const match = storeUrl.match(/\/id(\d+)/i);
  return match?.[1] ?? null;
}

/** Meta App Links + Open Graph — WhatsApp/Messenger read these to open the native app. */
export function buildAppLinkHeadTags(target: OpenInAppTarget, canonicalWebUrl: string): Record<string, string> {
  const appUrl = buildCustomSchemeUrl(target);
  const appStoreId = extractAppleAppStoreId(APP_STORE_URL);

  const tags: Record<string, string> = {
    'og:type': 'website',
    'og:url': canonicalWebUrl,
    'al:web:url': canonicalWebUrl,
    'al:web:should_fallback': 'true',
    'al:ios:url': appUrl,
    'al:ios:app_name': APP_NAME,
    'al:android:url': appUrl,
    'al:android:package': APP_BUNDLE_ID,
    'al:android:app_name': APP_NAME,
  };

  if (appStoreId) {
    tags['al:ios:app_store_id'] = appStoreId;
  }

  return tags;
}

export function appLinkMetaToNextMetadata(
  target: OpenInAppTarget,
  canonicalWebUrl: string,
  title: string,
  description: string
) {
  const appLinkTags = buildAppLinkHeadTags(target, canonicalWebUrl);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalWebUrl,
      type: 'website',
    },
    other: appLinkTags,
  };
}
