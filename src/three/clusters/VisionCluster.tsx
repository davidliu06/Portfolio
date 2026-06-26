"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";

type SlowRingProps = {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
};

function SlowRing({ radius, tilt, speed, color }: SlowRingProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.01, 8, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} toneMapped={false} />
    </mesh>
  );
}

/** Active during systems and vision chapters. */
export function VisionCluster() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const { activeChapter } = useJourneyStore.getState();
    groupRef.current.visible = activeChapter === "systems" || activeChapter === "vision";
  });

  return (
    <group ref={groupRef}>
      <Sparkles count={100} scale={18} size={1.3} speed={0.12} color="#8B5CF6" opacity={0.5} />
      <SlowRing radius={4} tilt={[Math.PI / 2.2, 0, 0]} speed={0.04} color="#2F5DFF" />
      <SlowRing radius={5.6} tilt={[Math.PI / 1.8, 0.3, 0]} speed={-0.03} color="#FF5D3A" />
      <SlowRing radius={7} tilt={[Math.PI / 2.6, -0.2, 0]} speed={0.02} color="#F5A623" />
    </group>
  );
}
