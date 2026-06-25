"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AUTO_ROTATE_SPEED = 0.15;
const MAX_POINTER_TILT_Y = 0.18;
const MAX_POINTER_TILT_X = 0.1;

type RotationRigProps = {
  isDraggingRef: { current: boolean };
  dragRotationRef: { current: { x: number; y: number } };
  /** Freezes the idle auto-rotate/tilt — used while exploded or isolated, so the user can actually study the layout instead of it spinning on its own. Manual drag still works regardless. */
  pauseIdle: boolean;
  children: ReactNode;
};

/**
 * The single shared rotation for the model. Idle: a slow turntable
 * auto-rotate plus a gentle tilt toward the pointer. Dragging: the idle
 * motion freezes and the user's own drag offset takes over directly —
 * additive, persistent, and unclamped on both axes, so the user can look
 * all the way around the object with no restriction. Letting go never snaps
 * the model back to wherever the idle animation "should" be.
 */
export function RotationRig({ isDraggingRef, dragRotationRef, pauseIdle, children }: RotationRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseSpin = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);

    if (!isDraggingRef.current && !pauseIdle) {
      baseSpin.current += dt * AUTO_ROTATE_SPEED;
      tilt.current.y = THREE.MathUtils.damp(tilt.current.y, state.pointer.x * MAX_POINTER_TILT_Y, 4, dt);
      tilt.current.x = THREE.MathUtils.damp(tilt.current.x, -state.pointer.y * MAX_POINTER_TILT_X, 4, dt);
    }

    const group = groupRef.current;
    if (group) {
      group.rotation.y = baseSpin.current + tilt.current.y + dragRotationRef.current.y;
      group.rotation.x = tilt.current.x + dragRotationRef.current.x;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
