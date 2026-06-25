"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

export type RevealPreset = "fade-up" | "fade-scale" | "slide-left" | "slide-right" | "mask-wipe";

const EASE = [0.16, 1, 0.3, 1] as const;

const PRESETS: Record<RevealPreset, Variants> = {
  "fade-up": { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0 } },
  "fade-scale": { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  "slide-left": { hidden: { opacity: 0, x: 64 }, visible: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: -64 }, visible: { opacity: 1, x: 0 } },
  "mask-wipe": { hidden: { clipPath: "inset(0% 0% 0% 100%)" }, visible: { clipPath: "inset(0% 0% 0% 0%)" } }
};

type RevealSectionProps = {
  children: ReactNode;
  preset?: RevealPreset;
  className?: string;
  delay?: number;
};

/** A single block that fades/slides/scales into view once, the first time it scrolls into the viewport. */
export function RevealSection({ children, preset = "fade-up", className, delay = 0 }: RevealSectionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={PRESETS[preset]}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

/** Wraps a list/grid of RevealItem children so they animate in one-by-one as the group scrolls into view. */
export function RevealGroup({ children, className, stagger = 0.1 }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  preset?: RevealPreset;
};

export function RevealItem({ children, className, preset = "fade-up" }: RevealItemProps) {
  return (
    <motion.div className={className} variants={PRESETS[preset]} transition={{ duration: 0.5, ease: EASE }}>
      {children}
    </motion.div>
  );
}
