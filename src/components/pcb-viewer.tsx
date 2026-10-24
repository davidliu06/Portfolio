"use client";

import dynamic from "next/dynamic";

const BoardCanvas = dynamic(() => import("@/three/pcb/BoardCanvas"), { ssr: false });

export function PcbViewer(props: { model: string; image: string; name: string; large?: boolean }) {
  return <div className="min-h-[320px] sm:min-h-[380px]"><BoardCanvas {...props} /></div>;
}
