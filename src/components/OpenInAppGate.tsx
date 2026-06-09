'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  APP_STORE_URL,
  APP_SCHEME,
  buildAndroidAppLinkIntentUrl,
  buildAndroidIntentUrl,
  buildCustomSchemeUrl,
  buildUniversalWebUrl,
  isAndroidUserAgent,
  isInAppBrowserUserAgent,
  isIosUserAgent,
  isMobileUserAgent,
  PLAY_STORE_URL,
  storeUrlForUserAgent,
  type OpenInAppTarget,
} from '@/lib/mobileAppLinks';

type Props = {
  target: OpenInAppTarget;
  title?: string;
  description?: string;
};

/**
 * Opens the native app on mobile. In-app browsers (WhatsApp) block auto-redirects,
 * so we always show a tap-to-open button immediately.
 */
export default function OpenInAppGate({
  target,
  title = 'Opening Ofside…',
  description = 'Watch live scores, track stats, and play with your crew on Ofside.',
}: Props) {
  const [phase, setPhase] = useState<'trying' | 'fallback' | 'desktop'>('trying');
  const appUrl = useMemo(() => buildCustomSchemeUrl(target), [target]);
  const universalWebUrl = useMemo(() => buildUniversalWebUrl(target), [target]);
  const androidIntentUrl = useMemo(() => buildAndroidIntentUrl(target), [target]);
  const androidAppLinkIntentUrl = useMemo(
    () => buildAndroidAppLinkIntentUrl(universalWebUrl),
    [universalWebUrl]
  );

  useEffect(() => {
    const ua = navigator.userAgent ?? '';
    if (!isMobileUserAgent(ua)) {
      setPhase('desktop');
      return;
    }

    const inAppBrowser = isInAppBrowserUserAgent(ua);
    if (inAppBrowser) {
      setPhase('fallback');
      return;
    }

    const storeUrl = storeUrlForUserAgent(ua);
    let appOpened = false;
    let storeTimer: number | null = null;

    const clearStoreTimer = () => {
      if (storeTimer != null) {
        window.clearTimeout(storeTimer);
        storeTimer = null;
      }
    };

    const onHide = () => {
      appOpened = true;
      clearStoreTimer();
    };

    const scheduleStoreFallback = (delayMs: number) => {
      clearStoreTimer();
      storeTimer = window.setTimeout(() => {
        if (appOpened || document.visibilityState === 'hidden') return;
        window.location.replace(storeUrl);
        window.setTimeout(() => {
          if (!appOpened && document.visibilityState === 'visible') {
            setPhase('fallback');
          }
        }, 800);
      }, delayMs);
    };

    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onHide);

    if (isAndroidUserAgent(ua)) {
      window.location.replace(androidAppLinkIntentUrl);
      scheduleStoreFallback(900);
    } else if (isIosUserAgent(ua)) {
      window.location.href = appUrl;
      scheduleStoreFallback(750);
    } else {
      window.location.href = appUrl;
      scheduleStoreFallback(750);
    }

    return () => {
      clearStoreTimer();
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onHide);
    };
  }, [appUrl, androidAppLinkIntentUrl]);

  const storeHref =
    typeof navigator !== 'undefined'
      ? storeUrlForUserAgent(navigator.userAgent ?? '')
      : PLAY_STORE_URL;

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent ?? '' : '';
  const isMobile = isMobileUserAgent(ua);
  const isAndroid = isAndroidUserAgent(ua);
  const openHref = isAndroid ? androidAppLinkIntentUrl : appUrl;
  const showOpenButton = isMobile && (phase === 'trying' || phase === 'fallback');

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 rounded-2xl bg-[#FFF201] px-6 py-3">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Ofside</p>
      </div>
      <h1 className="text-2xl font-bold text-gray-950">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-gray-600">{description}</p>

      {showOpenButton && (
        <div className="mt-8 flex w-full flex-col gap-3">
          <a
            href={openHref}
            className="rounded-2xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white"
          >
            Open in Ofside app
          </a>
          {phase === 'fallback' && (
            <p className="text-sm text-gray-500">
              Tap the button above if the app did not open automatically.
              {isInAppBrowserUserAgent(ua)
                ? ' In WhatsApp or Instagram, you may need to tap ⋮ and choose Open in browser first.'
                : null}
            </p>
          )}
        </div>
      )}

      {phase === 'trying' && isMobile && !isInAppBrowserUserAgent(ua) && (
        <p className="mt-6 text-sm text-gray-500">Launching the Ofside app…</p>
      )}

      {(phase === 'fallback' || phase === 'desktop') && (
        <div className={`flex w-full flex-col gap-3 ${showOpenButton ? 'mt-6' : 'mt-10'}`}>
          {phase === 'desktop' && (
            <a
              href={universalWebUrl}
              className="rounded-2xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white"
            >
              Open on mobile
            </a>
          )}
          {phase === 'fallback' && !showOpenButton && (
            <a
              href={openHref}
              className="rounded-2xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white"
            >
              Open in Ofside app
            </a>
          )}
          <a
            href={storeHref}
            className="rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-950"
          >
            {isAndroid
              ? 'Get it on Google Play'
              : isIos
                ? 'Download on the App Store'
                : phase === 'desktop'
                  ? 'Get the app'
                  : 'Install Ofside'}
          </a>
          {phase === 'desktop' && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={PLAY_STORE_URL}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium"
              >
                Google Play
              </a>
              <a
                href={APP_STORE_URL}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium"
              >
                App Store
              </a>
            </div>
          )}
        </div>
      )}

      <p className="mt-10 max-w-sm text-xs text-gray-400">
        Link uses the {APP_SCHEME}:// scheme and {universalWebUrl.replace(/\?.*$/, '')} universal links.
      </p>
    </main>
  );
}
