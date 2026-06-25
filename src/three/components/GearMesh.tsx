"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { createGearShape } from "../geometry/gear";

type GearMeshProps = {
  teeth?: number;
  radius?: number;
  thickness?: number;
  color?: string;
};

export function GearMesh({ teeth = 12, radius = 1, thickness = 0.22, color = "#9fb4cc" }: GearMeshProps) {
  const geometry = useMemo(() => {
    const shape = createGearShape(teeth, radius * 0.55, radius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2
    });
    geo.center();
    return geo;
  }, [teeth, radius, thickness]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        metalness={0.35}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.45}
      />
    </mesh>
  );
}
