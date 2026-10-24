"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { pcbStory } from "@/data/pcb-story";
import { prepareBoard } from "./prepare-board";
import { nfcAntennaSegments } from "@/data/nfc-antenna";

function Board({ progress, onReady }: { progress: number; onReady: () => void }) {
  const { scene } = useGLTF("/models/business-card.glb");
  const object = useMemo(() => prepareBoard(scene, "business-card"), [scene]);
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.DirectionalLight>(null);
  const marker = useRef<THREE.Mesh>(null);
  const antenna = useRef<THREE.Group>(null);
  const components = useRef<THREE.Group>(null);
  const current = useRef(progress);
  const { viewport, size, invalidate } = useThree();
  const highlights = useMemo(() => {
    const traces = nfcAntennaSegments.flatMap(segment => segment.map(([x, y]) => new THREE.Vector3(x / 1000, -0.00009, y / 1000).applyMatrix4(object.matrixWorld)));
    const parts = ["D1", "R1", "C1"].map((name, i) => {
      const part = object.getObjectByName(name);
      const bounds = part ? new THREE.Box3().setFromObject(part) : new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      bounds.expandByScalar(0.008);
      const { min, max } = bounds;
      const outline = [[min.x,min.y,min.z], [max.x,min.y,min.z], [max.x,max.y,min.z], [min.x,max.y,min.z], [min.x,min.y,min.z]] as [number, number, number][];
      return { name, outline, center: bounds.getCenter(new THREE.Vector3()), color: ["#ffc879", "#a5ebd5", "#bcaaff"][i] };
    });
    return { traces, parts, antennaCenter: new THREE.Box3().setFromPoints(traces).getCenter(new THREE.Vector3()), circuitCenter: parts.reduce((center, part) => center.add(part.center), new THREE.Vector3()).divideScalar(3) };
  }, [object]);
  const points = useMemo(() => pcbStory.map(chapter => {
    if (chapter.focus === "antenna") return highlights.antennaCenter;
    if (chapter.focus === "circuit") return highlights.circuitCenter;
    const part = chapter.focus ? object.getObjectByName(chapter.focus) : null;
    return part ? new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3()) : new THREE.Vector3();
  }), [object, highlights]);
  const scratch = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), color: new THREE.Color() }), []);
  useEffect(() => { onReady(); }, [onReady]);
  useEffect(() => { invalidate(); }, [progress, invalidate]);

  useFrame((_, delta) => {
    if (!group.current) return;
    current.current = THREE.MathUtils.damp(current.current, progress, 9, Math.min(delta, 0.05));
    const step = current.current * (pcbStory.length - 1);
    const index = Math.min(pcbStory.length - 2, Math.floor(step));
    const t = THREE.MathUtils.smoothstep(step - index, 0, 1);
    const a = pcbStory[index], b = pcbStory[index + 1];
    const angle = THREE.MathUtils.lerp(a.angle, b.angle, t);
    const zoom = THREE.MathUtils.lerp(a.zoom, b.zoom, t);
    const compact = size.width < 900;
    const opening = 1 - THREE.MathUtils.smoothstep(step, 0, 0.85);
    const base = Math.min(viewport.width * (compact ? 0.83 : 0.56) / 3, viewport.height * 0.65 / 1.9);
    const scale = base * zoom;
    scratch.a.copy(points[index]).lerp(points[index + 1], t);
    scratch.a.applyAxisAngle(scratch.b.set(0, 1, 0), angle).multiplyScalar(scale);
    group.current.rotation.y = angle;
    group.current.scale.setScalar(scale);
    group.current.position.set((compact ? 0 : viewport.width * 0.19 * (1 - opening)) - scratch.a.x, -scratch.a.y - (compact ? 0 : opening * viewport.height * 0.08), -scratch.a.z);
    if (marker.current) {
      const focusIndex = t < 0.5 ? index : index + 1;
      marker.current.visible = pcbStory[focusIndex].focus === "U1";
      marker.current.position.copy(points[focusIndex]);
      (marker.current.material as THREE.MeshBasicMaterial).color.set(pcbStory[focusIndex].color);
    }
    if (antenna.current) {
      const emphasis = 1 - THREE.MathUtils.smoothstep(Math.abs(step - 3), 0, 0.9);
      antenna.current.traverse(child => {
        if ("material" in child) (child.material as THREE.Material).opacity = emphasis * 0.85;
      });
    }
    if (components.current) components.current.visible = Math.abs(step - 4) < 0.65;
    if (light.current) {
      light.current.color.set(a.color).lerp(scratch.color.set(b.color), t);
      light.current.position.set(Math.sin(angle) * 4, 3, 5);
    }
    // Demand-render only while the scroll target is settling.
    if (Math.abs(current.current - progress) > 0.0001) invalidate();
  });

  return <>
    <ambientLight intensity={1.7} />
    <directionalLight position={[1, 4, 6]} intensity={2.7} />
    <directionalLight ref={light} position={[-3, 3, 5]} intensity={2} />
    <directionalLight position={[0, 1, -5]} intensity={1.8} />
    <group ref={group}>
      <primitive object={object} />
      <mesh ref={marker} visible={false} renderOrder={2}><ringGeometry args={[0.085, 0.092, 48]} /><meshBasicMaterial side={THREE.DoubleSide} depthTest={false} depthWrite={false} /></mesh>
      <group ref={antenna}><Line points={highlights.traces} segments color="#8ebcef" lineWidth={2} depthTest depthWrite={false} transparent opacity={0} renderOrder={3} /></group>
      <group ref={components} visible={false}>{highlights.parts.map(part => <Line key={part.name} points={part.outline} color={part.color} lineWidth={2.5} depthTest={false} depthWrite={false} renderOrder={3} />)}</group>
    </group>
  </>;
}

export default function ScrollBoard(props: { progress: number; onReady: () => void }) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 5.6], fov: 40, near: 0.5, far: 30 }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}>
    <Suspense fallback={null}><Board {...props} /></Suspense>
  </Canvas>;
}
