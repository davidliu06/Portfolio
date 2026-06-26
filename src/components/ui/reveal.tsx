"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export type RevealPreset =
  | "fade-up"
  | "fade-scale"
  | "slide-left"
  | "slide-right"
  | "mask-wipe"
  | "blur-rise"
  | "depth-drift"
  | "cinematic";

export type RevealGlow = "cobalt" | "coral" | "violet";

const EASE = [0.16, 1, 0.3, 1] as const;

const GLOW_CLASS: Record<RevealGlow, string> = {
  cobalt: "shadow-glow",
  coral: "shadow-orange",
  violet: "shadow-violet"
};

// Every preset animates only transform/opacity/filter/clipPath — properties the
// compositor can run on the GPU without triggering layout — so stacking several
// of these across a page of reveals never costs a reflow.
const PRESETS: Record<RevealPreset, Variants> = {
  "fade-up": { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0 } },
  "fade-scale": { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  "slide-left": { hidden: { opacity: 0, x: 64 }, visible: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: -64 }, visible: { opacity: 1, x: 0 } },
  "mask-wipe": { hidden: { clipPath: "inset(0% 0% 0% 100%)" }, visible: { clipPath: "inset(0% 0% 0% 0%)" } },
  // Optical "coming into focus" — blur-to-sharp layered on the usual rise.
  "blur-rise": { hidden: { opacity: 0, y: 32, filter: "blur(14px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } },
  // Scale-down + blur + a slight downward drift — fake depth-of-field, like the
  // content is racking into focus from further back in the scene.
  "depth-drift": {
    hidden: { opacity: 0, scale: 1.06, y: -16, filter: "blur(10px)" },
    visible: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
  },
  // The flagship combo: slide + scale + blur together, for moments that should
  // feel like an event rather than a simple fade.
  cinematic: {
    hidden: { opacity: 0, y: 56, scale: 0.95, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
  }
};

type RevealSectionProps = {
  children: ReactNode;
  preset?: RevealPreset;
  className?: string;
  delay?: number;
  duration?: number;
  /** Adds a persistent soft glow (via the existing shadow-glow/orange/violet utilities) that fades in together with the reveal — independent of which motion preset is used. */
  glow?: RevealGlow;
};

/** A single block that reveals once, the first time it scrolls into the viewport, using one of several GPU-only motion presets. */
export function RevealSection({ children, preset = "fade-up", className, delay = 0, duration = 0.65, glow }: RevealSectionProps) {
  return (
    <motion.div
      className={cn(className, glow && GLOW_CLASS[glow])}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={PRESETS[preset]}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  /** Delay before the first child starts — lets a heading/eyebrow finish its own entrance before the group beneath it begins. */
  delayChildren?: number;
  margin?: string;
};

/** Wraps a list/grid of RevealItem children so they animate in one-by-one as the group scrolls into view. */
export function RevealGroup({ children, className, stagger = 0.1, delayChildren = 0, margin = "-80px" }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren } } }}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  preset?: RevealPreset;
  duration?: number;
  glow?: RevealGlow;
};

export function RevealItem({ children, className, preset = "fade-up", duration = 0.5, glow }: RevealItemProps) {
  return (
    <motion.div className={cn(className, glow && GLOW_CLASS[glow])} variants={PRESETS[preset]} transition={{ duration, ease: EASE }}>
      {children}
    </motion.div>
  );
}
