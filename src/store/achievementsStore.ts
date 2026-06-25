import { create } from "zustand";

export type AchievementId = "explorer" | "planet-hopper" | "curious-mind" | "hidden-gear";

export type AchievementDef = {
  id: AchievementId;
  title: string;
  description: string;
  total: number;
  unique: boolean;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "explorer", title: "Full Tour", description: "Scrolled through every chapter of the journey.", total: 7, unique: true },
  { id: "planet-hopper", title: "Planet Hopper", description: "Opened every project in the Engineering galaxy.", total: 3, unique: true },
  { id: "curious-mind", title: "Curious Mind", description: "Asked Ask David 3 questions.", total: 3, unique: false },
  { id: "hidden-gear", title: "Eagle Eye", description: "Found the one gear in the hero that isn't like the others.", total: 1, unique: false }
];

type ProgressValue = number | Set<string>;

const PROGRESS_KEY = "portfolio-achievements-progress";
const UNLOCKED_KEY = "portfolio-achievements-unlocked";

function progressCount(value: ProgressValue | undefined): number {
  if (!value) return 0;
  return value instanceof Set ? value.size : value;
}

function loadProgress(): Record<string, ProgressValue> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number | string[]>;
    const result: Record<string, ProgressValue> = {};
    for (const [id, value] of Object.entries(parsed)) {
      result[id] = Array.isArray(value) ? new Set(value) : value;
    }
    return result;
  } catch {
    return {};
  }
}

function loadUnlocked(): Set<AchievementId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    return raw ? new Set(JSON.parse(raw) as AchievementId[]) : new Set();
  } catch {
    return new Set();
  }
}

function persist(progress: Record<string, ProgressValue>, unlocked: Set<AchievementId>) {
  if (typeof window === "undefined") return;
  try {
    const serializable: Record<string, number | string[]> = {};
    for (const [id, value] of Object.entries(progress)) {
      serializable[id] = value instanceof Set ? [...value] : value;
    }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(serializable));
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...unlocked]));
  } catch {
    // best-effort persistence only
  }
}

type AchievementsState = {
  progress: Record<string, ProgressValue>;
  unlocked: Set<AchievementId>;
  lastUnlocked: AchievementDef | null;
  addProgress: (id: AchievementId, uniqueKey?: string) => void;
  dismissToast: () => void;
};

export const useAchievementsStore = create<AchievementsState>((set, get) => ({
  progress: loadProgress(),
  unlocked: loadUnlocked(),
  lastUnlocked: null,

  addProgress: (id, uniqueKey) => {
    const def = ACHIEVEMENTS.find((item) => item.id === id);
    const state = get();
    if (!def || state.unlocked.has(id)) return;

    const current = state.progress[id];
    let nextValue: ProgressValue;
    if (def.unique) {
      const set = current instanceof Set ? new Set(current) : new Set<string>();
      if (uniqueKey) set.add(uniqueKey);
      nextValue = set;
    } else {
      nextValue = (typeof current === "number" ? current : 0) + 1;
    }

    const justUnlocked = progressCount(nextValue) >= def.total;
    const nextProgress = { ...state.progress, [id]: nextValue };
    const nextUnlocked = new Set(state.unlocked);
    if (justUnlocked) nextUnlocked.add(id);

    persist(nextProgress, nextUnlocked);

    set({
      progress: nextProgress,
      unlocked: nextUnlocked,
      lastUnlocked: justUnlocked ? def : state.lastUnlocked
    });
  },

  dismissToast: () => set({ lastUnlocked: null })
}));
