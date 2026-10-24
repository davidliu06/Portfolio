import * as THREE from "three";
import { nfcAntennaSegments } from "@/data/nfc-antenna";

/** Normalize the real KiCad export without mutating the shared loader cache. */
export function prepareBoard(scene: THREE.Object3D, url: string) {
  const clone = scene.clone(true);
  clone.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;
    const prepare = (source: THREE.Material) => {
      const material = source.clone();
      // Opaque coatings prevent rear silkscreen sorting over the front surface.
      material.transparent = false;
      material.opacity = 1;
      material.depthWrite = true;
      // This KiCad GLB uses numeric node names; its coating materials are stable.
      if (!url.includes("can-shield")) {
        if (["mat_11", "mat_12", "mat_13"].includes(source.name) && material instanceof THREE.MeshStandardMaterial) {
          material.color.set("#090a0c");
          material.roughness = 0.76;
          material.metalness = 0.08;
        }
        if (["mat_9", "mat_10", "mat_11", "mat_12"].includes(source.name)) {
          const offset = ["mat_9", "mat_10"].includes(source.name) ? -4 : -2;
          material.polygonOffset = true;
          material.polygonOffsetFactor = offset;
          material.polygonOffsetUnits = offset;
        }
      }
      let parent: THREE.Object3D | null = child;
      while (parent) {
        const name = parent.name.toLowerCase();
        if (!url.includes("can-shield") && (name.includes("soldermask") || name.endsWith("_pcb")) && material instanceof THREE.MeshStandardMaterial) {
          material.color.set("#090a0c");
          material.roughness = 0.76;
          material.metalness = 0.08;
        }
        if (parent.name.toLowerCase().includes("silkscreen")) {
          material.polygonOffset = true;
          material.polygonOffsetFactor = -4;
          material.polygonOffsetUnits = -4;
          break;
        }
        if (parent.name.toLowerCase().includes("soldermask")) {
          material.polygonOffset = true;
          material.polygonOffsetFactor = -2;
          material.polygonOffsetUnits = -2;
          break;
        }
        parent = parent.parent;
      }
      return material;
    };
    child.material = Array.isArray(child.material) ? child.material.map(prepare) : prepare(child.material);
  });
  if (!url.includes("can-shield")) {
    // Keep the physical back-copper coil visible in both story and inspection views.
    const points = nfcAntennaSegments.flatMap(segment => segment.map(([x, y]) => new THREE.Vector3(x / 1000, -0.00012, y / 1000)));
    const coil = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: "#91a7b5" }));
    coil.name = "persistent-antenna";
    clone.add(coil);
  }
  clone.rotation.x = Math.PI / 2;
  if (url.includes("can-shield")) clone.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI);
  clone.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(clone);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 3 / Math.max(size.x, size.y, size.z);
  clone.scale.setScalar(scale);
  clone.position.copy(center.multiplyScalar(-scale));
  clone.updateMatrixWorld(true);
  return clone;
}
