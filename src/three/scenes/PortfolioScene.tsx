"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SpaceCluster } from "@/three/clusters/SpaceCluster";
import { ScrollCamera } from "@/three/components/ScrollCamera";
import { useDeviceTier } from "@/three/hooks/useDeviceTier";

function SceneEffects() {
  const tier = useDeviceTier();
  // Bloom is expensive (multi-pass render). Only run on high-tier devices.
  if (tier !== "high") return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.75}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
    </EffectComposer>
  );
}

/**
 * Single persistent 3D world — one render loop, one Bloom pass.
 * Each cluster manages its own group.visible based on activeChapter,
 * so the GPU only draws what's on screen.
 */
export default function PortfolioScene() {
  return (
    <>
      <ScrollCamera />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#2F5DFF" />
      <pointLight position={[-5, -3, 3]} intensity={0.25} color="#8B5CF6" />
      <Suspense fallback={null}>
        <SpaceCluster />
      </Suspense>
      <SceneEffects />
    </>
  );
}
