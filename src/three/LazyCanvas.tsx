"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyCanvasProps = {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  /** How far outside the viewport to mount/unmount — gives WebGL init a head start and avoids pop-in. */
  rootMargin?: string;
};

/**
 * Mounts `children` (a Canvas/Scene) only while its container is near the viewport, and
 * unmounts it otherwise — stopping that scene's render loop and GPU work entirely rather
 * than leaving every Canvas on the page rendering simultaneously regardless of scroll position.
 */
export function LazyCanvas({ children, fallback = null, className, rootMargin = "300px 0px" }: LazyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div className={className} ref={containerRef}>{active ? children : fallback}</div>;
}
