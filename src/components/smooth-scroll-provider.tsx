"use client";

import { useEffect } from "react";
import { initSmoothScroll } from "@/lib/scroll";

export function SmoothScrollProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return initSmoothScroll();
  }, []);

  return null;
}
