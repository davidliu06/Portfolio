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
  const dpr: [number, number] =
    tier === "high" ? [1, 2] : tier === "medium" ? [1, 1.5] : [1, 1];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 100, position: [0, 0, 9] }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: tier !== "low",
          powerPreference: "high-performance"
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}

export default GlobalCanvas;
