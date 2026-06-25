"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";

type GalaxyCameraRigProps = {
  focusPosition: [number, number, number] | null;
  diving?: boolean;
  idleZ?: number;
};

/** Idle: gentle mouse parallax around the origin. Focused: dollies toward and looks at the selected planet. Diving: a much closer, snappier dive used for the cinematic open transition. */
export function GalaxyCameraRig({ focusPosition, diving = false, idleZ = 8.5 }: GalaxyCameraRigProps) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const { mouseForce } = useJourneyStore.getState();

    const focusDistance = diving ? 1.35 : 4.5;
    const focusSpread = diving ? 0.92 : 0.55;
    const target = focusPosition
      ? new THREE.Vector3(focusPosition[0] * focusSpread, focusPosition[1] * focusSpread, focusPosition[2] + focusDistance)
      : new THREE.Vector3(mouseForce.x * 0.8, mouseForce.y * 0.5, idleZ);

    const lambda = diving ? 5.5 : 3;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x, lambda, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y, lambda, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, lambda, delta);

    const lookGoal = focusPosition ?? [0, 0, 0];
    lookTarget.current.x = THREE.MathUtils.damp(lookTarget.current.x, lookGoal[0], 4, delta);
    lookTarget.current.y = THREE.MathUtils.damp(lookTarget.current.y, lookGoal[1], 4, delta);
    lookTarget.current.z = THREE.MathUtils.damp(lookTarget.current.z, lookGoal[2], 4, delta);

    camera.lookAt(lookTarget.current);
  });

  return null;
}
