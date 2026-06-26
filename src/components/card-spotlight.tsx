"use client";

import { useEffect } from "react";

/**
 * Adds a subtle radial-gradient "spotlight" that follows the mouse over any
 * element that carries the `night-card` or `data-spotlight` class.
 * Works by writing `--mx` / `--my` CSS custom properties directly onto each
 * hovered card so the gradient can be expressed purely in CSS without React
 * state per card.
 */
export function CardSpotlight() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(
        ".night-card, [data-spotlight]"
      );
      if (!card) return;
      const { left, top } = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - left}px`);
      card.style.setProperty("--my", `${e.clientY - top}px`);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
