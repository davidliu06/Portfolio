"use client";

import { useEffect, useRef } from "react";

/**
 * Engineering precision targeting reticle cursor.
 * - Center dot: exact pointer position, glows primary blue.
 * - Outer reticle: follows with lerp lag, slowly rotates (~4 rpm),
 *   four cardinal tick marks + four diagonal accent dots.
 * - On interactive elements: reticle expands + dot dims.
 * Touch/coarse-pointer devices: no-op.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.setAttribute("data-cursor", "custom");

    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let rScale = 1, targetScale = 1;
    let deg = 0;
    let lastTime = 0;
    let frameId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement).closest(
        "a, button, [role='button'], input, textarea, select, label"
      );
      targetScale = hit ? 1.55 : 1;
    };

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const dot = dotRef.current;
      const reticle = reticleRef.current;
      if (dot && reticle) {
        // Dot tracks exactly
        dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
        // Reticle lags, rotates, scales
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        rScale += (targetScale - rScale) * 0.09;
        deg = (deg + 22 * dt) % 360; // ~3.7 rpm
        reticle.style.transform =
          `translate(${rx - 22}px, ${ry - 22}px) rotate(${deg}deg) scale(${rScale})`;
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

  // Primary color: hsl(226 95% 67%) = #5B7FFF
  const PRIMARY = "hsl(226 95% 67%)";

  return (
    <>
      {/* Exact-position glowing center dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[6px] w-[6px] rounded-full will-change-transform"
        style={{
          background: PRIMARY,
          boxShadow: `0 0 8px 2px ${PRIMARY}`,
        }}
      />

      {/* Lagging rotating reticle */}
      <div
        ref={reticleRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] will-change-transform"
      >
        <svg
          viewBox="-22 -22 44 44"
          width="44"
          height="44"
          style={{ overflow: "visible" }}
        >
          {/* Outer ring */}
          <circle
            cx="0" cy="0" r="17"
            fill="none"
            stroke={PRIMARY}
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />

          {/* Cardinal tick marks (gap from r=10 to r=17) */}
          <line x1="0"  y1="-17" x2="0"  y2="-10" stroke={PRIMARY} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="0"  y1="10"  x2="0"  y2="17"  stroke={PRIMARY} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="-17" y1="0"  x2="-10" y2="0"  stroke={PRIMARY} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="10"  y1="0"  x2="17"  y2="0"  stroke={PRIMARY} strokeWidth="1.6" strokeLinecap="round" />

          {/* Diagonal accent dots at 45° */}
          <circle cx="12"  cy="-12" r="1.3" fill={PRIMARY} fillOpacity="0.4" />
          <circle cx="12"  cy="12"  r="1.3" fill={PRIMARY} fillOpacity="0.4" />
          <circle cx="-12" cy="-12" r="1.3" fill={PRIMARY} fillOpacity="0.4" />
          <circle cx="-12" cy="12"  r="1.3" fill={PRIMARY} fillOpacity="0.4" />

          {/* Inner ring — tighter gap circle for depth */}
          <circle
            cx="0" cy="0" r="6"
            fill="none"
            stroke={PRIMARY}
            strokeWidth="0.5"
            strokeOpacity="0.25"
          />
        </svg>
      </div>
    </>
  );
}
