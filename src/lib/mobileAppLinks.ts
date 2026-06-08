/** Player app (com.ofside.ofside) — used by ofside.in deep links and open-in-app pages. */

export const APP_BUNDLE_ID = 'com.ofside.ofside';
export const APP_SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME ?? 'ofside';
export const APP_LINK_ORIGIN =
  process.env.NEXT_PUBLIC_APP_LINK_ORIGIN?.replace(/\/$/, '') ?? 'https://api.ofside.in';

export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_ANDROID_PLAY_STORE_URL ??
  'https://play.google.com/store/apps/details?id=com.ofside.ofside';

export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_IOS_APP_STORE_URL ??
  'https://apps.apple.com/in/app/ofside/id6762059751';

export type OpenInAppTarget = {
  /** Expo Router path, e.g. /scoring/scoringScreen */
  appPath: string;
  searchParams: URLSearchParams;
};

/** Verified universal link — tapping this can open the app when App Links / UL are configured. */
export function buildUniversalWebUrl(
  target: OpenInAppTarget,
  origin: string = APP_LINK_ORIGIN
): string {
  const path = target.appPath.startsWith('/') ? target.appPath : `/${target.appPath}`;
  const qs = target.searchParams.toString();
  return `${origin.replace(/\/$/, '')}${path}${qs ? `?${qs}` : ''}`;
}

/** Custom scheme link that opens the React Native app (ofside://scoring/scoringScreen?…). */
export function buildCustomSchemeUrl(target: OpenInAppTarget): string {
  const path = target.appPath.replace(/^\//, '');
  const qs = target.searchParams.toString();
  return `${APP_SCHEME}://${path}${qs ? `?${qs}` : ''}`;
}

/** Android intent via custom scheme — fallback when App Link intent is unavailable. */
export function buildAndroidIntentUrl(
  target: OpenInAppTarget,
  playStoreUrl: string = PLAY_STORE_URL
): string {
  const path = target.appPath.replace(/^\//, '');
  const qs = target.searchParams.toString();
  const intentPath = `${path}${qs ? `?${qs}` : ''}`;
  const fallback = encodeURIComponent(playStoreUrl);
  return `intent://${intentPath}#Intent;scheme=${APP_SCHEME};package=${APP_BUNDLE_ID};S.browser_fallback_url=${fallback};end`;
}

/**
 * Android intent via https App Link — works from many in-app browsers (WhatsApp) when the user taps.
 * Auto-redirect with this URL often opens the installed app without leaving the chat browser.
 */
export function buildAndroidAppLinkIntentUrl(
  universalWebUrl: string,
  playStoreUrl: string = PLAY_STORE_URL
): string {
  const url = new URL(universalWebUrl);
  const intentHost = `${url.host}${url.pathname}${url.search}`;
  const fallback = encodeURIComponent(playStoreUrl);
  return `intent://${intentHost}#Intent;scheme=https;package=${APP_BUNDLE_ID};S.browser_fallback_url=${fallback};end`;
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

/** WhatsApp, Instagram, etc. block automatic custom-scheme redirects — show a tap target instead. */
export function isInAppBrowserUserAgent(userAgent: string): boolean {
  return /WhatsApp|Instagram|FBAN|FBAV|Twitter|Line\/|Snapchat|TikTok|LinkedInApp|Telegram|Messenger/i.test(
    userAgent
  );
}

export function storeUrlForUserAgent(userAgent: string): string {
  if (isIosUserAgent(userAgent)) return APP_STORE_URL;
  if (isAndroidUserAgent(userAgent)) return PLAY_STORE_URL;
  return PLAY_STORE_URL;
}
