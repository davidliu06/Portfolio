"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useAchievementsStore } from "@/store/achievementsStore";

export function AchievementToast() {
  const lastUnlocked = useAchievementsStore((state) => state.lastUnlocked);
  const dismissToast = useAchievementsStore((state) => state.dismissToast);

  useEffect(() => {
    if (!lastUnlocked) return;
    const timeout = window.setTimeout(() => dismissToast(), 5000);
    return () => window.clearTimeout(timeout);
  }, [lastUnlocked, dismissToast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center">
      <AnimatePresence>
        {lastUnlocked && (
          <motion.div
            className="night-card pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-glow"
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-accent/15 text-accent">
              <Trophy size={20} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Achievement unlocked</p>
              <p className="text-sm font-bold text-foreground">{lastUnlocked.title}</p>
              <p className="text-xs text-muted-foreground">{lastUnlocked.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
