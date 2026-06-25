"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";

type NeuralNodeProps = {
  position: [number, number, number];
  color?: string;
};

/** A small glowing node with a gentle damped ripple away from the cursor — a softer version of MechanicalPart's repulsion, sized for a dense node field. */
export function NeuralNode({ position, color = "#2F5DFF" }: NeuralNodeProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const displacement = useRef(new THREE.Vector3());
  const base = useRef(new THREE.Vector3(...position));

  useFrame((_, delta) => {
    if (!mesh.current) return;

    const { mouseForce } = useJourneyStore.getState();
    const cursorX = mouseForce.x * 5;
    const cursorY = mouseForce.y * 3.2;
    const dx = base.current.x - cursorX;
    const dy = base.current.y - cursorY;
    const dist = Math.hypot(dx, dy);
    const repelRadius = 0.9;
    const attractRadius = 2.6;

    let targetX = 0;
    let targetY = 0;
    if (dist > 0.001) {
      if (dist < repelRadius) {
        const falloff = 1 - dist / repelRadius;
        const push = falloff * 0.4;
        targetX = (dx / dist) * push;
        targetY = (dy / dist) * push;
      } else if (dist < attractRadius) {
        const falloff = 1 - (dist - repelRadius) / (attractRadius - repelRadius);
        const pull = falloff * 0.2;
        targetX = -(dx / dist) * pull;
        targetY = -(dy / dist) * pull;
      }
    }

    displacement.current.x = THREE.MathUtils.damp(displacement.current.x, targetX, 5, delta);
    displacement.current.y = THREE.MathUtils.damp(displacement.current.y, targetY, 5, delta);

    mesh.current.position.set(
      base.current.x + displacement.current.x,
      base.current.y + displacement.current.y,
      base.current.z
    );
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
    </mesh>
  );
}
