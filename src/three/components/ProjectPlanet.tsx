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
  onOpen: (point: { x: number; y: number }) => void;
};

/** A planet that dramatically scales up and brightens as the camera dives toward it when opened — the visual half of the cinematic zoom transition. */
export function ProjectPlanet({ project, position, isActive, onOpen }: ProjectPlanetProps) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);
  const color = ACCENT_COLORS[project.accent];

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
    if (ring.current) ring.current.rotation.z += delta * 0.3;

    const targetScale = isActive ? 7 : hovered ? 1.15 : 1;
    const lambda = isActive ? 3.2 : 6;
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, targetScale, lambda, delta);
    group.current?.scale.setScalar(scaleRef.current);
  });

  function handleClick(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onOpen({ x: event.clientX, y: event.clientY });
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
        </group>
      </Float>

      {!isActive && (
        <Html center distanceFactor={10} position={[0, -1.7, 0]} style={{ pointerEvents: "none" }}>
          <p className="night-card whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground shadow-glow">
            {project.name}
          </p>
        </Html>
      )}
    </group>
  );
}
