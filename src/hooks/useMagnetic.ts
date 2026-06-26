"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/three/hooks/usePrefersReducedMotion";

type UseMagneticOptions = {
  /** Fraction of the cursor's offset from center the element follows. */
  strength?: number;
  /** How far from center (px) the pull starts. */
  radius?: number;
};

/**
 * Cursor-proximity "magnetic" pull for buttons/cards/icons: while the pointer
 * is within `radius` of the element's center, it translates a fraction of the
 * way toward it on a spring; outside that radius — or when the pointer isn't
 * a mouse, or the user prefers reduced motion — it stays put. Pure transform,
 * so it never costs a layout reflow. Reads the bounding rect off the event's
 * own currentTarget rather than holding a ref, so it never competes with a
 * caller's own forwarded ref on the same element.
 */
export function useMagnetic({ strength = 0.3, radius = 80 }: UseMagneticOptions = {}) {
  const reducedMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    if (Math.hypot(dx, dy) > radius) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return { x: springX, y: springY, handlePointerMove, handlePointerLeave };
}
