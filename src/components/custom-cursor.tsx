"use client";

import { useEffect, useRef } from "react";

/** Replaces the system cursor on pointer-primary (non-touch) devices.
 *  A small dot tracks the pointer exactly; a larger ring follows with lerp lag
 *  and scales up when hovering interactive elements. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch-primary devices — the cursor would never be visible anyway.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.setAttribute("data-cursor", "custom");

    let mx = 0, my = 0;
    let rx = 0, ry = 0, rs = 1;
    let targetScale = 1;
    let frameId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as HTMLElement).closest(
        "a, button, [role='button'], input, textarea, select, [tabindex]"
      );
      targetScale = interactive ? 1.85 : 1;
    };

    const tick = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot && ring) {
        // Dot: exactly on cursor (offset by half its size: 4px)
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
        // Ring: lerp behind cursor, lerp scale toward target
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        rs += (targetScale - rs) * 0.1;
        // Offset by half ring size: 16px
        ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px) scale(${rs})`;
      }
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(frameId);
      document.documentElement.removeAttribute("data-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-primary will-change-transform"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border border-primary/55 will-change-transform"
      />
    </>
  );
}
