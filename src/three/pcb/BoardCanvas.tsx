"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { prepareBoard } from "./prepare-board";
import { Box, FlipVertical2, RotateCcw, RotateCw, ZoomIn, ZoomOut, ImageIcon } from "lucide-react";
import { ModelErrorBoundary } from "@/three/assembly/ModelErrorBoundary";

type Props = { model: string; image: string; name: string; large?: boolean };
type View = { turn: number; flip: boolean; zoom: number };
const initialView: View = { turn: 0, flip: false, zoom: 1 };

function Board({ url, view, onReady, large }: { url: string; view: View; onReady: () => void; large: boolean }) {
  const { scene } = useGLTF(url);
  const { invalidate, viewport } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const object = useMemo(() => prepareBoard(scene, url), [scene, url]);
  useEffect(() => { onReady(); }, [onReady]);
  useEffect(() => { controls.current?.reset(); invalidate(); }, [view, invalidate]);
  return <>
    <ambientLight intensity={2} />
    <directionalLight position={[3, 4, 5]} intensity={3} />
    <directionalLight position={[-3, -2, -4]} intensity={2} />
    <group rotation={[0, (view.flip ? Math.PI : 0) + view.turn, 0]} scale={view.zoom * (large ? Math.min(viewport.width * 0.82 / 3, viewport.height * 0.75 / 1.8) : 1)}>
      <primitive object={object} />
    </group>
    <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom={false} enableDamping={false} />
  </>;
}

export default function BoardCanvas({ model, image, name, large = false }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [view, setView] = useState<View>(initialView);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setActive(true); observer.disconnect(); }
    }, { rootMargin: "100px" });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const fallback = <Image src={image} alt={`${name} PCB render`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-4" />;
  const buttonClass = "grid h-10 w-10 place-items-center rounded-md border border-border bg-background/90 text-foreground transition hover:bg-muted disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
  return <div ref={container} className="pcb-viewer relative w-full" data-board={name}>
    <div className={`relative w-full ${large ? "pcb-large-surface" : "aspect-[4/3]"}`} role="region" aria-label={`${name} interactive 3D model`}>
      {(!ready || showPhoto) && fallback}
      {active && !showPhoto && <ModelErrorBoundary fallback={fallback}>
        <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 5.6], fov: 40, near: 0.5, far: 30 }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }} fallback={fallback}>
          <Suspense fallback={null}><Board url={model} view={view} onReady={onReady} large={large} /></Suspense>
        </Canvas>
      </ModelErrorBoundary>}
      {!ready && !showPhoto && <span className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-muted-foreground" role="status"><Box size={14} />{active ? "Loading 3D model" : "PCB preview"}</span>}
    </div>
    <div className="flex flex-wrap justify-center gap-2 py-3" role="group" aria-label={`${name} model controls`}>
      <button type="button" className={buttonClass} title={showPhoto ? "Show 3D model" : "Show static image"} aria-label={showPhoto ? "Show 3D model" : "Show static image"} aria-pressed={showPhoto} onClick={() => setShowPhoto(value => !value)}>{showPhoto ? <Box size={18} /> : <ImageIcon size={18} />}</button>
      {!showPhoto && <>
      <button type="button" className={buttonClass} title="Rotate left" aria-label="Rotate left" onClick={() => setView(v => ({ ...v, turn: v.turn - Math.PI / 6 }))}><RotateCcw size={18} /></button>
      <button type="button" className={buttonClass} title="Rotate right" aria-label="Rotate right" onClick={() => setView(v => ({ ...v, turn: v.turn + Math.PI / 6 }))}><RotateCw size={18} /></button>
      <button type="button" className={buttonClass} title="Flip board" aria-label="Flip board" aria-pressed={view.flip} onClick={() => setView(v => ({ ...v, flip: !v.flip }))}><FlipVertical2 size={18} /></button>
      <button type="button" className={buttonClass} title="Zoom in" aria-label="Zoom in" disabled={view.zoom >= 1.8} onClick={() => setView(v => ({ ...v, zoom: Math.min(1.8, v.zoom + 0.2) }))}><ZoomIn size={18} /></button>
      <button type="button" className={buttonClass} title="Zoom out" aria-label="Zoom out" disabled={view.zoom <= 0.6} onClick={() => setView(v => ({ ...v, zoom: Math.max(0.6, v.zoom - 0.2) }))}><ZoomOut size={18} /></button>
      <button type="button" className={buttonClass} title="Reset view" aria-label="Reset view" onClick={() => setView({ ...initialView })}><Box size={18} /></button>
      </>}
    </div>
  </div>;
}
