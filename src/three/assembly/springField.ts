export type SpringFieldOptions = {
  stiffness?: number;
  damping?: number;
};

/**
 * Typed-array spring simulation for N points (Hooke's law, explicit
 * integration). Deliberately avoids per-point Vector3 allocation per frame —
 * with a few thousand voxels, that allocation churn is the difference
 * between 60fps and a GC-stutter mess.
 */
export class SpringField {
  readonly count: number;
  readonly restPositions: Float32Array;
  readonly positions: Float32Array;
  readonly velocities: Float32Array;
  stiffness: number;
  damping: number;

  constructor(restPositions: Float32Array, options: SpringFieldOptions = {}) {
    this.count = restPositions.length / 3;
    this.restPositions = restPositions;
    this.positions = restPositions.slice();
    this.velocities = new Float32Array(restPositions.length);
    this.stiffness = options.stiffness ?? 90;
    this.damping = options.damping ?? 12;
  }

  /**
   * `getTargetOffset(index, restX, restY, restZ, out)` writes the desired
   * displacement (from rest) into `out` and returns it, or returns null to
   * mean "no external force — spring back to rest."
   */
  step(delta: number, getTargetOffset: (index: number, rx: number, ry: number, rz: number, out: [number, number, number]) => [number, number, number] | null) {
    const dt = Math.min(delta, 1 / 30);
    const { restPositions, positions, velocities, stiffness, damping, count } = this;
    const scratch: [number, number, number] = [0, 0, 0];

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const rx = restPositions[ix];
      const ry = restPositions[ix + 1];
      const rz = restPositions[ix + 2];

      const offset = getTargetOffset(i, rx, ry, rz, scratch);
      const targetX = offset ? rx + offset[0] : rx;
      const targetY = offset ? ry + offset[1] : ry;
      const targetZ = offset ? rz + offset[2] : rz;

      const ax = (targetX - positions[ix]) * stiffness - velocities[ix] * damping;
      const ay = (targetY - positions[ix + 1]) * stiffness - velocities[ix + 1] * damping;
      const az = (targetZ - positions[ix + 2]) * stiffness - velocities[ix + 2] * damping;

      velocities[ix] += ax * dt;
      velocities[ix + 1] += ay * dt;
      velocities[ix + 2] += az * dt;

      positions[ix] += velocities[ix] * dt;
      positions[ix + 1] += velocities[ix + 1] * dt;
      positions[ix + 2] += velocities[ix + 2] * dt;
    }
  }
}
