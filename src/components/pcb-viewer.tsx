"use client";

import dynamic from "next/dynamic";

const BoardCanvas = dynamic(() => import("@/three/pcb/BoardCanvas"), { ssr: false });

export function PcbViewer(props: { model: string; image: string; name: string }) {
  return <BoardCanvas {...props} />;
}
