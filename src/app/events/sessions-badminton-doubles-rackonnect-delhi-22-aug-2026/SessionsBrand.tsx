"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/eventConfig";

const LOGO_HEIGHT = 40;
const MIN_TAG_PX = 9;
const MAX_TAG_PX = 15;

export default function SessionsBrand() {
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const [tagSize, setTagSize] = useState(11);

  useLayoutEffect(() => {
    const logoEl = logoWrapRef.current;
    const tagEl = tagRef.current;
    if (!logoEl || !tagEl) return;

    const fit = () => {
      const target = logoEl.getBoundingClientRect().width;
      if (target < 8) return;

      // Cap tagline size more tightly on narrow (mobile) widths.
      const maxForWidth = target < 160 ? 11.5 : MAX_TAG_PX;
      let lo = MIN_TAG_PX;
      let hi = Math.min(MAX_TAG_PX, maxForWidth);
      let best = MIN_TAG_PX;

      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        tagEl.style.fontSize = `${mid}px`;
        const w = tagEl.getBoundingClientRect().width;
        if (w <= target) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }

      setTagSize(Math.round(best * 10) / 10);
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(logoEl);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-start gap-1 sm:gap-2">
      <div ref={logoWrapRef} className="leading-none">
        <Image
          src={EVENT.logoSrc}
          alt={EVENT.seriesName}
          width={240}
          height={LOGO_HEIGHT}
          priority
          className="block h-5 w-auto object-contain object-left sm:h-10"
        />
      </div>
      <p
        ref={tagRef}
        className="whitespace-nowrap font-medium leading-none text-white/65 sm:text-white/70"
        style={{ fontSize: tagSize }}
      >
        {EVENT.tagline}
      </p>
    </div>
  );
}
