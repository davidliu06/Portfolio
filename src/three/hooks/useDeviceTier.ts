"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "low" | "medium" | "high";

function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "medium";

  const canvas = document.createElement("canvas");
  const gl2 = canvas.getContext("webgl2");
  if (!gl2) return "low";

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (isCoarsePointer && (cores <= 4 || memory <= 4)) return "low";
  if (isCoarsePointer) return "medium";
  if (cores <= 4) return "medium";
  return "high";
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("medium");

  useEffect(() => {
    setTier(detectTier());
  }, []);

  return tier;
}
