"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const GlobalCanvas = dynamic(() => import("@/three/GlobalCanvas"), { ssr: false });
const PortfolioScene = dynamic(() => import("@/three/scenes/PortfolioScene"), { ssr: false });

/** Mounts the single persistent WebGL canvas behind the entire page. Lazy-loaded, client-only. */
export function GlobalCanvasProvider() {
  const pathname = usePathname();
  if (pathname === "/electrical") return null;
  return (
    <GlobalCanvas>
      <PortfolioScene />
    </GlobalCanvas>
  );
}
