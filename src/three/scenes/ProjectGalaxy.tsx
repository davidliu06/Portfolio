"use client";

import { useEffect } from "react";
import { Sparkles } from "@react-three/drei";
import { projects } from "@/data/projects";
import { useAchievementsStore } from "@/store/achievementsStore";
import { getLenis } from "@/lib/scroll";
import { ProjectPlanet } from "../components/ProjectPlanet";
import { GalaxyCameraRig } from "../components/GalaxyCameraRig";

// ScrollTrigger.refresh() recalculates every trigger on the page — real cost,
// not something to pay on every mount. This component is lazy-mounted via
// LazyCanvas, so it can mount/unmount repeatedly while scrolling near the
// boundary; module-level state makes the one-time settle-the-layout refresh
// actually one-time, regardless of how many times the component remounts.
let hasRefreshedAfterMount = false;

const POSITIONS: Record<string, [number, number, number]> = {
  "autonomous-underwater-vehicle": [-2.6, 0.8, 0],
  "aerodynamic-nose-cones": [2.4, -0.6, -0.5],
  "glidelounge-sofa-bed": [0, -0.9, 1]
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

  // The canvas mounting here is the last thing on the page to reach its
  // final layout size (LazyCanvas swaps in a differently-sized fallback
  // beforehand) — recompute the scroll engine's cached page height once
  // against the settled layout, so wheel scroll never gets stuck against a
  // stale bound from before this section existed. Guarded to actually only
  // run once (see hasRefreshedAfterMount above), and skips the expensive
  // ScrollTrigger.refresh() — lenis.resize() alone is enough to fix a stale
  // scroll limit, and refresh()'s full-page trigger recalculation isn't worth
  // paying for here.
  useEffect(() => {
    if (hasRefreshedAfterMount) return;
    hasRefreshedAfterMount = true;
    const id = requestAnimationFrame(() => {
      getLenis()?.resize();
    });
    return () => cancelAnimationFrame(id);
  }, []);

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
