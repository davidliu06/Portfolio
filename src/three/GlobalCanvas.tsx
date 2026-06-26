"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useDeviceTier } from "@/three/hooks/useDeviceTier";

interface GlobalCanvasProps {
  children?: ReactNode;
}

/**
 * Single persistent WebGL canvas fixed behind the entire page.
 * Replaces the three separate per-section LazyCanvas+Scene stacks (Hero, AI, Resume)
 * that previously created up to three simultaneous WebGL contexts and Bloom passes.
 * pointer-events-none so it never captures clicks meant for page content.
 */
export function GlobalCanvas({ children }: GlobalCanvasProps) {
  const tier = useDeviceTier();
  // Cap at 1.2 — Bloom at 2× DPR processes 4× the pixels. Not worth it.
  const dpr: [number, number] = tier === "low" ? [1, 1] : [1, 1.2];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 100, position: [0, 0, 9] }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}

export default GlobalCanvas;
