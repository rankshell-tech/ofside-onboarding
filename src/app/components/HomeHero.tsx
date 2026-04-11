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
        <p className="mt-0.5 line-clamp-2 min-h-[1.85rem] max-w-[5.5rem] text-center text-[8px] font-medium leading-tight text-gray-800 sm:mt-1 sm:min-h-[1.95rem] sm:max-w-[6rem] sm:text-[9px]">
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
      <div className="mb-3 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-yellow-200/90 sm:text-[11px]">
          Sports we cover
        </p>
        <p className="mt-0.5 text-xs text-white/55 sm:text-sm">Swipe or use arrows to explore</p>
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
    <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-gray-950">
      <div className="absolute inset-0 z-0 min-h-full">
        <video
          className="h-full min-h-full w-full scale-105 object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/assets/hero_section_video_ofside.MP4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/48 via-black/38 to-black/72" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_88%_68%_at_50%_32%,transparent_0%,rgba(0,0,0,0.48)_100%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:max-w-4xl sm:gap-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:max-w-6xl">
        <div className="flex w-full flex-col items-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.38em] text-yellow-200/85 sm:text-xs sm:tracking-[0.42em]">
            Book · Play · Score
          </p>
          <h1 className="text-balance text-3xl font-bold italic leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_36px_rgba(0,0,0,0.55)] sm:text-4xl md:text-[2.65rem] lg:text-5xl">
            <span className="block">India&apos;s Ultimate</span>
            <span className="mt-1.5 block bg-gradient-to-b from-[#fffef8] via-[#FFE94D] to-[#ca8a04] bg-clip-text text-transparent">
              Sports Ecosystem
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm font-medium leading-relaxed text-white/88 sm:mt-4 sm:text-base">
            Connecting players with sports spaces and helping venues grow digitally.
          </p>

          <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-stretch justify-center gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <a
              href={APP_LINKS.appStore}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/35 bg-white px-3 py-2.5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-yellow-300 hover:bg-yellow-50/95"
            >
              <div className="shrink-0 rounded-lg bg-white">
                <Image
                  src="/assets/appstore.webp"
                  alt="App Store badge"
                  width={180}
                  height={180}
                  className="h-11 w-auto rounded-lg sm:h-12"
                />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">Download On</p>
                <p className="text-sm font-semibold text-gray-950">App Store</p>
              </div>
            </a>
            <a
              href={APP_LINKS.playStore}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/35 bg-white px-3 py-2.5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-yellow-300 hover:bg-yellow-50/95"
            >
              <div className="shrink-0 rounded-lg bg-white">
                <Image
                  src="/assets/playstore.webp"
                  alt="Google Play badge"
                  width={180}
                  height={180}
                  className="h-11 w-auto rounded-lg sm:h-12"
                />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">Download On</p>
                <p className="text-sm font-semibold text-gray-950">Google Play</p>
              </div>
            </a>
            <Link
              href="/onboarding"
              className="inline-flex w-full items-center gap-2.5 rounded-2xl border border-yellow-200/80 bg-yellow-300 px-3 py-2.5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-yellow-300 hover:bg-yellow-200 sm:w-auto sm:min-w-[200px]"
            >
              <div
                className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white via-amber-50/90 to-amber-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(180,83,9,0.12)] ring-1 ring-amber-900/10 sm:h-12 sm:w-12"
                aria-hidden
              >
                <Building2
                  className="h-[1.65rem] w-[1.65rem] text-amber-900/90 sm:h-7 sm:w-7"
                  strokeWidth={1.85}
                />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-950/65">Be a Partner</p>
                <p className="text-sm font-semibold text-gray-950">List Your Venue</p>
              </div>
            </Link>
          </div>
        </div>

        <SportsWeCover />
      </div>
    </section>
  );
}
