"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";

type GemConfig = {
  pos: [number, number, number];
  geo: "ico" | "oct" | "tet";
  color: string;
  size: number;
  rx: number;
  ry: number;
  rz: number;
};

/**
 * Crystalline engineering shapes floating against a deep-space starfield.
 * Icosahedra, octahedra, and tetrahedra are the building blocks of
 * structural geodesics, satellite mesh panels, and molecular models —
 * they look precise without being literal. With emissive materials and
 * the Bloom pass they glow like satellite components catching sunlight.
 */
const GEMS: GemConfig[] = [
  { pos: [-7,  4,  -14], geo: "ico", color: "#3b82f6", size: 0.34, rx: 0.07, ry: 0.11, rz: 0.03 },
  { pos: [9,  -3,  -18], geo: "oct", color: "#a78bfa", size: 0.40, rx: 0.05, ry: 0.08, rz: 0.06 },
  { pos: [-5, -6,  -22], geo: "ico", color: "#22d3ee", size: 0.25, rx: 0.12, ry: 0.06, rz: 0.09 },
  { pos: [6,   7,  -16], geo: "tet", color: "#fb923c", size: 0.28, rx: 0.06, ry: 0.13, rz: 0.04 },
  { pos: [-11, 2,  -26], geo: "ico", color: "#34d399", size: 0.46, rx: 0.04, ry: 0.05, rz: 0.07 },
  { pos: [4,  -8,  -19], geo: "oct", color: "#f472b6", size: 0.21, rx: 0.14, ry: 0.07, rz: 0.05 },
  { pos: [13,  1,  -28], geo: "ico", color: "#60a5fa", size: 0.38, rx: 0.04, ry: 0.09, rz: 0.03 },
  { pos: [-3,  9,  -21], geo: "tet", color: "#818cf8", size: 0.30, rx: 0.09, ry: 0.04, rz: 0.11 },
];

export function SpaceCluster() {
  const sceneRef = useRef<THREE.Group>(null);
  const gemsRef = useRef<THREE.Group>(null);
  const smoothMouse = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const { mouseForce } = useJourneyStore.getState();
    // Exponential smoothing so mouse response feels weighted, not snappy
    const k = 1 - Math.exp(-3 * delta);
    smoothMouse.current.x += (mouseForce.x - smoothMouse.current.x) * k;
    smoothMouse.current.y += (mouseForce.y - smoothMouse.current.y) * k;

    // Slow drift for the whole nebula+gems layer
    if (sceneRef.current) {
      sceneRef.current.rotation.y += delta * 0.003;
      sceneRef.current.rotation.x +=
        (smoothMouse.current.y * 0.035 - sceneRef.current.rotation.x) * k;
    }

    // Gems rotate with additional mouse parallax + individual tumble
    if (gemsRef.current) {
      gemsRef.current.rotation.y +=
        (smoothMouse.current.x * 0.06 - gemsRef.current.rotation.y) * k;
      GEMS.forEach((gem, i) => {
        const child = gemsRef.current!.children[i] as THREE.Mesh;
        if (!child) return;
        child.rotation.x += delta * gem.rx;
        child.rotation.y += delta * gem.ry;
        child.rotation.z += delta * gem.rz;
      });
    }
  });

  return (
    <>
      {/* Stars live outside the drift group — the universe stays fixed */}
      <Stars radius={90} depth={55} count={7000} factor={4} saturation={0.3} fade speed={0.15} />

      <group ref={sceneRef}>
        {/* Nebula gas volumes — additive blending so they glow, not occlude */}
        <mesh position={[10, 6, -32]}>
          <sphereGeometry args={[14, 5, 5]} />
          <meshBasicMaterial
            color="#0c1f6e"
            transparent
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
        <mesh position={[-12, -4, -38]}>
          <sphereGeometry args={[18, 5, 5]} />
          <meshBasicMaterial
            color="#18083c"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
        <mesh position={[2, 11, -25]}>
          <sphereGeometry args={[11, 5, 5]} />
          <meshBasicMaterial
            color="#0d3e28"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Engineering precision gemstones */}
        <group ref={gemsRef}>
          {GEMS.map((gem, i) => (
            <mesh key={i} position={gem.pos} scale={gem.size}>
              {gem.geo === "ico" && <icosahedronGeometry args={[1, 0]} />}
              {gem.geo === "oct" && <octahedronGeometry args={[1, 0]} />}
              {gem.geo === "tet" && <tetrahedronGeometry args={[1, 0]} />}
              <meshStandardMaterial
                color={gem.color}
                metalness={0.92}
                roughness={0.08}
                emissive={gem.color}
                emissiveIntensity={0.28}
              />
            </mesh>
          ))}
        </group>
      </group>
    </>
  );
}
