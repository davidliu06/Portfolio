import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

export type VoxelSeed = {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  color: THREE.Color;
};

/**
 * Samples points across the surface of every mesh under `root`, weighted by
 * each mesh's share of total surface area, producing `count` seed points in
 * root-local space — the "digital energy field" is literally derived from
 * the loaded geometry, not a generic particle cloud.
 */
export function sampleAssemblySurface(root: THREE.Object3D, count: number): VoxelSeed[] {
  root.updateWorldMatrix(true, true);

  const meshes: THREE.Mesh[] = [];
  root.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry?.attributes.position) meshes.push(child);
  });
  if (meshes.length === 0) return [];

  const areas = meshes.map((mesh) => {
    const geometry = mesh.geometry;
    if (!geometry.boundingSphere) geometry.computeBoundingSphere();
    const radius = geometry.boundingSphere?.radius ?? 1;
    return Math.max(radius * radius, 1e-4);
  });
  const totalArea = areas.reduce((a, b) => a + b, 0);

  const rootInverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const seeds: VoxelSeed[] = [];
  const tempPosition = new THREE.Vector3();
  const tempNormal = new THREE.Vector3();
  const tempColor = new THREE.Color();

  meshes.forEach((mesh, i) => {
    const meshCount = Math.max(1, Math.round((areas[i] / totalArea) * count));

    let sampler: MeshSurfaceSampler;
    try {
      sampler = new MeshSurfaceSampler(mesh).build();
    } catch {
      return; // degenerate geometry (zero area) — skip rather than crash the whole field
    }

    const localToRoot = new THREE.Matrix4().multiplyMatrices(rootInverse, mesh.matrixWorld);
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(localToRoot);
    const baseColor =
      mesh.material && !Array.isArray(mesh.material) && "color" in mesh.material
        ? (mesh.material.color as THREE.Color)
        : undefined;

    for (let s = 0; s < meshCount; s++) {
      sampler.sample(tempPosition, tempNormal, tempColor);
      tempPosition.applyMatrix4(localToRoot);
      tempNormal.applyMatrix3(normalMatrix).normalize();

      seeds.push({
        position: tempPosition.clone(),
        normal: tempNormal.clone(),
        color: baseColor ? baseColor.clone() : new THREE.Color("#ffffff")
      });
    }
  });

  return seeds;
}
