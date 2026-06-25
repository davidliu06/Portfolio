"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";

/** Subtle mouse-driven parallax — the camera drifts toward the cursor and always looks at the origin. */
export function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const { mouseForce } = useJourneyStore.getState();
    const targetX = mouseForce.x * 0.6;
    const targetY = mouseForce.y * 0.35;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.lookAt(target.current);
  });

  return null;
}
