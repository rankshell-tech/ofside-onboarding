"use client";

import { useEffect, useRef } from "react";

export type Reel = { src: string; caption: string; fallback: string };

/**
 * Horizontal reels row. Videos use preload="none" and only download + play once their card
 * scrolls near the viewport (IntersectionObserver), pausing when off-screen. This keeps the
 * (heavy) clips off the initial page load so the hero paints fast.
 */
export default function ReelsWall({ reels }: { reels: Reel[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video[data-reel]"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // First time visible → attach real sources and start loading.
            if (!video.dataset.loaded) {
              video.dataset.loaded = "1";
              video.querySelectorAll<HTMLSourceElement>("source[data-src]").forEach((s) => {
                if (!s.src) s.src = s.dataset.src ?? "";
              });
              video.load();
            }
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: "250px", threshold: 0.2 },
    );

    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="mt-8 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
    >
      <div className="mx-auto flex w-max snap-x snap-mandatory gap-4">
        {reels.map((r, i) => (
          <div
            key={i}
            className="group relative aspect-[9/16] w-[220px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1.5 hover:ring-yellow-400/50 sm:w-[240px]"
          >
            <video
              data-reel
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loop
              muted
              playsInline
              preload="none"
              aria-hidden
            >
              <source data-src={r.src} type="video/mp4" />
              <source data-src={r.fallback} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/25" />
            <span className="absolute left-3 top-3 rounded-md bg-black/40 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
              Ofside
            </span>
            <p className="absolute inset-x-3 bottom-3 text-[15px] font-black leading-tight text-white drop-shadow">
              {r.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
