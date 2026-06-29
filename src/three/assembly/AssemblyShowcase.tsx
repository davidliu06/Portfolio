"use client";

import { Suspense, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, RotateCcw } from "lucide-react";
import { useDeviceTier } from "@/three/hooks/useDeviceTier";
import { usePrefersReducedMotion } from "@/three/hooks/usePrefersReducedMotion";
import { LazyCanvas } from "@/three/LazyCanvas";
import { AssemblyScene } from "./AssemblyScene";
import { ModelErrorBoundary } from "./ModelErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

const DRAG_ROTATE_SENSITIVITY = 0.006;

type AssemblyShowcaseProps = {
  url: string;
  namePrefix?: string;
  accentColor?: string;
  title: string;
  caption: string;
  /** A short looping exploded-view clip (rendered offline via the project's Remotion sub-project) shown in place of the real model until it's loaded — gives mobile/slow-network visitors something compelling without waiting on WebGL. */
  posterClip?: string;
};

const BLUEPRINT_GRID_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "28px 28px"
};

function CornerTick({ className }: { className: string }) {
  return <div aria-hidden className={`pointer-events-none absolute h-4 w-4 border-white/25 ${className}`} />;
}

/**
 * The interactive CAD-assembly viewer: original GLB rendered with real PBR
 * materials, hover-highlight / click-to-isolate / exploded-view driven by the
 * model's real SolidWorks hierarchy, and drag-to-look-around orbiting (the
 * model itself turns, fully and without limit, on top of a gentle idle
 * auto-rotate and pointer-tilt that pause while exploded or isolated so the
 * layout can actually be studied). The scroll-tied camera dolly is scoped to
 * this embed's own container — never the page scroll. The Canvas mounts only
 * while the container is actually intersecting the viewport (no preload
 * margin), so the GLB never fetches until it's genuinely in view.
 */
export function AssemblyShowcase({ url, namePrefix, accentColor = "#2F5DFF", title, caption, posterClip }: AssemblyShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const tier = useDeviceTier();
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [isolatedName, setIsolatedName] = useState<string | null>(null);
  const [isolatedLabel, setIsolatedLabel] = useState<string | null>(null);
  const [partCount, setPartCount] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const dragRotationRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });

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

  function handleDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragDistanceRef.current = 0;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const dx = event.clientX - lastPointerRef.current.x;
    const dy = event.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    dragRotationRef.current = {
      x: dragRotationRef.current.x + dy * DRAG_ROTATE_SENSITIVITY,
      y: dragRotationRef.current.y + dx * DRAG_ROTATE_SENSITIVITY
    };
    dragDistanceRef.current += Math.hypot(dx, dy);
  }

  function handleDragEnd(event: ReactPointerEvent<HTMLDivElement>) {
    isDraggingRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
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

  const dpr: [number, number] = tier === "low" ? [1, 1] : tier === "medium" ? [1, 1.5] : [1, 1.5];

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#0B1120] to-[#060912] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55)]"
      ref={containerRef}
    >
      <div className="relative h-[360px] w-full sm:h-[440px] lg:h-[520px]">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={BLUEPRINT_GRID_STYLE} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 45%, ${accentColor}26, transparent 65%)` }}
        />
        <CornerTick className="left-4 top-4 border-l-2 border-t-2" />
        <CornerTick className="right-4 top-4 border-r-2 border-t-2" />
        <CornerTick className="bottom-4 left-4 border-b-2 border-l-2" />
        <CornerTick className="bottom-4 right-4 border-b-2 border-r-2" />

        <div
          className="absolute inset-0"
          onPointerCancel={handleDragEnd}
          onPointerDown={handleDragStart}
          onPointerLeave={handleDragEnd}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <ModelErrorBoundary
            fallback={
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-8 text-center">
                <p className="text-sm font-semibold text-white">Couldn&apos;t load this model</p>
                <p className="text-xs text-slate-400">Try refreshing the page.</p>
              </div>
            }
          >
            {/* No rootMargin — the GLB and its textures never fetch until this
                container is genuinely intersecting the viewport, not a moment before. */}
            <LazyCanvas className="absolute inset-0" rootMargin="0px">
              <Canvas
                camera={{ position: [0, 0.6, 4.2], fov: 42 }}
                dpr={dpr}
                gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
              >
                <Suspense fallback={null}>
                  <AssemblyScene
                    accentColor={accentColor}
                    dragDistanceRef={dragDistanceRef}
                    dragRotationRef={dragRotationRef}
                    exploded={false}
                    isDraggingRef={isDraggingRef}
                    isolatedName={isolatedName}
                    namePrefix={namePrefix}
                    onHoverChange={setHoveredLabel}
                    onModelLoaded={setPartCount}
                    onPartClick={handlePartClick}
                    scrollProgressRef={scrollProgressRef}
                    url={url}
                  />
                  {tier !== "low" && (
                    <EffectComposer multisampling={tier === "high" ? 4 : 0}>
                      <Bloom intensity={0.4} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
                    </EffectComposer>
                  )}
                </Suspense>
              </Canvas>
            </LazyCanvas>
          </ModelErrorBoundary>
        </div>

        <AnimatePresence>
          {partCount === null && (
            <motion.div
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3"
              exit={{ opacity: 0 }}
              initial={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {posterClip && (
                <video autoPlay className="absolute inset-0 h-full w-full object-cover opacity-70" loop muted playsInline src={posterClip} />
              )}
              <div className="relative flex flex-col items-center gap-3 rounded-2xl bg-[#060912]/88 px-6 py-4">
                <div
                  className="h-7 w-7 animate-spin rounded-full border-2 border-white/15"
                  style={{ borderTopColor: accentColor }}
                />
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Loading interactive model…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="rounded-full border border-white/15 bg-[#060c1a]/85 px-3 py-1.5 text-xs font-semibold text-white">
            {title}
          </div>
          {(hoveredLabel || isolatedLabel) && (
            <div
              className="rounded-full border border-white/15 bg-[#060c1a]/85 px-3 py-1.5 text-xs font-semibold"
              style={{ color: accentColor }}
            >
              {isolatedLabel ?? hoveredLabel}
            </div>
          )}
        </div>

        {partCount !== null && (
          <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-widest text-slate-400">
            PARTS&nbsp;
            <span className="text-white">{partCount}</span>
          </div>
        )}

        <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-2 px-4">
          {isolatedName && (
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#060c1a]/85 px-3 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1628]/90"
              onClick={() => {
                setIsolatedName(null);
                setIsolatedLabel(null);
              }}
            >
              <RotateCcw size={14} />
              Show all
            </button>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#060c1a]/75 px-3 py-1.5 text-xs text-slate-300">
            <Layers size={14} />
            Drag to rotate · Hover a part · Click to isolate
          </span>
        </div>
      </div>
      <p className="border-t border-white/10 p-4 text-sm text-slate-300">{caption}</p>
    </div>
  );
}
