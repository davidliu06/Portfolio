"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";
import type { Chapter } from "@/types/portfolio";

/**
 * Per-chapter base camera positions — the camera drifts to a new vantage point
 * as the active chapter changes, giving a subtle "moving through a world" feel.
 * Mouse parallax is layered on top of each base position.
 */
const BASE_POSITIONS: Record<Chapter, readonly [number, number, number]> = {
  curiosity:   [0,    0,    9.0],
  building:    [0.3,  0.2,  9.2],
  research:    [-0.2, 0.1,  9.1],
  engineering: [0,    0.3,  9.4],
  ai:          [-0.4, 0.1,  8.5],
  systems:     [0.2, -0.1,  8.8],
  vision:      [0,    0,   10.5],
} as const;

/**
 * A single persistent camera controller for the GlobalCanvas.
 * Replaces the per-scene CameraRig components — one RAF callback handles
 * all chapter transitions, mouse parallax, and smooth damping instead of
 * N separate callbacks fighting over the same camera.
 */
export function ScrollCamera() {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const posRef = useRef(new THREE.Vector3(0, 0, 9));

  useFrame((_, delta) => {
    const { mouseForce, activeChapter } = useJourneyStore.getState();

    const base = BASE_POSITIONS[activeChapter] ?? BASE_POSITIONS.curiosity;

    // Fast-decay smoothing (framerate-independent via exponential)
    const posK = 1 - Math.exp(-2.5 * delta);
    const slowK = 1 - Math.exp(-1.5 * delta);

    posRef.current.x += (base[0] + mouseForce.x * 0.55 - posRef.current.x) * posK;
    posRef.current.y += (base[1] + mouseForce.y * 0.35 - posRef.current.y) * posK;
    posRef.current.z += (base[2] - posRef.current.z) * slowK;

    camera.position.copy(posRef.current);

    lookTarget.current.x += (0 - lookTarget.current.x) * posK;
    lookTarget.current.y += (0 - lookTarget.current.y) * posK;
    camera.lookAt(lookTarget.current);
  });

  return null;
}
