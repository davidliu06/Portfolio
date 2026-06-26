"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { EngineeringCluster } from "@/three/clusters/EngineeringCluster";
import { ScrollCamera } from "@/three/components/ScrollCamera";
import { useDeviceTier } from "@/three/hooks/useDeviceTier";

function SceneEffects() {
  const tier = useDeviceTier();
  if (tier === "low") return null;
  return (
    <EffectComposer>
      <Bloom
        intensity={0.65}
        luminanceThreshold={0.38}
        luminanceSmoothing={0.9}
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
        <EngineeringCluster />
      </Suspense>
      <SceneEffects />
    </>
  );
}
