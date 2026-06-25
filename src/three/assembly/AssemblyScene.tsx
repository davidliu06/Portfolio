"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { AssemblyModel } from "./AssemblyModel";
import { RotationRig } from "./RotationRig";

type AssemblySceneProps = {
  url: string;
  namePrefix?: string;
  accentColor: string;
  scrollProgressRef: { current: number };
  isDraggingRef: { current: boolean };
  dragRotationRef: { current: { x: number; y: number } };
  dragDistanceRef: { current: number };
  onHoverChange: (label: string | null) => void;
  exploded: boolean;
  isolatedName: string | null;
  onPartClick: (rawName: string) => void;
  onModelLoaded?: (partCount: number) => void;
};

/** Subtle orbit tied to scroll progress through the embed's own container — the camera move stays inside this viewer, never the page. Manual drag rotates the object itself (see RotationRig), so this rig only ever has to think about scroll. */
function ScrollCameraRig({ scrollProgressRef }: { scrollProgressRef: { current: number } }) {
  const { camera } = useThree();
  const angle = useRef(0);

  useFrame((_, delta) => {
    const targetAngle = -0.5 + scrollProgressRef.current * 1.0;
    angle.current = THREE.MathUtils.damp(angle.current, targetAngle, 3, delta);

    const radius = 4.2;
    camera.position.x = Math.sin(angle.current) * radius;
    camera.position.z = Math.cos(angle.current) * radius;
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.6 + scrollProgressRef.current * 0.4, 3, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function AssemblyScene({
  url,
  namePrefix,
  accentColor,
  scrollProgressRef,
  isDraggingRef,
  dragRotationRef,
  dragDistanceRef,
  onHoverChange,
  exploded,
  isolatedName,
  onPartClick,
  onModelLoaded
}: AssemblySceneProps) {
  return (
    <>
      <ScrollCameraRig scrollProgressRef={scrollProgressRef} />
      {/* Procedurally generated studio environment — built from local Lightformer
          panels rather than a fetched HDRI, so the model's PBR reflections never
          depend on a third-party CDN being reachable. */}
      <Environment resolution={256}>
        <Lightformer color="#ffffff" form="rect" intensity={2.2} position={[0, 4, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} />
        <Lightformer color="#ffffff" form="rect" intensity={1} position={[-4, 1, 3]} scale={[3, 4, 1]} />
        <Lightformer color={accentColor} form="rect" intensity={1.4} position={[3, -1, -3]} scale={[3, 4, 1]} />
      </Environment>
      <ambientLight intensity={0.45} />
      {/* No shadow-receiving surface in this scene, so shadow casting is left off — it's a real render-pass cost with nothing to show for it. */}
      <directionalLight intensity={1.2} position={[3, 4, 2]} />
      <directionalLight intensity={0.3} position={[-2, 1, 3]} />
      <pointLight color={accentColor} intensity={1.1} position={[-3, -1, -2]} />

      <RotationRig dragRotationRef={dragRotationRef} isDraggingRef={isDraggingRef} pauseIdle={exploded || isolatedName !== null}>
        <AssemblyModel
          dragDistanceRef={dragDistanceRef}
          exploded={exploded}
          isDraggingRef={isDraggingRef}
          isolatedName={isolatedName}
          namePrefix={namePrefix}
          onHoverChange={onHoverChange}
          onPartClick={onPartClick}
          onReady={(_model, partCount) => onModelLoaded?.(partCount)}
          url={url}
        />
      </RotationRig>
    </>
  );
}
