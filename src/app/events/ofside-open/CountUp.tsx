"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates the numeric part of a stat value when it scrolls into view.
 * Handles plain numbers ("5"), suffixed ("12h"), and prefixed ("₹1L").
 * Non-numeric values ("Live") render as-is. Respects reduced-motion.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!match) {
      setDisplay(value);
      return;
    }
    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(`${prefix}${target}${suffix}`);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const run = () => {
      const duration = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setDisplay(`${prefix}${Math.round(eased * target)}${suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, match]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
