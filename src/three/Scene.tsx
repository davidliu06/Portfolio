"use client";

import { ReactNode, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useDeviceTier } from "./hooks/useDeviceTier";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { CursorLight } from "./components/CursorLight";

type SceneProps = {
  children: ReactNode;
  fallback?: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
};

/**
 * Shared Canvas root: lighting, device-tier-aware postprocessing/DPR, and the
 * prefers-reduced-motion guardrail. A reduced-motion visitor never mounts
 * WebGL at all — they get `fallback` instead. Mouse force tracking lives in a
 * single app-level MouseForceProvider, not here — Scene can mount several
 * times at once near LazyCanvas boundaries, and each instance calling
 * useMouseForce used to mean that many redundant window listeners.
 */
export function Scene({ children, fallback = null, cameraPosition = [0, 0, 8], fov = 45 }: SceneProps) {
  const reducedMotion = usePrefersReducedMotion();
  const tier = useDeviceTier();

  if (reducedMotion) return <>{fallback}</>;

  const dpr: [number, number] = tier === "low" ? [1, 1] : tier === "medium" ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: cameraPosition, fov }}
      gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.95} color="#f5f7ff" />
        <hemisphereLight args={["#ffffff", "#dbe4ff", 0.6]} />
        <pointLight position={[6, 5, 6]} intensity={0.9} color="#8B5CF6" />
        <pointLight position={[-6, -3, -4]} intensity={0.7} color="#FF5D3A" />
        <CursorLight />
        {children}
        {tier !== "low" && (
          <EffectComposer multisampling={tier === "high" ? 4 : 0}>
            <Bloom intensity={0.42} luminanceThreshold={0.55} luminanceSmoothing={0.85} mipmapBlur />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
