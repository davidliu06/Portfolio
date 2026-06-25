import * as THREE from "three";

export type ExplodeTarget = {
  object: THREE.Object3D;
  restPosition: THREE.Vector3;
  direction: THREE.Vector3;
};

/**
 * For each direct child of `root` (the assembly's major subsystems in the
 * original SolidWorks hierarchy — e.g. "HorizontalThruster_SubAssem",
 * "Frame_SubAssem"), computes a radial direction from the assembly centroid
 * to that child's own centroid: the classic exploded-view vector. Operating
 * at this level — not every leaf bolt — matches how a real exploded
 * assembly drawing separates a model.
 */
export function buildExplodeTargets(root: THREE.Object3D): ExplodeTarget[] {
  root.updateWorldMatrix(true, true);

  const overallBox = new THREE.Box3().setFromObject(root);
  const overallCenter = overallBox.getCenter(new THREE.Vector3());

  const targets: ExplodeTarget[] = [];
  for (const child of root.children) {
    const box = new THREE.Box3().setFromObject(child);
    if (box.isEmpty()) continue;

    const childCenter = box.getCenter(new THREE.Vector3());
    const direction = childCenter.clone().sub(overallCenter);
    if (direction.lengthSq() < 1e-6) {
      direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }
    direction.normalize();

    targets.push({ object: child, restPosition: child.position.clone(), direction });
  }
  return targets;
}

/** Human-readable label from a raw SolidWorks node name, e.g. "MdSb26_Crush_HorizontalThrusterHousing-1" -> "Horizontal Thruster Housing". */
export function humanizePartName(rawName: string, stripPrefix?: string): string {
  let name = rawName;
  if (stripPrefix && name.startsWith(stripPrefix)) name = name.slice(stripPrefix.length);
  // GLTFLoader appends its own "_N" suffix when a node's mesh has multiple
  // geometry primitives, stacking on top of the SolidWorks "-N" instance
  // index already in the source name (e.g. "Housing-1" -> "Housing-1_3") —
  // strip the outermost loader-added suffix before the rest.
  name = name.replace(/[-_]\d+$/, "");
  name = name.replace(/\^.*$/, ""); // sub-component suffix after a caret
  name = name.replace(/[-_]\d+$/, ""); // the part's own trailing instance index
  name = name.replace(/_/g, " ");
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2"); // camelCase -> spaced
  return name.trim();
}
