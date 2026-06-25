"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";

type CountUpStatProps = {
  value: number;
  suffix?: string;
  label: string;
  color?: string;
};

/** Tweens 0 -> value with GSAP the first time the stat scrolls into view — a deliberate "moment," not a counter that re-fires on every scroll. */
export function CountUpStat({ value, suffix = "", label, color }: CountUpStatProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || !numberRef.current) return;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        if (numberRef.current) numberRef.current.textContent = Math.round(counter.value).toString();
      }
    });
    return () => {
      tween.kill();
    };
  }, [isInView, value]);

  return (
    <div className="text-center" ref={containerRef}>
      <p className="font-display text-6xl font-black sm:text-7xl" style={{ color }}>
        <span ref={numberRef}>0</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
