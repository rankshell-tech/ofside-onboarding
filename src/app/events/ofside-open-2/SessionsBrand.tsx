"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/eventConfig";

export default function SessionsBrand() {
  const tagRef = useRef<HTMLParagraphElement>(null);
  const [logoWidth, setLogoWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = tagRef.current;
    if (!el) return;

    const sync = () => setLogoWidth(Math.ceil(el.getBoundingClientRect().width));
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Image
        src={EVENT.logoSrc}
        alt={EVENT.seriesName}
        width={180}
        height={32}
        priority
        className="block object-contain object-left"
        style={
          logoWidth
            ? { width: logoWidth, height: "auto" }
            : { height: 26, width: "auto" }
        }
      />
      <p
        ref={tagRef}
        className="whitespace-nowrap text-[11px] font-medium leading-none text-white/70 sm:text-[12px]"
      >
        {EVENT.tagline}
      </p>
    </div>
  );
}
