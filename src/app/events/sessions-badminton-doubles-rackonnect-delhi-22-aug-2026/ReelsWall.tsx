export type Reel = { src: string; caption: string; fallback: string };

/**
 * Horizontal reels row. Native muted autoplay — reliable across browsers and embedding
 * contexts (it does not depend on viewport size, scroll events, or IntersectionObserver,
 * all of which behave inconsistently in some webviews). preload="metadata" keeps the initial
 * fetch light; browsers pull the rest as playback needs it.
 */
export default function ReelsWall({ reels }: { reels: Reel[] }) {
  return (
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
