'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  APP_STORE_URL,
  APP_SCHEME,
  buildCustomSchemeUrl,
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
 * Tries to open the native app via custom scheme, then sends mobile users to the store.
 * Desktop users see manual download buttons (no auto store redirect).
 */
export default function OpenInAppGate({
  target,
  title = 'Opening Ofside…',
  description = 'Watch live scores, track stats, and play with your crew on Ofside.',
}: Props) {
  const [phase, setPhase] = useState<'trying' | 'fallback' | 'desktop'>('trying');
  const appUrl = useMemo(() => buildCustomSchemeUrl(target), [target]);

  useEffect(() => {
    const ua = navigator.userAgent ?? '';
    if (!isMobileUserAgent(ua)) {
      setPhase('desktop');
      return;
    }

    window.location.href = appUrl;

    const timer = window.setTimeout(() => {
      setPhase('fallback');
      window.location.href = storeUrlForUserAgent(ua);
    }, 2200);

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(timer);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [appUrl]);

  const storeHref =
    typeof navigator !== 'undefined'
      ? storeUrlForUserAgent(navigator.userAgent ?? '')
      : PLAY_STORE_URL;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 rounded-2xl bg-[#FFF201] px-6 py-3">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Ofside</p>
      </div>
      <h1 className="text-2xl font-bold text-gray-950">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-gray-600">{description}</p>

      {phase === 'trying' && (
        <p className="mt-8 text-sm text-gray-500">Launching the app…</p>
      )}

      {(phase === 'fallback' || phase === 'desktop') && (
        <div className="mt-10 flex w-full flex-col gap-3">
          <a
            href={appUrl}
            className="rounded-2xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white"
          >
            Open in Ofside app
          </a>
          <a
            href={storeHref}
            className="rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-950"
          >
            {phase === 'desktop' ? 'Get the app' : 'Install Ofside'}
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
        Link uses the {APP_SCHEME}:// scheme. After install, open this page again or tap the shared
        link in chat.
      </p>
    </main>
  );
}
