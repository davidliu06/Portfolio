import { create } from "zustand";
import type { Chapter } from "@/types/portfolio";

export const CHAPTER_ORDER: Chapter[] = ["curiosity", "building", "research", "engineering", "ai", "systems", "vision"];

type MouseForce = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type JourneyState = {
  activeChapter: Chapter;
  scrollProgress: number;
  mouseForce: MouseForce;
  setActiveChapter: (chapter: Chapter) => void;
  setScrollProgress: (progress: number) => void;
  setMouseForce: (force: MouseForce) => void;
};

export const useJourneyStore = create<JourneyState>((set) => ({
  activeChapter: "curiosity",
  scrollProgress: 0,
  mouseForce: { x: 0, y: 0, vx: 0, vy: 0 },
  setActiveChapter: (chapter) => set({ activeChapter: chapter }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setMouseForce: (force) => set({ mouseForce: force })
}));
