import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { EVENT, formatInr, priceForCheckout } from "@/lib/eventConfig";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/mobileAppLinks";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import RegistrationForm from "./RegistrationForm";
import CountUp from "./CountUp";

export const metadata: Metadata = {
  title: `${EVENT.seriesName} — ${EVENT.name}`,
  description: `${EVENT.tagline} ${EVENT.shortDescription}`,
  robots: { index: false, follow: false },
  openGraph: {
    title: `${EVENT.seriesName} — ${EVENT.name}`,
    description: `${EVENT.tagline} ${EVENT.shortDescription}`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;
const baseTotal = priceForCheckout(false);

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Matched, consistent line icons — order follows EVENT.highlights:
// trophy (guaranteed matches), gift (free PRO), camera (photos/reels), tag (women's discount).
const highlightIcons = [
  <svg key="0" {...iconProps}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
  </svg>,
  <svg key="1" {...iconProps}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" />
  </svg>,
  <svg key="2" {...iconProps}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>,
  <svg key="3" {...iconProps}>
    <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>,
];

const perks = [
  { label: "2 guaranteed matches", hint: "no sitting out" },
  { label: "FREE Ofside PRO", hint: "with every entry" },
  { label: "Photos & reels", hint: "on the night" },
  { label: "Community drops", hint: "show up for giveaways" },
];

// Clean line icons for the perks strip — check, star (premium), camera, gift.
const perkIcons = [
  <svg key="0" {...iconProps}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>,
  <svg key="1" {...iconProps}><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.8 5.7 21l2.3-7.2-6-4.4h7.6z" /></svg>,
  <svg key="2" {...iconProps}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>,
  <svg key="3" {...iconProps}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" />
  </svg>,
];

// Fun, color-blocked treatments for the highlight cards (order matches EVENT.highlights).
const highlightKickers = ["no benchwarming", "free perk", "main character", "ladies get in"];
const highlightStyles = [
  { wrap: "bg-gray-950 text-white", body: "text-white/65", icon: "bg-yellow-400 text-gray-950", kicker: "text-yellow-300", num: "text-white/10", rot: "-rotate-1" },
  { wrap: "bg-yellow-400 text-gray-950", body: "text-gray-900/70", icon: "bg-gray-950 text-yellow-400", kicker: "text-gray-900/60", num: "text-gray-950/10", rot: "rotate-1" },
  { wrap: "bg-white border-2 border-gray-200 text-gray-950", body: "text-gray-600", icon: "bg-gray-950 text-yellow-400", kicker: "text-amber-600", num: "text-gray-900/[0.06]", rot: "-rotate-1" },
  { wrap: "bg-gray-950 text-white", body: "text-white/65", icon: "bg-yellow-400 text-gray-950", kicker: "text-yellow-300", num: "text-white/10", rot: "rotate-1" },
];

// Auto-playing vertical clips for the "straight from the court" reels wall.
// Drop your real badminton files at the /assets/reels/*.mp4 paths below; until then each card
// falls back to an existing vertical clip (the browser skips a 404 <source> and uses the next).
// The app-scoring card already uses the real portrait app demo (ofside-mobile.mp4).
const VERTICAL_FALLBACK = "/assets/football-playing-vertical.mp4";

// Curated order of clips from public/assets/videos.
const REEL_ORDER = [
  "8053650-uhd_2160_3840_25fps.mp4",
  "15010414_1080_1920_30fps.mp4",
  "8053486-uhd_2160_3840_25fps.mp4",
  "15010416_1080_1920_30fps.mp4",
  "8058176-uhd_2160_3840_25fps.mp4",
];

/** Rotating captions across the clips (order = REEL_ORDER). */
const reelCaptions = [
  "Rallies that actually go hard",
  "Event-day energy, all night",
  "Playing with everything they've got",
  "Winners walk home with the drops",
  "Community, but make it competitive",
  "Show up. Play. Repeat.",
  "Good games, better people",
  "This is the vibe fr",
];

function buildReels() {
  return REEL_ORDER.map((file, i) => ({
    src: `/assets/videos/${encodeURIComponent(file)}`,
    caption: reelCaptions[i % reelCaptions.length],
    fallback: VERTICAL_FALLBACK,
  }));
}

const tickerWords = [
  "MEET",
  "PLAY",
  "CONNECT",
  "REPEAT",
  "BADMINTON DOUBLES",
  "DELHI NCR",
  "FREE PRO",
];

/** Streetwear-style scrolling marquee band. Two copies for a seamless loop. */
function Ticker({
  reverse,
  className,
}: {
  reverse?: boolean;
  className?: string;
}) {
  const row = [...tickerWords, ...tickerWords];
  return (
    <div className={`flex overflow-hidden ${className ?? ""}`}>
      <div
        className={`flex shrink-0 items-center whitespace-nowrap ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {row.map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="mx-4 text-[13px] font-black uppercase tracking-[0.18em] sm:mx-6 sm:text-sm">
              {word}
            </span>
            <span aria-hidden className="text-base leading-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

async function getSoldOut(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  try {
    await connectToDB();
    const paid = await EventRegistration.countDocuments({
      eventSlug: EVENT.slug,
      paymentStatus: "paid",
    });
    return paid >= EVENT.maxRegistrations;
  } catch {
    return false;
  }
}

export default async function EventPage() {
  const soldOut = await getSoldOut();
  const reels = buildReels();

  return (
    <main className="bg-[#f6f4ec] text-gray-900">
      {/* ===================== HERO ===================== */}
      <section className="relative isolate flex min-h-[94vh] flex-col overflow-hidden bg-[#08090c] text-white">
        <video
          className="absolute inset-0 -z-30 h-full w-full object-cover opacity-80"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/assets/videos/8053649-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(8,9,12,0.9)_0%,rgba(8,9,12,0.62)_45%,rgba(8,9,12,0.35)_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_top,#08090c_2%,transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_85%_10%,rgba(255,242,1,0.18)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-yellow-400/25 blur-[100px] animate-glow" />
        <div className="pointer-events-none absolute right-10 top-1/3 -z-10 h-80 w-80 rounded-full bg-amber-500/20 blur-[120px] animate-glow-slow" />

        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16 sm:px-8 sm:py-20">
          <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            {/* Left: brand + narration */}
            <div className="flex flex-col justify-center" data-reveal>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-300" />
                Delhi NCR · Badminton Doubles
              </span>

              <h1 className="mt-6 sr-only">{EVENT.seriesName}</h1>
              <Image
                src={EVENT.logoSrc}
                alt={EVENT.seriesName}
                width={720}
                height={144}
                priority
                className="-ml-2 mt-2 h-auto w-full max-w-[min(100%,26rem)] object-contain object-left drop-shadow-[0_0_40px_rgba(255,242,1,0.28)] sm:-ml-3 sm:mt-3"
              />

              <p className="mt-2 max-w-md text-[2rem] font-black leading-[1.15] tracking-tight text-white sm:mt-3 sm:text-[2.6rem]">
                {EVENT.tagline.split(" ").map((word, i) => (
                  <span key={i}>
                    {i % 2 === 1 ? (
                      <span className="box-decoration-clone rounded-md bg-yellow-400 px-2 text-gray-950">
                        {word}
                      </span>
                    ) : (
                      word
                    )}{" "}
                  </span>
                ))}
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70 sm:text-base">
                {EVENT.shortDescription}
              </p>

              <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white/70 ring-1 ring-inset ring-white/15 backdrop-blur">
                📍 {EVENT.venueName} · {EVENT.timeWindow}
                {!EVENT.detailsFinal ? " · details TBA" : null}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {soldOut ? (
                  <span className="rounded-full bg-red-500/20 px-7 py-3.5 text-[15px] font-extrabold text-red-200 ring-1 ring-inset ring-red-400/30">
                    Sold out
                  </span>
                ) : (
                  <a
                    href="#register"
                    className="group animate-sheen relative overflow-hidden rounded-full bg-yellow-400 px-8 py-4 text-[15px] font-black uppercase tracking-wide text-gray-950 shadow-[0_12px_34px_-8px_rgba(255,242,1,0.6)] transition hover:scale-[1.03] hover:bg-yellow-300"
                  >
                    Grab your spot →
                  </a>
                )}
                <a
                  href="#about"
                  className="rounded-full border-2 border-white/40 px-7 py-4 text-[15px] font-bold text-white transition hover:border-white hover:bg-white hover:text-gray-950"
                >
                  See details
                </a>
              </div>
            </div>

            {/* Right: ticket card */}
            <div className="group/ticket relative max-w-md rotate-1 transition-transform duration-500 ease-out hover:rotate-0 lg:ml-auto lg:max-w-none" data-reveal>
              <div className="animate-glow pointer-events-none absolute -inset-6 -z-10 rounded-[2.75rem] bg-[radial-gradient(circle_at_50%_25%,rgba(255,242,1,0.32),transparent_70%)] blur-2xl" />
              <div className="overflow-hidden rounded-[28px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] ring-1 ring-yellow-400/20">
                {/* Header — dark with yellow glow + dotted texture */}
                <div className="relative overflow-hidden bg-[#08090c] px-6 pb-8 pt-5 text-white">
                  <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-yellow-400/25 blur-3xl transition-opacity duration-500 group-hover/ticket:opacity-70" />
                  <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:14px_14px]" />
                  <div className="relative mb-4 flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300">Entry pass</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-gray-950 shadow-[0_6px_18px_-6px_rgba(255,242,1,0.8)]">
                      🎁 Free PRO
                    </span>
                  </div>
                  <div className="relative flex items-end justify-between gap-3">
                    <div>
                      <p className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-6xl font-black tracking-tight text-transparent">
                        ₹{EVENT.displayPriceInr}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-white/45">per player · from</p>
                    </div>
                    <p className="pb-1.5 text-right text-sm font-bold text-white/70">
                      ₹{formatInr(baseTotal)}
                      <span className="block text-[10px] font-medium uppercase tracking-wide text-white/40">pair total</span>
                    </p>
                  </div>
                </div>

                {/* Perforation seam — side notches + dashed line (ticket-stub) */}
                <div className="relative bg-white">
                  <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#08090c]" />
                  <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#08090c]" />
                  <div className="mx-5 border-t-2 border-dashed border-gray-200" />
                </div>

                <div className="space-y-5 bg-white px-6 pb-6 pt-5">
                  <div className="space-y-1 text-sm">
                    {[
                      {
                        k: "When",
                        v: `${EVENT.dateShort} · ${EVENT.timeWindow}`,
                        icon: (
                          <svg {...iconProps} width={16} height={16}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                        ),
                      },
                      {
                        k: "Where",
                        v: EVENT.venueName,
                        icon: (
                          <svg {...iconProps} width={16} height={16}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        ),
                      },
                      {
                        k: "Spots",
                        v: soldOut ? "Sold out" : `${EVENT.maxRegistrations} doubles left`,
                        icon: (
                          <svg {...iconProps} width={16} height={16}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" /><path d="M13 5v14" /></svg>
                        ),
                      },
                    ].map((row, i, arr) => (
                      <div
                        key={row.k}
                        className={`flex items-center justify-between gap-4 py-2.5 ${i < arr.length - 1 ? "border-b border-dashed border-gray-200" : ""}`}
                      >
                        <span className="flex items-center gap-2.5 text-gray-400">
                          <span className="text-gray-950">{row.icon}</span>
                          {row.k}
                        </span>
                        <span className="text-right font-bold text-gray-950">{row.v}</span>
                      </div>
                    ))}
                  </div>

                  {soldOut ? (
                    <div className="w-full rounded-full bg-gray-200 py-4 text-center text-[15px] font-extrabold text-gray-500">
                      Sold out
                    </div>
                  ) : (
                    <a
                      href="#register"
                      className="animate-sheen relative block w-full overflow-hidden rounded-full bg-yellow-400 py-4 text-center text-[15px] font-black uppercase tracking-wide text-gray-950 shadow-[0_14px_34px_-10px_rgba(255,242,1,0.75)] transition hover:scale-[1.02] hover:bg-yellow-300"
                    >
                      Book tickets →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== REELS WALL ===================== */}
      <section className="relative overflow-hidden bg-[#08090c] py-14 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_15%_0%,rgba(255,242,1,0.12)_0%,transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-8" data-reveal>
          <span className="inline-block -rotate-1 rounded-md bg-yellow-400 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-gray-950">
            straight from the court
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-[2.5rem] sm:leading-[1.05]">
            Real sessions. Real people.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Real vibes.</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rotate-1 bg-yellow-400/70" />
            </span>
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/60">
            Rallies, wins, laughs, and live scoring — this is what an Ofside night actually looks like.
          </p>
        </div>

        {/* horizontal reels row — autoplay, muted, looping. Centered when it fits, scrolls when it overflows. */}
        <div className="mt-8 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max snap-x snap-mandatory gap-4">
            {reels.map((r, i) => (
              <div
                key={i}
                className="group relative aspect-[9/16] w-[220px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1.5 hover:ring-yellow-400/50 sm:w-[240px]"
              >
                <video
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden
                >
                  <source src={r.src} type="video/mp4" />
                  <source src={r.fallback} type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/25" />
                <span className="absolute left-3 top-3 rounded-md bg-black/40 px-2 py-1 text-[10px] font-black uppercase tracking-wide backdrop-blur">
                  Ofside
                </span>
                <p className="absolute inset-x-3 bottom-3 text-[15px] font-black leading-tight drop-shadow">
                  {r.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MARQUEE BAND ===================== */}
      <div className="relative -rotate-1 border-y-2 border-gray-950 bg-yellow-400 py-3 text-gray-950">
        <Ticker />
      </div>

      {/* ===================== PERKS ===================== */}
      <section className="bg-[#0b0c10]">
        <div className="mx-auto grid max-w-6xl gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((item, i) => (
            <div
              key={item.label}
              className="group flex items-center gap-4 bg-[#0b0c10] px-6 py-6 transition hover:bg-[#111318] sm:flex-col sm:items-start sm:gap-3.5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400 ring-1 ring-inset ring-yellow-400/20 transition duration-300 group-hover:bg-yellow-400 group-hover:text-gray-950">
                {perkIcons[i % perkIcons.length]}
              </span>
              <div>
                <p className="text-[15px] font-black text-white">{item.label}</p>
                <p className="text-xs uppercase tracking-wide text-white/40">{item.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== ABOUT + STATS ===================== */}
      <section id="about" className="scroll-mt-20 border-t border-gray-950/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24" data-reveal>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:items-center">
            <div>
              <span className="inline-block -rotate-1 rounded-md bg-gray-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-yellow-400">
                the lowdown
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-950 sm:text-[2.75rem] sm:leading-[1.05]">
                A doubles night that&apos;s{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">capped, competitive</span>
                  <span className="absolute inset-x-0 bottom-1 -z-0 h-3 -rotate-1 bg-yellow-400/70" />
                </span>{" "}
                &amp; full of vibes.
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-gray-600 sm:text-base">
                Grab a partner, pull up to {EVENT.venueName} on Saturday, and get at least{" "}
                <span className="font-bold text-gray-950">2 doubles games</span> in — nobody&apos;s stuck on the bench.
                Photos, giveaways &amp; <span className="font-bold text-gray-950">FREE Ofside PRO</span> come standard.
                Only {EVENT.maxRegistrations} pairs ({EVENT.maxPlayers} players), so don&apos;t sleep on it — roll in 20 mins early.
              </p>
              {!EVENT.detailsFinal ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
                  ⚡ Exact date &amp; pin still TBA — confirmed details go out on email.
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { n: "48", l: "Players max" },
                { n: "2h", l: "Session window" },
                { n: "2", l: "Guaranteed matches" },
                { n: "₹250", l: "Per player" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className={`group relative overflow-hidden rounded-3xl border-2 p-6 transition duration-300 hover:-translate-y-1.5 ${
                    i === 0
                      ? "border-gray-950 bg-yellow-400 text-gray-950"
                      : "border-gray-200 bg-white text-gray-950 hover:border-gray-950"
                  }`}
                >
                  <CountUp value={s.n} className="block text-[2.4rem] font-black leading-none tracking-tight" />
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] opacity-60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EVENT.highlights.map((h, i) => {
              const st = highlightStyles[i % highlightStyles.length];
              return (
                <div
                  key={h.title}
                  className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_24px_55px_-24px_rgba(0,0,0,0.55)] ${st.wrap} ${st.rot}`}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}
                >
                  <span className={`pointer-events-none absolute -right-1 -top-3 select-none text-7xl font-black ${st.num}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${st.icon}`}>
                    {highlightIcons[i % highlightIcons.length]}
                  </div>
                  <p className={`relative mt-4 text-[11px] font-black uppercase tracking-[0.14em] ${st.kicker}`}>
                    {highlightKickers[i % highlightKickers.length]}
                  </p>
                  <h3 className="relative mt-1 text-lg font-black leading-tight">{h.title}</h3>
                  <p className={`relative mt-2 text-sm leading-relaxed ${st.body}`}>{h.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== THE RUNDOWN (schedule) ===================== */}
      <section className="relative overflow-hidden bg-[#08090c] text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_90%_0%,rgba(255,242,1,0.12)_0%,transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24" data-reveal>
          <span className="inline-block rotate-1 rounded-md bg-yellow-400 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-gray-950">
            The rundown
          </span>
          <h2 className="mt-4 max-w-lg text-3xl font-black tracking-tight sm:text-[2.5rem] sm:leading-[1.05]">
            How the night plays out
          </h2>

          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {EVENT.schedule.map((step, i) => (
              <li
                key={step.label}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1.5 hover:border-yellow-300/60 hover:bg-white/[0.07]"
              >
                <span className="text-4xl font-black text-white/10 transition group-hover:text-yellow-400/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-sm font-black text-yellow-300">{step.time}</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-white/85">{step.label}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== LIVE ON THE APP ===================== */}
      <section className="relative overflow-hidden bg-white text-gray-950">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-yellow-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" /> FREE with entry
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-[2.5rem] sm:leading-[1.05]">
              Your ticket unlocks{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Ofside PRO</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rotate-1 bg-yellow-400/70" />
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-gray-600">
              Pay once for the night — PRO comes with it. Open the app after you register, pull up your matches, and
              keep the scores without hunting through a group chat.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Live scores while you play",
                "Match history on your profile",
                "No separate PRO checkout",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px] font-medium text-gray-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-950 text-yellow-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Download the app</p>
              <div className="flex flex-wrap gap-3">
                <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-gray-950 bg-white px-4 py-2.5 transition hover:-translate-y-0.5 hover:bg-yellow-400">
                  <Image src="/assets/appstore.webp" alt="App Store" width={44} height={44} className="h-9 w-9 rounded-md" />
                  <span>
                    <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Download on</span>
                    <span className="block text-sm font-bold text-gray-950">App Store</span>
                  </span>
                </a>
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-gray-950 bg-white px-4 py-2.5 transition hover:-translate-y-0.5 hover:bg-yellow-400">
                  <Image src="/assets/playstore.webp" alt="Google Play" width={44} height={44} className="h-9 w-9 rounded-md" />
                  <span>
                    <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">Get it on</span>
                    <span className="block text-sm font-bold text-gray-950">Google Play</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end" data-reveal>
            {/* Fanned trio of real app mockups — hover any to bring it forward + glow */}
            <div className="relative mx-auto h-[420px] w-full max-w-[26rem] sm:h-[480px] lg:h-[520px]">
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,rgba(255,242,1,0.35),transparent_65%)] blur-2xl" />

              {/* Left — Leaderboards */}
              <div className="group/card absolute bottom-8 left-0 w-[42%] -rotate-[9deg] transition-all duration-500 ease-out will-change-transform hover:z-30 hover:-translate-y-3 hover:rotate-0 hover:scale-[1.1]">
                <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[2.2rem] bg-[radial-gradient(circle,rgba(255,242,1,0.6),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />
                <Image
                  src="/assets/leaderboards_ofside.png"
                  alt="Ofside leaderboards"
                  width={460}
                  height={995}
                  className="h-auto w-full rounded-[1.4rem] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.5)] ring-1 ring-black/10"
                />
              </div>

              {/* Right — Community */}
              <div className="group/card absolute bottom-8 right-0 w-[42%] rotate-[9deg] transition-all duration-500 ease-out will-change-transform hover:z-30 hover:-translate-y-3 hover:rotate-0 hover:scale-[1.1]">
                <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[2.2rem] bg-[radial-gradient(circle,rgba(255,242,1,0.6),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />
                <Image
                  src="/assets/community_ofside.png"
                  alt="Ofside community games"
                  width={460}
                  height={995}
                  className="h-auto w-full rounded-[1.4rem] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.5)] ring-1 ring-black/10"
                />
              </div>

              {/* Center — Live scoring (front) */}
              <div className="group/card absolute bottom-0 left-1/2 z-10 w-[50%] -translate-x-1/2 transition-all duration-500 ease-out will-change-transform hover:z-30 hover:-translate-y-3 hover:scale-[1.08]">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.4rem] bg-[radial-gradient(circle,rgba(255,242,1,0.6),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />
                <Image
                  src="/assets/ofside_scoring.png"
                  alt="Ofside live scoring"
                  width={460}
                  height={995}
                  priority
                  className="h-auto w-full rounded-[1.6rem] shadow-[0_36px_90px_-24px_rgba(0,0,0,0.65)] ring-1 ring-black/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MARQUEE BAND (reverse) ===================== */}
      <div className="relative rotate-1 border-y-2 border-gray-950 bg-gray-950 py-3 text-yellow-400">
        <Ticker reverse />
      </div>

      {/* ===================== REGISTRATION ===================== */}
      <section id="register" className="relative isolate scroll-mt-24 overflow-hidden bg-[#08090c] text-white">
        <Image
          src="/assets/pexels-shvets-production-8007075.jpg"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-80"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,12,0.5)_0%,rgba(8,9,12,0.4)_100%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
            <div data-reveal>
              <span className="inline-block -rotate-1 rounded-md bg-yellow-400 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-gray-950">
                Register
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.05]">
                {soldOut ? "This session is full 😤" : "Grab your doubles spot 🏸"}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                One checkout = you + your partner. Email OTP to verify, then pay. Women&apos;s pairs get 10% off —
                verified at the venue.
              </p>
              <div className="mt-6 -rotate-1 rounded-[26px] border-2 border-gray-950 bg-[linear-gradient(120deg,#FFF201_0%,#FFD400_55%,#FFB800_100%)] p-6 text-gray-950 shadow-[6px_6px_0_0_#08090c]">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-900/70">From</p>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-5xl font-black">₹{EVENT.displayPriceInr}</span>
                  <span className="pb-1 text-sm font-bold text-gray-900/70">/ player</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900/75">
                  Pair checkout ₹{formatInr(baseTotal)} incl. tax · FREE PRO included
                </p>
              </div>
            </div>
            <div data-reveal>
              <RegistrationForm soldOut={soldOut} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING CTA ===================== */}
      <section className="bg-[#f6f4ec]">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-8 sm:pt-20" data-reveal>
          <div className="relative overflow-hidden rounded-[32px] border-2 border-gray-950 bg-[linear-gradient(120deg,#FFF201_0%,#FFD400_55%,#FFB800_100%)] p-8 text-gray-950 shadow-[8px_8px_0_0_#08090c] sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-spin-slow rounded-full border-[10px] border-dashed border-gray-950/10" />
            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900/70">Entry fee</p>
                <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="text-6xl font-black tracking-tight sm:text-7xl">₹{EVENT.displayPriceInr}</span>
                  <span className="pb-2 font-bold text-gray-900/70">/ player</span>
                </div>
                <p className="mt-1 text-sm font-bold text-gray-900/80">
                  Doubles checkout · ₹{formatInr(baseTotal)} total (incl. tax)
                </p>
                <p className="mt-3 max-w-md text-sm font-semibold text-gray-900/80">
                  You + your partner · 2 matches · FREE PRO · photos &amp; giveaways.{" "}
                  Women&apos;s pairs −10%. Only {EVENT.maxRegistrations} spots.
                </p>
              </div>
              {soldOut ? (
                <span className="shrink-0 rounded-full bg-gray-950/20 px-8 py-4 text-[15px] font-extrabold text-gray-800">
                  Sold out
                </span>
              ) : (
                <a
                  href="#register"
                  className="shrink-0 rounded-full bg-gray-950 px-8 py-4 text-[15px] font-black uppercase tracking-wide text-white transition hover:scale-[1.03] hover:bg-gray-800"
                >
                  Grab your spot →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-8" data-reveal>
        <span className="inline-block rotate-1 rounded-md bg-gray-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-yellow-400">
          Good to know
        </span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">Questions, answered</h2>
        <div className="mt-8 space-y-3">
          {EVENT.faqs.map((f) => (
            <details key={f.q} className="group rounded-3xl border-2 border-gray-200 bg-white p-5 transition open:border-gray-950 open:shadow-[4px_4px_0_0_#FFF201]">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-gray-900">
                {f.q}
                <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-950 text-lg leading-none text-yellow-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===================== LOCATION + FINAL CTA ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-2" data-reveal>
          <div className="rounded-[28px] border-2 border-gray-950 bg-white p-8 shadow-[6px_6px_0_0_#08090c]">
            <span className="inline-block -rotate-1 rounded-md bg-gray-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-yellow-400">
              Venue
            </span>
            <h3 className="mt-3 text-2xl font-black text-gray-950">{EVENT.venueName}</h3>
            <p className="mt-2 text-sm text-gray-600">{EVENT.venueAddress}</p>
            {!EVENT.detailsFinal ? (
              <p className="mt-3 text-xs font-semibold text-amber-700">Exact pin shared once details are final.</p>
            ) : null}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-gray-950 px-5 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-yellow-400">
              Open in Maps →
            </a>
          </div>
          <div className="relative flex flex-col justify-center overflow-hidden rounded-[28px] bg-[#08090c] p-8 text-white">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_90%_at_100%_0%,rgba(255,242,1,0.24)_0%,transparent_60%)]" />
            <h3 className="text-4xl font-black italic tracking-tight">{soldOut ? "Next one's coming 👀" : "Ready to play? 🔥"}</h3>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              {soldOut
                ? "This drop is full. Keep an eye on Ofside for the next community session."
                : "Limited doubles spots. Lock yours before it flips to sold out."}
            </p>
            {!soldOut ? (
              <a href="#register" className="mt-6 w-fit rounded-full bg-yellow-400 px-8 py-4 text-[15px] font-black uppercase tracking-wide text-gray-950 transition hover:scale-[1.03] hover:bg-yellow-300">
                Register now
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          By registering you agree to our{" "}
          <Link href="/terms-and-conditions" className="underline hover:text-gray-700">Terms</Link> and{" "}
          <Link href="/refund" className="underline hover:text-gray-700">Refund Policy</Link>.
        </p>
      </section>
    </main>
  );
}
