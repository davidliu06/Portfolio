"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { buildExplodeTargets, humanizePartName, type ExplodeTarget } from "./explode";

type AssemblyModelProps = {
  url: string;
  exploded: boolean;
  isolatedName: string | null;
  namePrefix?: string;
  isDraggingRef: { current: boolean };
  dragDistanceRef: { current: number };
  onHoverChange: (label: string | null) => void;
  onPartClick: (rawName: string) => void;
  onReady: (model: THREE.Object3D) => void;
};

type PreparedAssembly = {
  model: THREE.Object3D;
  meshes: THREE.Mesh[];
  explodeTargets: ExplodeTarget[];
};

/** Centers + uniformly scales a loaded GLTF scene in place, clones materials so each mounted instance can animate independently, and precomputes the per-subassembly explode vectors — all in one synchronous pass so nothing downstream reads a stale, un-centered bounding box. */
function prepareAssembly(scene: THREE.Object3D): PreparedAssembly {
  const model = scene.clone(true);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = 2.4 / maxDim;

  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  model.updateWorldMatrix(true, true);

  const meshes: THREE.Mesh[] = [];
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = Array.isArray(child.material) ? child.material.map((m) => m.clone()) : child.material.clone();
      meshes.push(child);
    }
  });

  const explodeTargets = buildExplodeTargets(model);

  return { model, meshes, explodeTargets };
}

export function AssemblyModel({
  url,
  exploded,
  isolatedName,
  namePrefix,
  isDraggingRef,
  dragDistanceRef,
  onHoverChange,
  onPartClick,
  onReady
}: AssemblyModelProps) {
  const { scene } = useGLTF(url);
  const { model, meshes, explodeTargets } = useMemo(() => prepareAssembly(scene), [scene]);
  const hoveredMesh = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    onReady(model);
  }, [model, onReady]);

  useEffect(() => {
    const tweens = explodeTargets.map((target) => {
      const goal = exploded ? target.restPosition.clone().addScaledVector(target.direction, 0.9) : target.restPosition;
      return gsap.to(target.object.position, { x: goal.x, y: goal.y, z: goal.z, duration: 1.1, ease: "power3.inOut" });
    });
    return () => tweens.forEach((tween) => tween.kill());
  }, [exploded, explodeTargets]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    for (const mesh of meshes) {
      const material = mesh.material;
      if (!material || Array.isArray(material) || !("emissiveIntensity" in material)) continue;
      const standard = material as THREE.MeshStandardMaterial;

      const isIsolatedTarget = isolatedName ? mesh.name === isolatedName : true;
      const isHovered = hoveredMesh.current === mesh;
      const targetOpacity = isolatedName ? (isIsolatedTarget ? 1 : 0.1) : 1;

      standard.transparent = isolatedName !== null;
      standard.opacity = THREE.MathUtils.damp(standard.opacity, targetOpacity, 6, dt);
      standard.emissiveIntensity = THREE.MathUtils.damp(standard.emissiveIntensity, isHovered ? 0.55 : 0, 8, dt);
    }
  });

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    if (isDraggingRef.current) return;
    const mesh = event.object as THREE.Mesh;
    if (hoveredMesh.current !== mesh) {
      hoveredMesh.current = mesh;
      onHoverChange(humanizePartName(mesh.name, namePrefix));
    }
  }

  function handlePointerLeave() {
    hoveredMesh.current = null;
    onHoverChange(null);
  }

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (dragDistanceRef.current > 4) return;
    onPartClick((event.object as THREE.Mesh).name);
  }

  return <primitive object={model} onClick={handleClick} onPointerLeave={handlePointerLeave} onPointerMove={handlePointerMove} />;
}
