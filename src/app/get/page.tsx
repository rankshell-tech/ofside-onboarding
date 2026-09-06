import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const IOS_URL =
  "https://apps.apple.com/in/app/ofside-sports-ecosystem/id6762059751";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.ofside.ofside";

// The redirect depends on the request's User-Agent, so this page must never be
// cached or statically prerendered — otherwise the first visitor's device wins
// for everyone.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Ofside",
  description: "Download Ofside for iPhone or Android.",
  robots: { index: false, follow: false },
};

// iPadOS 13+ in desktop mode sends a Macintosh User-Agent, so the server can't
// tell it from a real Mac. This runs only when the page actually renders (i.e.
// the server didn't redirect) and catches that case via touch points.
const CLIENT_FALLBACK = `
(function(){
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) ||
              (/Mac/.test(navigator.platform || "") && (navigator.maxTouchPoints || 0) > 1);
  if (isIOS) { location.replace(${JSON.stringify(IOS_URL)}); return; }
  if (/Android/.test(ua)) { location.replace(${JSON.stringify(ANDROID_URL)}); }
})();
`;

export default async function GetPage() {
  // headers() is async in Next 15. Awaiting is harmless on Next 14, where it
  // returns the object directly.
  const requestHeaders = await headers();
  const ua = requestHeaders.get("user-agent") ?? "";

  if (/iPad|iPhone|iPod/i.test(ua)) redirect(IOS_URL);
  if (/Android/i.test(ua)) redirect(ANDROID_URL);

  return (
    <>
      <style>{css}</style>

      <div className="ofs-page">
        <div className="ofs-pitch" aria-hidden="true">
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMaxYMid slice">
            <line className="ofs-draw" x1="640" y1="-20" x2="640" y2="620" />
            <circle className="ofs-draw" cx="640" cy="300" r="150" />
            <circle
              cx="640"
              cy="300"
              r="4"
              fill="rgba(241,244,239,.28)"
              stroke="none"
            />
            <path className="ofs-draw" d="M800 120 H700 V480 H800" />
          </svg>
        </div>

        <main className="ofs-main">
          <svg className="ofs-flag" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 22V3"
              stroke="#F1F4EF"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M6.9 3.4 19 7.2 6.9 11z" fill="#FFD23F" />
          </svg>

          <h1 className="ofs-h1">
            <span className="ofs-mark">Ofside</span>
          </h1>

          <p className="ofs-status">
            Ofside runs on iPhone and Android. Open this page on your phone, or
            pick a store below.
          </p>

          <div className="ofs-stores">
            <a className="ofs-store" href={IOS_URL}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.36 12.78c.02 2.5 2.19 3.33 2.22 3.34-.02.06-.35 1.2-1.15 2.38-.7 1.02-1.42 2.03-2.56 2.05-1.12.02-1.48-.66-2.76-.66-1.28 0-1.68.64-2.74.68-1.1.04-1.94-1.09-2.64-2.1-1.5-2.17-2.65-6.14-1.1-8.82.76-1.33 2.13-2.17 3.61-2.19 1.08-.02 2.1.73 2.76.73.65 0 1.9-.9 3.2-.77.54.02 2.07.2 3.05 1.65-.08.05-1.82 1.07-1.8 3.18M14.3 4.6c.58-.7.97-1.68.86-2.65-.85.03-1.88.57-2.48 1.27-.54.62-1 1.61-.88 2.56.95.07 1.92-.48 2.5-1.18" />
              </svg>
              Download on iPhone
            </a>
            <a className="ofs-store" href={ANDROID_URL}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.6 2.2a1 1 0 0 0-.35.77v18.06a1 1 0 0 0 .35.77l9.5-9.8zm10.9 8.3L5.4 1.3l10.2 5.86zM5.4 22.7l9.1-9.2 1.1 3.34zm12.1-9.6-1.3-3.9L20.3 11c.83.48.83 1.55 0 2.03l-3.4 1.95z" />
              </svg>
              Download on Android
            </a>
          </div>

          <p className="ofs-foot">Both apps are free.</p>
        </main>
      </div>

      <script dangerouslySetInnerHTML={{ __html: CLIENT_FALLBACK }} />
    </>
  );
}

const css = `
.ofs-page{
  --ofs-ink:#0E1A3A;
  --ofs-ink-deep:#091129;
  --ofs-chalk:#F1F4EF;
  --ofs-chalk-dim:rgba(241,244,239,.62);
  --ofs-flood:#FFD23F;
  --ofs-line:rgba(241,244,239,.28);
  position:fixed;
  inset:0;
  z-index:9999;
  display:flex;
  align-items:center;
  overflow:hidden;
  background:var(--ofs-ink);
  color:var(--ofs-chalk);
  font-family:Archivo,"Helvetica Neue",Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.ofs-page *{box-sizing:border-box}

.ofs-pitch{position:absolute;inset:0;pointer-events:none}
.ofs-pitch svg{width:100%;height:100%;display:block}
.ofs-pitch path,.ofs-pitch line,.ofs-pitch circle{
  fill:none;stroke:var(--ofs-line);stroke-width:1.5;
}
.ofs-draw{
  stroke-dasharray:1400;
  stroke-dashoffset:1400;
  animation:ofs-draw 1.1s cubic-bezier(.22,.61,.36,1) forwards;
}
@keyframes ofs-draw{to{stroke-dashoffset:0}}

.ofs-main{
  position:relative;
  width:100%;
  max-width:34rem;
  margin:0 auto;
  padding:2rem 1.5rem 2.5rem;
}

.ofs-flag{width:2.25rem;height:2.25rem;margin-bottom:1.75rem;display:block}

.ofs-h1{
  font-weight:900;
  font-size:clamp(2.75rem,14vw,4.75rem);
  line-height:.86;
  letter-spacing:-.035em;
  margin:0 0 1rem;
}
.ofs-mark{
  display:block;
  width:max-content;
  padding-right:.06em;
  box-shadow:inset 0 -.09em 0 0 var(--ofs-flood);
}

.ofs-status{
  font-size:1.0625rem;
  font-weight:500;
  line-height:1.5;
  color:var(--ofs-chalk-dim);
  margin:0 0 2.25rem;
  max-width:26rem;
}

.ofs-stores{display:flex;flex-direction:column;gap:.75rem;margin:0 0 1.75rem}
@media (min-width:30rem){.ofs-stores{flex-direction:row}}

.ofs-store{
  flex:1;
  display:flex;
  align-items:center;
  gap:.75rem;
  padding:.95rem 1.15rem;
  border:1.5px solid var(--ofs-line);
  border-radius:2px;
  color:var(--ofs-chalk);
  text-decoration:none;
  font-weight:700;
  font-size:1rem;
  letter-spacing:-.01em;
  transition:background .18s ease,border-color .18s ease,color .18s ease;
}
.ofs-store svg{width:1.375rem;height:1.375rem;flex:none;fill:currentColor}
.ofs-store:hover,.ofs-store:focus-visible{
  background:var(--ofs-flood);
  border-color:var(--ofs-flood);
  color:var(--ofs-ink-deep);
}
.ofs-store:focus-visible{outline:2px solid var(--ofs-flood);outline-offset:3px}

.ofs-foot{
  font-size:.8125rem;
  font-weight:500;
  line-height:1.5;
  color:rgba(241,244,239,.4);
  margin:0;
}

@media (prefers-reduced-motion:reduce){
  .ofs-draw{animation:none;stroke-dashoffset:0}
  .ofs-store{transition:none}
}
`;
