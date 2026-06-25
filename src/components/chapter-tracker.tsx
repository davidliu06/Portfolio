"use client";

import { useEffect } from "react";
import { useJourneyStore, CHAPTER_ORDER } from "@/store/journeyStore";
import { useAchievementsStore } from "@/store/achievementsStore";
import type { Chapter } from "@/types/portfolio";

const CHAPTER_SECTION_IDS: Record<Chapter, string> = {
  curiosity: "about",
  building: "skills",
  research: "research",
  engineering: "experience",
  ai: "ai",
  systems: "systems",
  vision: "resume"
};

const SECTION_ID_TO_CHAPTER = Object.fromEntries(
  Object.entries(CHAPTER_SECTION_IDS).map(([chapter, id]) => [id, chapter as Chapter])
) as Record<string, Chapter>;

/** Watches every chapter section, keeping journeyStore.activeChapter in sync and crediting the "explorer" achievement on first visit. */
export function ChapterTracker() {
  const setActiveChapter = useJourneyStore((state) => state.setActiveChapter);
  const addProgress = useAchievementsStore((state) => state.addProgress);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const chapter = SECTION_ID_TO_CHAPTER[entry.target.id];
          if (chapter) {
            setActiveChapter(chapter);
            addProgress("explorer", chapter);
          }
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );

    CHAPTER_ORDER.forEach((chapter) => {
      const id = CHAPTER_SECTION_IDS[chapter];
      const el = id ? document.getElementById(id) : null;
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveChapter, addProgress]);

  return null;
}
