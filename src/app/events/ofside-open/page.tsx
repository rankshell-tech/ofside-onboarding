import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENT } from "@/lib/eventConfig";
import RegistrationForm from "./RegistrationForm";

export const metadata: Metadata = {
  title: `${EVENT.name} — Register`,
  description: EVENT.shortDescription,
  // Keep this page out of search results for now.
  robots: { index: false, follow: false },
  openGraph: {
    title: `${EVENT.name}`,
    description: EVENT.shortDescription,
    type: "website",
  },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;

const SPORTS = [
  { name: "Football 5s", img: "/assets/sports/football.webp" },
  { name: "Badminton", img: "/assets/sports/badminton.webp" },
  { name: "Box Cricket", img: "/assets/sports/box_cricket.webp" },
  { name: "Pickleball", img: "/assets/sports/pickleball.webp" },
  { name: "Table Tennis", img: "/assets/sports/table_tennis.webp" },
];

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
const highlightIcons = [
  // Live scoring — activity pulse
  <svg key="0" {...iconProps}><path d="M3 12h4l2.5 7 4-14 2.5 7H21" /></svg>,
  // Sports / arena — grid
  <svg key="1" {...iconProps}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>,
  // Prizes — trophy
  <svg key="2" {...iconProps}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
  </svg>,
  // Community — people
  <svg key="3" {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
];
const marqueeItems = ["Live Scoring", "Real Leaderboards", "5 Sports", "₹1,00,000 Prizes", "One Community", "Match Day"];

export default function EventPage() {
  return (
    <main className="bg-[#f6f4ec] text-gray-900">
      {/* ===================== HERO (cinematic video) ===================== */}
      <section className="relative isolate flex min-h-[92vh] flex-col overflow-hidden bg-[#08090c] text-white">
        {/* Background video */}
        <video
          className="absolute inset-0 -z-30 h-full w-full object-cover opacity-70"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/assets/hero_section_video_ofside.MP4" type="video/mp4" />
        </video>
        {/* Scrims for legibility + brand tint */}
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(8,9,12,0.94)_0%,rgba(8,9,12,0.72)_45%,rgba(8,9,12,0.55)_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_top,#08090c_2%,transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_85%_10%,rgba(255,242,1,0.16)_0%,transparent_55%)]" />

        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16 sm:px-8 sm:py-20">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left: copy */}
            <div className="flex flex-col justify-center" data-reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300/50 bg-yellow-300/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-200 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-300" />
                  {EVENT.partnerRole}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                  {EVENT.city} · {EVENT.dateShort}
                </span>
              </div>

              <h1 className="mt-6 text-[clamp(2.7rem,6.5vw+0.5rem,5.25rem)] font-extrabold italic leading-[0.95] tracking-[-0.02em]">
                <span className="block text-white">{EVENT.name.split(" ").slice(0, -1).join(" ")}</span>
                <span className="inline-block bg-gradient-to-br from-[#fffef0] via-[#FFE94D] to-[#e0a400] bg-clip-text pr-[0.3em] text-transparent">
                  {EVENT.name.split(" ").slice(-1)}
                </span>
              </h1>

              <p className="mt-4 text-lg font-semibold text-yellow-200 sm:text-xl">{EVENT.tagline}</p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/75">{EVENT.shortDescription}</p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#register" className="rounded-full bg-yellow-400 px-7 py-3.5 text-[15px] font-extrabold text-gray-950 shadow-[0_12px_34px_-8px_rgba(255,242,1,0.6)] transition hover:bg-yellow-300 hover:shadow-[0_16px_44px_-8px_rgba(255,242,1,0.7)]">
                  Register now · ₹{EVENT.pricePerPersonInr}
                </a>
                <a href="#lineup" className="rounded-full border border-white/30 px-7 py-3.5 text-[15px] font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/70">
                  Explore the lineup
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                {[
                  { k: "Date", v: EVENT.dateShort },
                  { k: "Time", v: EVENT.timeWindow },
                  { k: "Venue", v: EVENT.venueName },
                ].map((x) => (
                  <div key={x.k}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-300/80">{x.k}</div>
                    <div className="mt-0.5 font-semibold text-white/90">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: registration form */}
            <div id="register" className="scroll-mt-24" data-reveal>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <section className="overflow-hidden border-y border-gray-950/10 bg-yellow-400 py-3 text-gray-950">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 text-sm font-extrabold uppercase tracking-[0.15em]">
              {item}
              <span className="text-gray-950/40">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ===================== LINEUP (visual) ===================== */}
      <section id="lineup" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end" data-reveal>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">The lineup</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-[2rem] sm:leading-[1.15]">
              Five sports. Pick your battle.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-gray-600">
            Every court and pitch scored live by Ofside — jump into one or go all-in across the board.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" data-reveal>
          {SPORTS.map((s, i) => (
            <div
              key={s.name}
              className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <Image
                src={s.img}
                alt={s.name}
                fill
                sizes="(max-width:640px) 50vw, 20vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-yellow-300">0{i + 1}</span>
                <p className="text-base font-bold text-white">{s.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== ABOUT + STATS (light) ===================== */}
      <section id="about" className="scroll-mt-20 border-t border-gray-950/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20" data-reveal>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">About the event</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-[2rem] sm:leading-[1.15]">
                One arena. A whole community showing up to play.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600 sm:text-base">
                {EVENT.name} brings players of every level together for a full day of competition — casual squads and
                serious contenders alike. As {EVENT.partnerRole.toLowerCase()}, Ofside runs live scoring across every
                court and pitch, so every point counts toward the leaderboard and lives on your player profile.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 self-center">
              {[
                { n: "5", l: "Sports" },
                { n: "12h", l: "Non-stop play" },
                { n: "₹1L", l: "In prizes" },
                { n: "Live", l: "Scoring" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-gray-200 bg-[#f6f4ec] p-5 text-center">
                  <div className="text-3xl font-extrabold text-gray-950">{s.n}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EVENT.highlights.map((h, i) => (
              <div
                key={h.title}
                className="group rounded-2xl border border-gray-200 bg-[#f6f4ec] p-5 transition hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-lg"
                data-reveal
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-yellow-400 ring-1 ring-inset ring-white/10 transition group-hover:bg-yellow-400 group-hover:text-gray-950">
                  {highlightIcons[i % highlightIcons.length]}
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-950">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SCHEDULE (dark) ===================== */}
      <section className="relative overflow-hidden bg-[#08090c] text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_60%_at_100%_0%,rgba(255,242,1,0.12)_0%,transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div data-reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-300">Match day</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-[2rem] sm:leading-[1.15]">How the day unfolds</h2>
              <p className="mt-4 max-w-sm text-sm text-white/60">
                Doors at 8, finals under the lights. Here&apos;s the run of play for {EVENT.dateShort}.
              </p>
            </div>
            <div className="space-y-0" data-reveal>
              {EVENT.schedule.map((s, i) => (
                <div key={s.time} className="flex items-baseline gap-5 border-b border-white/10 py-4 last:border-0">
                  <span className="text-sm font-bold tabular-nums text-white/40">0{i + 1}</span>
                  <span className="min-w-[92px] shrink-0 text-sm font-bold text-yellow-200">{s.time}</span>
                  <span className="text-[15px] text-white/85">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING (yellow) ===================== */}
      <section className="bg-[#f6f4ec]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8" data-reveal>
          <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#FFF201_0%,#FFD400_55%,#FFB800_100%)] p-8 text-gray-950 shadow-[0_30px_70px_-25px_rgba(255,190,0,0.7)] sm:p-12">
            <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900/70">Entry fee</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-6xl font-extrabold tracking-tight sm:text-7xl">₹{EVENT.pricePerPersonInr}</span>
                  <span className="pb-2 font-semibold text-gray-900/70">/ person</span>
                </div>
                <p className="mt-3 max-w-md text-sm font-medium text-gray-900/80">
                  Register solo or bring your crew — up to {EVENT.maxGroupSize} people in one entry. Includes arena
                  access, all match entries, event kit &amp; refreshments.
                </p>
              </div>
              <a href="#register" className="shrink-0 rounded-full bg-gray-950 px-8 py-4 text-[15px] font-extrabold text-white transition hover:bg-gray-800">
                Grab your spot →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ (light) ===================== */}
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-8" data-reveal>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Good to know</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">Questions, answered</h2>
        <div className="mt-8 space-y-3">
          {EVENT.faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white p-5 transition open:border-amber-300 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-gray-900">
                {f.q}
                <span className="ml-4 text-xl leading-none text-amber-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===================== LOCATION + FINAL CTA ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2" data-reveal>
          <div className="rounded-3xl border border-gray-200 bg-white p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Venue</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-950">{EVENT.venueName}</h3>
            <p className="mt-2 text-sm text-gray-600">{EVENT.venueAddress}</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:border-gray-900">
              Open in Maps →
            </a>
          </div>
          <div className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-[#08090c] p-8 text-white">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_90%_at_100%_0%,rgba(255,242,1,0.22)_0%,transparent_60%)]" />
            <h3 className="text-3xl font-extrabold italic">Ready to play?</h3>
            <p className="mt-2 max-w-sm text-sm text-white/70">
              Spots are limited and go fast. Lock in your entry for {EVENT.dateShort} now.
            </p>
            <a href="#register" className="mt-6 w-fit rounded-full bg-yellow-400 px-7 py-3.5 text-[15px] font-extrabold text-gray-950 transition hover:bg-yellow-300">
              Register now
            </a>
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
