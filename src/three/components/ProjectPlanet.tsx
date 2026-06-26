"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/types/portfolio";

const ACCENT_COLORS: Record<Project["accent"], string> = {
  blue: "#2F5DFF",
  teal: "#8B5CF6",
  gold: "#F5A623",
  orange: "#FF5D3A"
};

type ProjectPlanetProps = {
  project: Project;
  position: [number, number, number];
  isActive: boolean;
  onOpen: () => void;
};

/** A planet that dramatically scales up and brightens as the camera dives toward it when opened — the visual half of the cinematic zoom transition. An expanding, fading pulse ring fires on the moment of activation as a secondary "energy release" beat, so the open doesn't just stop once the dive starts. */
export function ProjectPlanet({ project, position, isActive, onOpen }: ProjectPlanetProps) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const pulseRing = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);
  const pulse = useRef(0);
  const wasActive = useRef(false);
  const color = ACCENT_COLORS[project.accent];

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
    if (ring.current) ring.current.rotation.z += delta * 0.3;

    const targetScale = isActive ? 7 : hovered ? 1.15 : 1;
    const lambda = isActive ? 3.2 : 6;
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, targetScale, lambda, delta);
    group.current?.scale.setScalar(scaleRef.current);

    if (isActive && !wasActive.current) pulse.current = 1;
    wasActive.current = isActive;
    if (pulse.current > 0) pulse.current = Math.max(0, pulse.current - delta * 1.1);

    if (pulseRing.current) {
      const progress = 1 - pulse.current;
      pulseRing.current.scale.setScalar(1 + progress * 3.2);
      const material = pulseRing.current.material as THREE.MeshBasicMaterial;
      material.opacity = pulse.current * 0.8;
    }
  });

  function handleClick(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onOpen();
  }

  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={isActive ? 0 : 0.5}>
        <group
          ref={group}
          onPointerEnter={(event) => {
            event.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={(event) => {
            event.stopPropagation();
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={handleClick}
        >
          <mesh>
            <icosahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial
              color={color}
              metalness={0.35}
              roughness={0.3}
              emissive={color}
              emissiveIntensity={isActive ? 1.1 : hovered ? 0.6 : 0.22}
              toneMapped={!isActive}
            />
          </mesh>
          <mesh ref={ring} rotation={[Math.PI / 2.4, 0.4, 0]}>
            <torusGeometry args={[1.45, 0.015, 8, 64]} />
            <meshBasicMaterial color={color} transparent opacity={isActive ? 0 : 0.5} />
          </mesh>
          {/* The activation "energy release" — expands outward and fades over ~0.9s, driven entirely by the pulse ref above. Invisible (opacity 0) the rest of the time. */}
          <mesh ref={pulseRing} rotation={[Math.PI / 2.4, 0.4, 0]}>
            <torusGeometry args={[1.45, 0.02, 8, 64]} />
            <meshBasicMaterial color={color} transparent depthWrite={false} opacity={0} toneMapped={false} />
          </mesh>
        </group>
      </Float>

      {!isActive && (
        <Html center distanceFactor={10} position={[0, -1.7, 0]} style={{ pointerEvents: "none" }}>
          <p className="night-card whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground shadow-glow">
            {project.shortTitle}
          </p>
        </Html>
      )}
    </group>
  );
}
