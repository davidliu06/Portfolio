"use client";

import { useScroll, useSpring, motion } from "framer-motion";

/** Thin primary-colored line at the very top of the viewport that fills as the user scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[200] h-[2px] origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}
