"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AUTO_ROTATE_SPEED = 0.15;
const MAX_POINTER_TILT_Y = 0.18;
const MAX_POINTER_TILT_X = 0.1;
const PITCH_LIMIT = 0.7;

type RotationRigProps = {
  isDraggingRef: { current: boolean };
  dragRotationRef: { current: { x: number; y: number } };
  children: ReactNode;
};

/**
 * The single shared rotation for both the solid model and its voxel energy
 * field, so they always spin together as one object. Idle: a slow turntable
 * auto-rotate plus a gentle tilt toward the pointer. Dragging: the idle
 * motion freezes and the user's own drag offset takes over directly —
 * additive and persistent, so letting go never snaps the model back to
 * wherever the idle animation "should" be.
 */
export function RotationRig({ isDraggingRef, dragRotationRef, children }: RotationRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseSpin = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);

    if (!isDraggingRef.current) {
      baseSpin.current += dt * AUTO_ROTATE_SPEED;
      tilt.current.y = THREE.MathUtils.damp(tilt.current.y, state.pointer.x * MAX_POINTER_TILT_Y, 4, dt);
      tilt.current.x = THREE.MathUtils.damp(tilt.current.x, -state.pointer.y * MAX_POINTER_TILT_X, 4, dt);
    }

    const group = groupRef.current;
    if (group) {
      group.rotation.y = baseSpin.current + tilt.current.y + dragRotationRef.current.y;
      group.rotation.x = THREE.MathUtils.clamp(tilt.current.x + dragRotationRef.current.x, -PITCH_LIMIT, PITCH_LIMIT);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
