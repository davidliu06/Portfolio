"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleAssemblySurface } from "./voxelize";
import { SpringField } from "./springField";

type VoxelFieldProps = {
  model: THREE.Object3D;
  cursorRef: { current: THREE.Vector3 | null };
  count?: number;
  voxelSize?: number;
  opacity?: number;
};

const dummy = new THREE.Object3D();

/**
 * The "digital energy field": an InstancedMesh of voxels sampled straight off
 * the model's own surface, displaced away from the cursor with spring
 * physics. Wave propagation is approximated cheaply — instead of an explicit
 * neighbor graph, each voxel's effective push is lerped toward its target at
 * a rate that falls off with distance from the cursor, so the outer edge of
 * the disturbance visibly lags the center rather than reacting instantly.
 * That reads as a traveling ripple at a fraction of the cost of simulating
 * per-voxel neighbor influence on a few thousand instances every frame.
 */
export function VoxelField({ model, cursorRef, count = 2200, voxelSize = 0.01, opacity = 0.85 }: VoxelFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { springField, colors, repelRadius } = useMemo(() => {
    const seeds = sampleAssemblySurface(model, count);
    const restPositions = new Float32Array(seeds.length * 3);
    const colorArray = new Float32Array(seeds.length * 3);

    const box = new THREE.Box3();
    seeds.forEach((seed, i) => {
      restPositions[i * 3] = seed.position.x;
      restPositions[i * 3 + 1] = seed.position.y;
      restPositions[i * 3 + 2] = seed.position.z;
      colorArray[i * 3] = seed.color.r;
      colorArray[i * 3 + 1] = seed.color.g;
      colorArray[i * 3 + 2] = seed.color.b;
      box.expandByPoint(seed.position);
    });

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    return {
      springField: new SpringField(restPositions, { stiffness: 75, damping: 10 }),
      colors: colorArray,
      repelRadius: Math.max(sphere.radius * 0.16, 0.02)
    };
  }, [model, count]);

  const smoothed = useMemo(() => new Float32Array(springField.count * 3), [springField]);
  const colorAttribute = useMemo(() => new THREE.InstancedBufferAttribute(colors, 3), [colors]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) mesh.geometry.setAttribute("color", colorAttribute);
  }, [colorAttribute]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const cursor = cursorRef.current;

    springField.step(delta, (i, rx, ry, rz, out) => {
      if (!cursor) return null;

      const dx = rx - cursor.x;
      const dy = ry - cursor.y;
      const dz = rz - cursor.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > repelRadius || dist < 1e-5) return null;

      const idx3 = i * 3;
      const falloff = 1 - dist / repelRadius;
      const push = falloff * repelRadius * 2.2;
      const invDist = 1 / dist;
      const lerpRate = THREE.MathUtils.clamp(falloff, 0.08, 0.55);

      smoothed[idx3] = THREE.MathUtils.lerp(smoothed[idx3], dx * invDist * push, lerpRate);
      smoothed[idx3 + 1] = THREE.MathUtils.lerp(smoothed[idx3 + 1], dy * invDist * push, lerpRate);
      smoothed[idx3 + 2] = THREE.MathUtils.lerp(smoothed[idx3 + 2], dz * invDist * push, lerpRate);

      out[0] = smoothed[idx3];
      out[1] = smoothed[idx3 + 1];
      out[2] = smoothed[idx3 + 2];
      return out;
    });

    const positions = springField.positions;
    for (let i = 0; i < springField.count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh args={[undefined, undefined, springField.count]} frustumCulled={false} ref={meshRef}>
      <boxGeometry args={[voxelSize, voxelSize, voxelSize]} />
      <meshStandardMaterial
        emissive="#ffffff"
        emissiveIntensity={0.18}
        metalness={0.1}
        opacity={opacity}
        roughness={0.4}
        toneMapped={false}
        transparent
        vertexColors
      />
    </instancedMesh>
  );
}
