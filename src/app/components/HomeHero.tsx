"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";

const APP_LINKS = {
  playStore: "mailto:play@ofside.in?subject=Share%20Ofside%20Play%20Store%20link",
  appStore: "mailto:play@ofside.in?subject=Share%20Ofside%20App%20Store%20link",
} as const;

/**
 * Mirrors `allSports` where `showOnHomepage: true` in ofside-app-frontend/types/index.ts
 */
/** How many sport cards each arrow click scrolls (12 sports → 4 arrow steps end-to-end). */
const SPORTS_SCROLL_STEP = 3;

const HOMEPAGE_SPORTS: {
  id: string;
  label: string;
  image: string;
  /** Top accent strip only — avoids noisy full borders */
  accent: string;
}[] = [
  { id: "badminton", label: "Badminton", image: "/assets/sports/badminton.webp", accent: "bg-amber-500" },
  { id: "pickleball", label: "Pickleball", image: "/assets/sports/pickleball.webp", accent: "bg-lime-500" },
  { id: "tennis", label: "Tennis", image: "/assets/sports/tennis.webp", accent: "bg-yellow-400" },
  { id: "futsal", label: "Futsal / Turf Football", image: "/assets/sports/futsal.webp", accent: "bg-emerald-500" },
  { id: "box_cricket", label: "Box Cricket", image: "/assets/sports/box_cricket.webp", accent: "bg-sky-500" },
  { id: "cricket_nets", label: "Cricket Nets", image: "/assets/sports/cricket_nets.webp", accent: "bg-blue-600" },
  { id: "padel_ball", label: "Padel Ball", image: "/assets/sports/padel_ball.webp", accent: "bg-violet-500" },
  { id: "cricket", label: "Cricket", image: "/assets/sports/cricket.webp", accent: "bg-indigo-500" },
  { id: "table_tennis", label: "Table Tennis", image: "/assets/sports/table_tennis.webp", accent: "bg-rose-500" },
  { id: "football", label: "Football", image: "/assets/sports/football.webp", accent: "bg-teal-500" },
  { id: "basketball", label: "Basketball", image: "/assets/sports/basketball.webp", accent: "bg-orange-500" },
  { id: "swimming", label: "Swimming", image: "/assets/sports/swimming.webp", accent: "bg-cyan-500" },
];

function SportTile({
  label,
  image,
  accent,
}: {
  label: string;
  image: string;
  accent: string;
}) {
  return (
    <div className="group flex h-full min-h-[118px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_4px_18px_rgba(0,0,0,0.09)] ring-1 ring-black/[0.06] transition hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)] sm:min-h-[128px] sm:rounded-xl">
      <div className={`h-0.5 w-full shrink-0 ${accent}`} aria-hidden />
      <div className="flex flex-1 flex-col items-center px-1 py-1 sm:px-1.5 sm:py-1.5">
        <div className="relative h-16 w-16 shrink-0 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100/90 p-1 ring-1 ring-black/[0.04] sm:h-[4.75rem] sm:w-[4.75rem] sm:rounded-xl sm:p-1.5">
          <Image
            src={image}
            alt={label}
            fill
            sizes="(max-width: 640px) 64px, 80px"
            className="object-contain"
          />
        </div>
        <p className="mt-0.5 line-clamp-2 min-h-[2rem] max-w-[6rem] text-center text-[10px] font-medium leading-snug text-gray-800 sm:mt-1 sm:min-h-[1.95rem] sm:max-w-[6rem] sm:text-[9px] sm:leading-tight">
          {label}
        </p>
      </div>
    </div>
  );
}

function SportsWeCover() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const settleUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  /** While arrows run smooth scroll, pin segment UI so it does not flicker through intermediate cards. */
  const [lockedSegment, setLockedSegment] = useState<number | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement | undefined;
    if (!card) return;
    const scroll =
      card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2;
    el.scrollTo({ left: Math.max(0, scroll), behavior: "smooth" });
  }, []);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const nSports = HOMEPAGE_SPORTS.length;
    const cur = activeRef.current;
    const next = Math.min(
      nSports - 1,
      Math.max(0, cur + dir * SPORTS_SCROLL_STEP),
    );
    setLockedSegment(Math.floor(next / SPORTS_SCROLL_STEP));
    scrollToIndex(next);
  }, [scrollToIndex]);

  const updateScrollMetrics = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i] as HTMLElement;
      const cMid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(mid - cMid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    activeRef.current = best;
    setActive(best);
  }, []);

  const clearLockedSegment = useCallback(() => {
    setLockedSegment(null);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const scheduleUnlockAfterSettle = () => {
      if (settleUnlockTimerRef.current) {
        clearTimeout(settleUnlockTimerRef.current);
      }
      settleUnlockTimerRef.current = setTimeout(() => {
        settleUnlockTimerRef.current = null;
        clearLockedSegment();
      }, 140);
    };

    const onScroll = () => {
      updateScrollMetrics();
      scheduleUnlockAfterSettle();
    };

    const onScrollEnd = () => {
      if (settleUnlockTimerRef.current) {
        clearTimeout(settleUnlockTimerRef.current);
        settleUnlockTimerRef.current = null;
      }
      updateScrollMetrics();
      clearLockedSegment();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", onScrollEnd);
    updateScrollMetrics();
    const ro = new ResizeObserver(() => updateScrollMetrics());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", onScrollEnd);
      ro.disconnect();
      if (settleUnlockTimerRef.current) {
        clearTimeout(settleUnlockTimerRef.current);
      }
    };
  }, [updateScrollMetrics, clearLockedSegment]);

  const n = HOMEPAGE_SPORTS.length;
  /** Discrete “pages” aligned with arrow steps (3 cards each), not raw scroll pixels — avoids wrong %. */
  const pageCount = Math.max(1, Math.ceil(n / SPORTS_SCROLL_STEP));
  const currentPage = Math.min(
    pageCount - 1,
    lockedSegment ?? Math.floor(active / SPORTS_SCROLL_STEP),
  );

  return (
    <div className="mx-auto w-full max-w-md shrink-0 sm:max-w-lg md:max-w-xl">
      <div className="mb-1.5 text-center sm:mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-200/90 sm:text-[11px] sm:tracking-[0.35em]">
          Sports we cover
        </p>
        <p className="mt-0 text-[13px] leading-snug text-white/60 sm:mt-0.5 sm:text-sm sm:leading-normal">
          Swipe or use arrows to explore
        </p>
      </div>

      <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:rounded-[1.35rem] sm:p-2.5">
        <div
          ref={scrollerRef}
          className="relative flex snap-x snap-mandatory gap-1.5 overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
        >
          {HOMEPAGE_SPORTS.map((sport) => (
            <div
              key={sport.id}
              className="w-[min(62vw,128px)] min-w-[min(62vw,128px)] shrink-0 snap-center sm:w-[124px] sm:min-w-[124px]"
            >
              <SportTile label={sport.label} image={sport.image} accent={sport.accent} />
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex flex-col items-center gap-2 sm:mt-3 sm:gap-2.5">
          <div
            className="flex w-full max-w-[min(100%,220px)] gap-1.5"
            role="group"
            aria-label={`Sports group ${currentPage + 1} of ${pageCount}`}
          >
            {Array.from({ length: pageCount }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 min-w-0 flex-1 rounded-full transition-colors duration-300 ease-out ${
                  i === currentPage
                    ? "bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_12px_rgba(253,224,71,0.3)]"
                    : "bg-white/12"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous sports"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-yellow-300/50 hover:bg-white/15"
              onClick={() => scrollByDir(-1)}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Next sports"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-yellow-300/50 hover:bg-white/15"
              onClick={() => scrollByDir(1)}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="relative isolate -mt-[4.5rem] flex min-h-[100svh] flex-col overflow-hidden bg-gray-950 sm:mt-0 sm:min-h-[calc(100svh-4.5rem)]">
      <div className="absolute inset-0 z-0 min-h-full">
        <video
          className="h-full min-h-full w-full min-w-full scale-[1.08] object-cover sm:scale-105"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/assets/hero_section_video_ofside.MP4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/22 to-black/52" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_92%_72%_at_50%_28%,transparent_0%,rgba(0,0,0,0.28)_100%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col items-center justify-center gap-5 px-3.5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-[max(5.5rem,calc(4.5rem+env(safe-area-inset-top,0px)+0.75rem))] text-center sm:max-w-4xl sm:gap-8 sm:px-8 sm:pt-10 sm:pb-10 md:px-10 md:pt-12 md:pb-12 lg:max-w-6xl">
        <div className="flex w-full min-w-0 flex-col items-center">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.34em] text-yellow-200/90 sm:mb-2 sm:text-xs sm:tracking-[0.42em]">
            Book · Play · Score
          </p>
          <h1 className="text-balance px-1 text-[clamp(1.5rem,5.5vw+0.35rem,3rem)] font-bold italic leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.45)] sm:px-0 sm:leading-[1.08] md:text-[2.65rem] lg:text-5xl">
            <span className="block">India&apos;s Ultimate</span>
            <span className="mt-1 block bg-gradient-to-b from-[#fffef8] via-[#FFE94D] to-[#ca8a04] bg-clip-text text-transparent sm:mt-1.5">
              Sports Ecosystem
            </span>
          </h1>
          <p className="mx-auto mt-2.5 max-w-xl text-pretty px-1 text-[13px] font-medium leading-snug text-white/90 sm:mt-4 sm:px-0 sm:text-base sm:leading-relaxed">
            Connecting players with sports spaces and helping venues grow digitally.
          </p>

          <div className="mx-auto mt-5 flex w-full max-w-2xl min-w-0 flex-col items-center justify-center gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2 sm:contents">
            <a
              href={APP_LINKS.appStore}
              className="inline-flex min-w-0 flex-1 basis-0 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white px-2 py-2 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-yellow-300 hover:bg-yellow-50/95 sm:basis-auto sm:w-fit sm:flex-none sm:justify-start sm:gap-2.5 sm:rounded-2xl sm:px-3 sm:py-2.5"
            >
              <div className="shrink-0 rounded-lg bg-white">
                <Image
                  src="/assets/appstore.webp"
                  alt="App Store badge"
                  width={180}
                  height={180}
                  className="h-9 w-auto rounded-md sm:h-12 sm:rounded-lg"
                />
              </div>
              <div className="min-w-0 pr-0.5">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500 sm:text-[11px] sm:tracking-[0.18em]">
                  Download On
                </p>
                <p className="text-[13px] font-semibold leading-tight text-gray-950 sm:text-sm">App Store</p>
              </div>
            </a>
            <a
              href={APP_LINKS.playStore}
              className="inline-flex min-w-0 flex-1 basis-0 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white px-2 py-2 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-yellow-300 hover:bg-yellow-50/95 sm:basis-auto sm:w-fit sm:flex-none sm:justify-start sm:gap-2.5 sm:rounded-2xl sm:px-3 sm:py-2.5"
            >
              <div className="shrink-0 rounded-lg bg-white">
                <Image
                  src="/assets/playstore.webp"
                  alt="Google Play badge"
                  width={180}
                  height={180}
                  className="h-9 w-auto rounded-md sm:h-12 sm:rounded-lg"
                />
              </div>
              <div className="min-w-0 pr-0.5">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500 sm:text-[11px] sm:tracking-[0.18em]">
                  Download On
                </p>
                <p className="text-[13px] font-semibold leading-tight text-gray-950 sm:text-sm">Google Play</p>
              </div>
            </a>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex w-fit max-w-full shrink-0 items-center gap-2 rounded-xl border border-yellow-200/80 bg-yellow-300 px-2.5 py-2 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-yellow-300 hover:bg-yellow-200 sm:min-w-[200px] sm:gap-2.5 sm:rounded-2xl sm:px-3 sm:py-2.5"
            >
              <div
                className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-white via-amber-50/90 to-amber-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(180,83,9,0.12)] ring-1 ring-amber-900/10 sm:h-12 sm:w-12 sm:rounded-xl"
                aria-hidden
              >
                <Building2
                  className="h-6 w-6 text-amber-900/90 sm:h-7 sm:w-7"
                  strokeWidth={1.85}
                />
              </div>
              <div className="min-w-0 pr-0.5">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-amber-950/65 sm:text-[11px] sm:tracking-[0.18em]">
                  Be a Partner
                </p>
                <p className="text-[13px] font-semibold leading-tight text-gray-950 sm:text-sm">List Your Venue</p>
              </div>
            </Link>
          </div>
        </div>

        <SportsWeCover />
      </div>
    </section>
  );
}
