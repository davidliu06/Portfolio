"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { AssemblyModel } from "./AssemblyModel";
import { VoxelField } from "./VoxelField";

type AssemblySceneProps = {
  url: string;
  namePrefix?: string;
  accentColor: string;
  scrollProgressRef: { current: number };
  onHoverChange: (label: string | null) => void;
  exploded: boolean;
  isolatedName: string | null;
  onPartClick: (rawName: string) => void;
};

/** Subtle orbit tied to scroll progress through the embed's own container, plus a gentle mouse parallax — the camera move stays inside this viewer, never the page. */
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
  onHoverChange,
  exploded,
  isolatedName,
  onPartClick
}: AssemblySceneProps) {
  const cursorRef = useRef<THREE.Vector3 | null>(null);
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [voxelOpacity, setVoxelOpacity] = useState(0.55);

  useFrame((_, delta) => {
    const target = exploded ? 0.95 : 0.55;
    setVoxelOpacity((current) => THREE.MathUtils.damp(current, target, 4, delta));
  });

  return (
    <>
      <ScrollCameraRig scrollProgressRef={scrollProgressRef} />
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow intensity={1.4} position={[3, 4, 2]} />
      <pointLight color={accentColor} intensity={0.8} position={[-3, -1, -2]} />

      <AssemblyModel
        cursorRef={cursorRef}
        exploded={exploded}
        isolatedName={isolatedName}
        namePrefix={namePrefix}
        onHoverChange={onHoverChange}
        onPartClick={onPartClick}
        onReady={setModel}
        url={url}
      />
      {model && <VoxelField cursorRef={cursorRef} model={model} opacity={voxelOpacity} />}
    </>
  );
}
