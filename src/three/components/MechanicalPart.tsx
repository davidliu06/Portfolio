"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";
import { GearMesh } from "./GearMesh";

export type PartKind = "gear" | "bearing" | "shaft" | "bracket";

type MechanicalPartProps = {
  position: [number, number, number];
  kind: PartKind;
  scale?: number;
  color?: string;
  rotationSpeed?: number;
  worldSpread?: number;
  secret?: boolean;
  onSecretFound?: () => void;
};

/**
 * A floating part with two composed motions: drei's <Float> for ambient
 * idle bob, and a damped radial-repulsion offset driven by journeyStore's
 * mouse force — the cursor reads as a physical presence in the scene
 * without a full physics engine.
 */
export function MechanicalPart({
  position,
  kind,
  scale = 1,
  color = "#9fb4cc",
  rotationSpeed = 0.15,
  worldSpread = 6,
  secret = false,
  onSecretFound
}: MechanicalPartProps) {
  const group = useRef<THREE.Group>(null);
  const displacement = useRef(new THREE.Vector3());
  const basePosition = useRef(new THREE.Vector3(...position));
  const [popped, setPopped] = useState(false);

  useFrame((_, delta) => {
    if (!group.current) return;

    const { mouseForce } = useJourneyStore.getState();
    const cursorX = mouseForce.x * worldSpread;
    const cursorY = mouseForce.y * worldSpread;
    const dx = basePosition.current.x - cursorX;
    const dy = basePosition.current.y - cursorY;
    const dist = Math.hypot(dx, dy);
    const repelRadius = 1.5;
    const attractRadius = 4.2;

    let targetX = 0;
    let targetY = 0;
    if (dist > 0.001) {
      const speed = Math.hypot(mouseForce.vx, mouseForce.vy);
      if (dist < repelRadius) {
        const falloff = 1 - dist / repelRadius;
        const push = falloff * (1.1 + Math.min(speed * 40, 1.6));
        targetX = (dx / dist) * push;
        targetY = (dy / dist) * push;
      } else if (dist < attractRadius) {
        const falloff = 1 - (dist - repelRadius) / (attractRadius - repelRadius);
        const pull = falloff * 0.55;
        targetX = -(dx / dist) * pull;
        targetY = -(dy / dist) * pull;
      }
    }

    displacement.current.x = THREE.MathUtils.damp(displacement.current.x, targetX, 4, delta);
    displacement.current.y = THREE.MathUtils.damp(displacement.current.y, targetY, 4, delta);

    group.current.position.set(
      basePosition.current.x + displacement.current.x,
      basePosition.current.y + displacement.current.y,
      basePosition.current.z
    );
    group.current.rotation.x += delta * rotationSpeed;
    group.current.rotation.y += delta * rotationSpeed * 0.7;

    const targetScale = scale * (popped ? 1.45 : 1);
    const currentScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 6, delta);
    group.current.scale.setScalar(currentScale);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group
        ref={group}
        position={position}
        scale={scale}
        onClick={
          secret
            ? (event) => {
                event.stopPropagation();
                setPopped(true);
                onSecretFound?.();
                window.setTimeout(() => setPopped(false), 700);
              }
            : undefined
        }
      >
        <PartGeometry kind={kind} color={color} />
      </group>
    </Float>
  );
}

function PartGeometry({ kind, color }: { kind: PartKind; color: string }) {
  switch (kind) {
    case "gear":
      return <GearMesh color={color} />;
    case "bearing":
      return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.22, 24, 48]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.25} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      );
    case "shaft":
      return (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 2.4, 16]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.3} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      );
    case "bracket":
    default:
      return (
        <RoundedBox args={[1.1, 0.7, 0.4]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={color} metalness={0.25} roughness={0.35} emissive={color} emissiveIntensity={0.4} />
        </RoundedBox>
      );
  }
}
