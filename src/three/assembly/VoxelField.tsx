"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleAssemblySurface } from "./voxelize";
import { SpringField } from "./springField";

type VoxelFieldProps = {
  model: THREE.Object3D;
  count?: number;
  voxelSize?: number;
  opacity?: number;
};

const dummy = new THREE.Object3D();

/**
 * The "digital energy field": an InstancedMesh of voxels sampled straight off
 * the model's own surface. Each voxel holds a slow, per-voxel sinusoidal
 * drift around its rest position (spring-damped, not literal interpolation,
 * so it still has weight/lag) — a passive ambient shimmer, not a cursor
 * interaction. The per-voxel phase comes from its own index so neighboring
 * voxels drift slightly out of sync with each other instead of in lockstep.
 */
export function VoxelField({ model, count = 2200, voxelSize = 0.01, opacity = 0.85 }: VoxelFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const elapsed = useRef(0);

  const { springField, colors, driftAmplitude } = useMemo(() => {
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
      springField: new SpringField(restPositions, { stiffness: 40, damping: 6 }),
      colors: colorArray,
      driftAmplitude: Math.max(sphere.radius * 0.012, 0.003)
    };
  }, [model, count]);

  const colorAttribute = useMemo(() => new THREE.InstancedBufferAttribute(colors, 3), [colors]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) mesh.geometry.setAttribute("color", colorAttribute);
  }, [colorAttribute]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    elapsed.current += delta;
    const t = elapsed.current;

    springField.step(delta, (i, _rx, _ry, _rz, out) => {
      const phase = i * 12.9898;
      out[0] = Math.sin(t * 0.6 + phase) * driftAmplitude;
      out[1] = Math.sin(t * 0.5 + phase * 1.3) * driftAmplitude;
      out[2] = Math.sin(t * 0.7 + phase * 0.7) * driftAmplitude;
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
