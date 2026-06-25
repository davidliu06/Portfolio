"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Maximize2, RotateCcw } from "lucide-react";
import { useDeviceTier } from "@/three/hooks/useDeviceTier";
import { usePrefersReducedMotion } from "@/three/hooks/usePrefersReducedMotion";
import { LazyCanvas } from "@/three/LazyCanvas";
import { AssemblyScene } from "./AssemblyScene";

gsap.registerPlugin(ScrollTrigger);

type AssemblyShowcaseProps = {
  url: string;
  namePrefix?: string;
  accentColor?: string;
  title: string;
  caption: string;
};

/**
 * The interactive CAD-assembly viewer: original GLB rendered with real PBR
 * materials, a voxel "energy field" sampled from its own geometry reacting
 * to the cursor, hover-highlight / click-to-isolate / exploded-view driven
 * by the model's real SolidWorks hierarchy, and a subtle scroll-tied camera
 * orbit scoped to this embed's own container (never the page scroll).
 */
export function AssemblyShowcase({ url, namePrefix, accentColor = "#2F5DFF", title, caption }: AssemblyShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const tier = useDeviceTier();
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [exploded, setExploded] = useState(false);
  const [isolatedName, setIsolatedName] = useState<string | null>(null);
  const [isolatedLabel, setIsolatedLabel] = useState<string | null>(null);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  function handlePartClick(rawName: string) {
    if (isolatedName === rawName) {
      setIsolatedName(null);
      setIsolatedLabel(null);
    } else {
      setIsolatedName(rawName);
      setIsolatedLabel(hoveredLabel);
    }
  }

  if (reducedMotion) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#0B1120] to-[#060912] p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
          {title}
        </p>
        <p className="mt-2 text-sm text-slate-300">{caption}</p>
      </div>
    );
  }

  const dpr: [number, number] = tier === "low" ? [1, 1] : tier === "medium" ? [1, 1.5] : [1, 2];

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#0B1120] to-[#060912] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55)]"
      ref={containerRef}
    >
      <div className="relative h-[520px] w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 45%, ${accentColor}26, transparent 65%)` }}
        />
        <LazyCanvas className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0.6, 4.2], fov: 42 }}
            dpr={dpr}
            gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <AssemblyScene
                accentColor={accentColor}
                exploded={exploded}
                isolatedName={isolatedName}
                namePrefix={namePrefix}
                onHoverChange={setHoveredLabel}
                onPartClick={handlePartClick}
                scrollProgressRef={scrollProgressRef}
                url={url}
              />
              {tier !== "low" && (
                <EffectComposer multisampling={tier === "high" ? 4 : 0}>
                  <Bloom intensity={0.3} luminanceThreshold={0.7} luminanceSmoothing={0.9} mipmapBlur />
                </EffectComposer>
              )}
            </Suspense>
          </Canvas>
        </LazyCanvas>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            {title}
          </div>
          {(hoveredLabel || isolatedLabel) && (
            <div
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md"
              style={{ color: accentColor }}
            >
              {isolatedLabel ?? hoveredLabel}
            </div>
          )}
        </div>

        <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-2 px-4">
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
            onClick={() => setExploded((current) => !current)}
          >
            <Maximize2 size={14} />
            {exploded ? "Reassemble" : "Explode view"}
          </button>
          {isolatedName && (
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
              onClick={() => {
                setIsolatedName(null);
                setIsolatedLabel(null);
              }}
            >
              <RotateCcw size={14} />
              Show all
            </button>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
            <Layers size={14} />
            Click a part to isolate
          </span>
        </div>
      </div>
      <p className="border-t border-white/10 p-4 text-sm text-slate-300">{caption}</p>
    </div>
  );
}
