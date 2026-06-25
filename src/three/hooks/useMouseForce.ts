"use client";

import { useEffect, useRef } from "react";
import { useJourneyStore } from "@/store/journeyStore";

/**
 * Tracks normalized pointer position (-1..1, Three.js NDC convention) and
 * velocity, writing into journeyStore so any 3D component can react without
 * each one binding its own window listener.
 */
export function useMouseForce() {
  const setMouseForce = useJourneyStore((state) => state.setMouseForce);
  const last = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const now = performance.now();
      const dt = Math.max(now - last.current.t, 1);
      const vx = (x - last.current.x) / dt;
      const vy = (y - last.current.y) / dt;
      last.current = { x, y, t: now };
      setMouseForce({ x, y, vx, vy });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [setMouseForce]);
}
