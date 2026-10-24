import * as THREE from "three";

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
      let parent: THREE.Object3D | null = child;
      while (parent) {
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
