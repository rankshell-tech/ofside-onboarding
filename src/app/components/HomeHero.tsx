"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/mobileAppLinks";

const APP_LINKS = {
  playStore: PLAY_STORE_URL,
  appStore: APP_STORE_URL,
} as const;

/**
 * Mirrors `allSports` where `showOnHomepage: true` in ofside-app-frontend/types/index.ts
 */
/** How many sport cards each arrow click scrolls (12 sports → 4 arrow steps end-to-end). */
const SPORTS_SCROLL_STEP = 3;

const HOMEPAGE_SPORTS: { id: string; label: string; image: string }[] = [
  { id: "badminton", label: "Badminton", image: "/assets/sports/badminton.webp" },
  { id: "pickleball", label: "Pickleball", image: "/assets/sports/pickleball.webp" },
  { id: "tennis", label: "Tennis", image: "/assets/sports/tennis.webp" },
  { id: "futsal", label: "Futsal", image: "/assets/sports/futsal.webp" },
  { id: "box_cricket", label: "Box Cricket", image: "/assets/sports/box_cricket.webp" },
  { id: "cricket_nets", label: "Cricket Nets", image: "/assets/sports/cricket_nets.webp" },
  { id: "padel_ball", label: "Padel", image: "/assets/sports/padel_ball.webp" },
  { id: "cricket", label: "Cricket", image: "/assets/sports/cricket.webp" },
  { id: "table_tennis", label: "Table Tennis", image: "/assets/sports/table_tennis.webp" },
  { id: "football", label: "Football", image: "/assets/sports/football.webp" },
  { id: "basketball", label: "Basketball", image: "/assets/sports/basketball.webp" },
  { id: "swimming", label: "Swimming", image: "/assets/sports/swimming.webp" },
];

const SPORT_CARD_CLASS =
  "w-[4.75rem] shrink-0 snap-center sm:w-[5.5rem] md:w-[6rem]";

function SportTile({ label, image }: { label: string; image: string }) {
  return (
    <div className={`${SPORT_CARD_CLASS} group flex flex-col items-center gap-3`}>
      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-yellow-200/80 group-hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] sm:h-[4.25rem] sm:w-[4.25rem] sm:rounded-[1.15rem] md:h-[4.75rem] md:w-[4.75rem]">
        <Image
          src={image}
          alt={label}
          width={80}
          height={80}
          className="h-full w-full scale-[1.18] object-cover"
        />
      </div>
      <p className="line-clamp-2 w-full text-center text-[11px] font-semibold leading-tight text-gray-700 transition-colors duration-300 group-hover:text-gray-950 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

export function SportsWeCover() {
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
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < pageCount - 1;

  const navBtnClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-gray-800 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm transition duration-200 sm:h-10 sm:w-10";

  return (
    <div className="mx-auto w-full max-w-4xl shrink-0 px-1 sm:px-0">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#fffef9] via-[#fffef9]/70 to-transparent sm:w-16"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#fffef9] via-[#fffef9]/70 to-transparent sm:w-16"
          aria-hidden
        />

        <button
          type="button"
          aria-label="Previous sports"
          disabled={!canGoPrev}
          className={`absolute left-0 top-[1.5rem] z-20 -translate-x-1 sm:top-[1.65rem] md:top-[1.85rem] ${navBtnClass} ${
            canGoPrev
              ? "hover:border-yellow-300 hover:bg-yellow-50 hover:text-gray-950"
              : "cursor-not-allowed opacity-40"
          }`}
          onClick={() => canGoPrev && scrollByDir(-1)}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <button
          type="button"
          aria-label="Next sports"
          disabled={!canGoNext}
          className={`absolute right-0 top-[1.5rem] z-20 translate-x-1 sm:top-[1.65rem] md:top-[1.85rem] ${navBtnClass} ${
            canGoNext
              ? "hover:border-yellow-300 hover:bg-yellow-50 hover:text-gray-950"
              : "cursor-not-allowed opacity-40"
          }`}
          onClick={() => canGoNext && scrollByDir(1)}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-10 py-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-14 md:px-16 [&::-webkit-scrollbar]:hidden"
        >
          {HOMEPAGE_SPORTS.map((sport) => (
            <SportTile key={sport.id} label={sport.label} image={sport.image} />
          ))}
        </div>
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-2"
        role="group"
        aria-label={`Sports group ${currentPage + 1} of ${pageCount}`}
      >
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to sports group ${i + 1}`}
            aria-current={i === currentPage ? "true" : undefined}
            className={`rounded-full transition-all duration-300 ${
              i === currentPage
                ? "h-2 w-7 bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.35)]"
                : "h-2 w-2 bg-gray-300/70 hover:bg-gray-400/80"
            }`}
            onClick={() => {
              const target = Math.min(n - 1, i * SPORTS_SCROLL_STEP);
              setLockedSegment(i);
              scrollToIndex(target);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="relative isolate -mt-[4.5rem] flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-gray-950 sm:mt-0 sm:h-[calc(100dvh-4.5rem)] sm:max-h-[calc(100dvh-4.5rem)]">
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/assets/hero_section_video_ofside.MP4" type="video/mp4" />
        </video>
        {/* Single full-bleed scrim — avoids stacked overlays that read as a dark horizontal band */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.5)_38%,rgba(0,0,0,0.58)_68%,rgba(0,0,0,0.72)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_38%,rgba(255,242,1,0.14)_0%,transparent_62%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full min-w-0 max-w-3xl flex-col px-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-[max(5rem,calc(4.5rem+env(safe-area-inset-top,0px)+0.5rem))] text-center sm:max-w-4xl sm:px-8 sm:pt-8 sm:pb-6 md:px-10 lg:max-w-6xl">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-yellow-200/90 sm:mb-1.5 sm:text-xs sm:tracking-[0.42em]">
            Play · Score · Compete · Connect
          </p>
          <h1 className="text-balance px-1 text-[clamp(2.1rem,7.5vw+0.5rem,4rem)] font-bold italic leading-[1.04] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.45)] sm:px-0 sm:leading-[1.06] lg:text-[3.75rem] xl:text-[4.25rem]">
            <span className="block">Live the game</span>
            <span className="mt-0.5 block bg-gradient-to-b from-[#fffef8] via-[#FFE94D] to-[#ca8a04] bg-clip-text text-transparent sm:mt-1">
              like never before
            </span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5">
            <span className="rounded-full border border-yellow-300/40 bg-yellow-300/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-yellow-200">
              40+ Sports
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
              Live Scoring
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
              Leaderboards
            </span>
          </div>

          <div className="mx-auto mt-4 flex w-full max-w-2xl min-w-0 flex-col items-center justify-center gap-2 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-3">
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
                  className="h-9 w-auto rounded-md sm:h-11 sm:rounded-lg"
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
                  className="h-9 w-auto rounded-md sm:h-11 sm:rounded-lg"
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
          </div>
        </div>
      </div>
    </section>
  );
}
