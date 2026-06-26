"use client";

import { motion } from "framer-motion";
import { useJourneyStore, CHAPTER_ORDER } from "@/store/journeyStore";
import { usePrefersReducedMotion } from "@/three/hooks/usePrefersReducedMotion";
import type { Chapter } from "@/types/portfolio";

const CHAPTER_WASH: Record<Chapter, string> = {
  curiosity:
    "radial-gradient(ellipse 60rem 40rem at 15% 0%, rgba(47,93,255,0.16), transparent 60%), radial-gradient(ellipse 50rem 36rem at 85% 30%, rgba(139,92,246,0.08), transparent 60%)",
  building:
    "radial-gradient(ellipse 55rem 40rem at 80% 10%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(ellipse 45rem 34rem at 10% 40%, rgba(47,93,255,0.08), transparent 60%)",
  research:
    "radial-gradient(ellipse 55rem 38rem at 50% 0%, rgba(255,93,58,0.12), transparent 60%), radial-gradient(ellipse 48rem 36rem at 15% 60%, rgba(47,93,255,0.1), transparent 60%)",
  engineering:
    "radial-gradient(ellipse 60rem 42rem at 10% 10%, rgba(47,93,255,0.18), transparent 60%), radial-gradient(ellipse 50rem 36rem at 90% 50%, rgba(255,93,58,0.1), transparent 60%)",
  ai:
    "radial-gradient(ellipse 58rem 40rem at 85% 20%, rgba(139,92,246,0.2), transparent 60%), radial-gradient(ellipse 46rem 34rem at 15% 70%, rgba(47,93,255,0.1), transparent 60%)",
  systems:
    "radial-gradient(ellipse 56rem 38rem at 50% 100%, rgba(47,93,255,0.14), transparent 60%), radial-gradient(ellipse 48rem 34rem at 90% 0%, rgba(139,92,246,0.1), transparent 60%)",
  vision:
    "radial-gradient(ellipse 60rem 42rem at 50% 105%, rgba(255,93,58,0.16), transparent 60%), radial-gradient(ellipse 50rem 36rem at 10% 0%, rgba(139,92,246,0.1), transparent 60%)"
};

/**
 * A fixed, sitewide ambient layer behind every section — cross-fades between
 * a per-chapter color wash as journeyStore's activeChapter changes, so the
 * environment itself shifts as the page scrolls between chapters instead of
 * staying static. Pure opacity cross-fade on a handful of fixed divs, well
 * behind the body's own gradient background — no WebGL, negligible cost.
 */
export function AtmosphereBackground() {
  const activeChapter = useJourneyStore((state) => state.activeChapter);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      {CHAPTER_ORDER.map((chapter) => (
        <motion.div
          animate={{ opacity: activeChapter === chapter ? 1 : 0 }}
          className="absolute inset-0"
          initial={false}
          key={chapter}
          style={{ background: CHAPTER_WASH[chapter] }}
          transition={{ duration: reducedMotion ? 0 : 1.4, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
