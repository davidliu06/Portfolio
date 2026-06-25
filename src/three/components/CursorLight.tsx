"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";

type CursorLightProps = {
  color?: string;
  intensity?: number;
  spread?: number;
};

/** A point light that follows the cursor in world space — lighting itself becomes part of the interaction, per the brief's "lighting changes based on cursor position." */
export function CursorLight({ color = "#2F5DFF", intensity = 2.2, spread = 6 }: CursorLightProps) {
  const light = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (!light.current) return;
    const { mouseForce } = useJourneyStore.getState();
    const targetX = mouseForce.x * spread;
    const targetY = mouseForce.y * spread * 0.6;
    light.current.position.x = THREE.MathUtils.damp(light.current.position.x, targetX, 4, delta);
    light.current.position.y = THREE.MathUtils.damp(light.current.position.y, targetY, 4, delta);
  });

  return <pointLight ref={light} position={[0, 0, 4]} color={color} intensity={intensity} distance={14} decay={2} />;
}
