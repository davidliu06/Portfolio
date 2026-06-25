"use client";

import { useEffect } from "react";
import { Sparkles } from "@react-three/drei";
import { projects } from "@/data/projects";
import { useAchievementsStore } from "@/store/achievementsStore";
import { ProjectPlanet } from "../components/ProjectPlanet";
import { GalaxyCameraRig } from "../components/GalaxyCameraRig";

const POSITIONS: Record<string, [number, number, number]> = {
  "autonomous-underwater-vehicle": [-2.6, 0.8, 0],
  "aerodynamic-nose-cones": [2.4, -0.6, -0.5],
  "glidelounge-sofa-bed": [0, -1.8, 1]
};

type ProjectGalaxyProps = {
  activeSlug: string | null;
  onOpenProject: (slug: string, point: { x: number; y: number }) => void;
  onCloseProject: () => void;
};

export default function ProjectGalaxy({ activeSlug, onOpenProject, onCloseProject }: ProjectGalaxyProps) {
  const addProgress = useAchievementsStore((state) => state.addProgress);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && activeSlug) onCloseProject();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlug, onCloseProject]);

  const focusPosition = activeSlug ? POSITIONS[activeSlug] ?? null : null;

  return (
    <>
      <GalaxyCameraRig focusPosition={focusPosition} diving={!!activeSlug} />
      <Sparkles count={60} scale={10} size={1.6} speed={0.2} color="#8B5CF6" opacity={0.4} />

      <mesh position={[0, 0, -6]} onClick={() => activeSlug && onCloseProject()}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {projects.map((project) => (
        <ProjectPlanet
          key={project.slug}
          project={project}
          position={POSITIONS[project.slug] ?? [0, 0, 0]}
          isActive={activeSlug === project.slug}
          onOpen={(point) => {
            addProgress("planet-hopper", project.slug);
            onOpenProject(project.slug, point);
          }}
        />
      ))}
    </>
  );
}
