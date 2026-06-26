"use client";

import dynamic from "next/dynamic";

const GlobalCanvas = dynamic(() => import("@/three/GlobalCanvas"), { ssr: false });
const PortfolioScene = dynamic(() => import("@/three/scenes/PortfolioScene"), { ssr: false });

/** Mounts the single persistent WebGL canvas behind the entire page. Lazy-loaded, client-only. */
export function GlobalCanvasProvider() {
  return (
    <GlobalCanvas>
      <PortfolioScene />
    </GlobalCanvas>
  );
}
