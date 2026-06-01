/** Player app (com.ofside.ofside) — used by ofside.in deep links and open-in-app pages. */

export const APP_BUNDLE_ID = 'com.ofside.ofside';
export const APP_SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME ?? 'ofside';

/** Google Play — package id works even before the listing is public in some regions. */
export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_ANDROID_PLAY_STORE_URL ??
  `https://play.google.com/store/apps/details?id=${APP_BUNDLE_ID}`;

/**
 * App Store — set NEXT_PUBLIC_IOS_APP_STORE_URL to
 * https://apps.apple.com/app/id<APPLE_APP_STORE_APP_ID> once the app is live.
 */
export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_IOS_APP_STORE_URL ??
  'https://apps.apple.com/us/app/ofside/id0000000000';

export type OpenInAppTarget = {
  /** Expo Router path, e.g. /scoring/scoringScreen */
  appPath: string;
  searchParams: URLSearchParams;
};

/** Custom scheme link that opens the React Native app (ofside://scoring/scoringScreen?…). */
export function buildCustomSchemeUrl(target: OpenInAppTarget): string {
  const path = target.appPath.replace(/^\//, '');
  const qs = target.searchParams.toString();
  return `${APP_SCHEME}://${path}${qs ? `?${qs}` : ''}`;
}

export function isMobileUserAgent(userAgent: string): boolean {
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

export function isIosUserAgent(userAgent: string): boolean {
  return /iPhone|iPad|iPod/i.test(userAgent);
}

export function isAndroidUserAgent(userAgent: string): boolean {
  return /Android/i.test(userAgent);
}

export function storeUrlForUserAgent(userAgent: string): string {
  if (isIosUserAgent(userAgent)) return APP_STORE_URL;
  if (isAndroidUserAgent(userAgent)) return PLAY_STORE_URL;
  return PLAY_STORE_URL;
}
