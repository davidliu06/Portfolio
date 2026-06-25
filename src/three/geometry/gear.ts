import * as THREE from "three";

/**
 * Stylized gear silhouette (trapezoidal teeth, not true involute gearing) —
 * an atmospheric element, not a manufacturable profile.
 */
export function createGearShape(teeth = 12, innerRadius = 0.55, outerRadius = 1, toothDepth = 0.18) {
  const shape = new THREE.Shape();
  const toothAngle = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const angle = i * toothAngle;
    const a0 = angle;
    const a1 = angle + toothAngle * 0.3;
    const a2 = angle + toothAngle * 0.5;
    const a3 = angle + toothAngle * 0.8;
    const rOuter = outerRadius + toothDepth;

    const p0 = [Math.cos(a0) * outerRadius, Math.sin(a0) * outerRadius];
    const p1 = [Math.cos(a1) * rOuter, Math.sin(a1) * rOuter];
    const p2 = [Math.cos(a2) * rOuter, Math.sin(a2) * rOuter];
    const p3 = [Math.cos(a3) * outerRadius, Math.sin(a3) * outerRadius];

    if (i === 0) shape.moveTo(p0[0], p0[1]);
    else shape.lineTo(p0[0], p0[1]);
    shape.lineTo(p1[0], p1[1]);
    shape.lineTo(p2[0], p2[1]);
    shape.lineTo(p3[0], p3[1]);
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  return shape;
}
