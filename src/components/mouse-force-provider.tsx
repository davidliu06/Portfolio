"use client";

import { useMouseForce } from "@/three/hooks/useMouseForce";

/**
 * Calls useMouseForce exactly once for the whole app. It used to be called
 * from inside Scene.tsx, which meant every mounted 3D scene (hero, AI,
 * resume, galaxy — several can be mounted at once near LazyCanvas
 * boundaries) attached its own window-level pointermove listener, all doing
 * the same math and writing to the same store redundantly. One listener, one
 * computation, shared by every consumer of journeyStore's mouseForce.
 */
export function MouseForceProvider() {
  useMouseForce();
  return null;
}
