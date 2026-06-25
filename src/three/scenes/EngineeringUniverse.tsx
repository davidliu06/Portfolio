"use client";

import { Sparkles } from "@react-three/drei";
import { useAchievementsStore } from "@/store/achievementsStore";
import { MechanicalPart, type PartKind } from "../components/MechanicalPart";
import { CameraRig } from "../components/CameraRig";

type PartConfig = {
  position: [number, number, number];
  kind: PartKind;
  scale: number;
  color: string;
  rotationSpeed: number;
  secret?: boolean;
};

const COBALT = "#2F5DFF";
const VIOLET = "#8B5CF6";
const CORAL = "#FF5D3A";
const GOLD = "#F5A623";

const PARTS: PartConfig[] = [
  { position: [-3.2, 1.4, -1], kind: "gear", scale: 1.1, color: COBALT, rotationSpeed: 0.18 },
  { position: [2.6, -1.1, 0.5], kind: "gear", scale: 0.75, color: CORAL, rotationSpeed: -0.24 },
  { position: [0.4, 2.1, -2], kind: "bearing", scale: 1, color: VIOLET, rotationSpeed: 0.3 },
  { position: [-1.8, -1.8, -0.5], kind: "bearing", scale: 0.65, color: COBALT, rotationSpeed: -0.22 },
  { position: [3.4, 1.6, -1.5], kind: "shaft", scale: 0.9, color: GOLD, rotationSpeed: 0.12 },
  { position: [-3.6, -0.4, 1], kind: "shaft", scale: 0.7, color: VIOLET, rotationSpeed: -0.16 },
  { position: [1.6, 0.2, 1.4], kind: "bracket", scale: 0.85, color: CORAL, rotationSpeed: 0.2 },
  { position: [-0.8, -2.4, 0.8], kind: "bracket", scale: 0.6, color: COBALT, rotationSpeed: -0.18 },
  { position: [2.2, 2.6, -0.8], kind: "gear", scale: 0.55, color: GOLD, rotationSpeed: 0.26, secret: true },
  { position: [-2.6, 2.4, 0.3], kind: "shaft", scale: 0.5, color: VIOLET, rotationSpeed: -0.14 }
];

export default function EngineeringUniverse() {
  const addProgress = useAchievementsStore((state) => state.addProgress);

  return (
    <>
      <CameraRig />
      <Sparkles count={80} scale={12} size={2} speed={0.25} color="#8B5CF6" opacity={0.45} />
      {PARTS.map((part, index) => (
        <MechanicalPart key={index} {...part} onSecretFound={part.secret ? () => addProgress("hidden-gear") : undefined} />
      ))}
    </>
  );
}
