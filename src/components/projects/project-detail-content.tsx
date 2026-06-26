"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Calendar, CheckCircle2, FileText, Github, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/portfolio";
import { CountUpStat } from "./count-up-stat";
import { RevealGroup, RevealItem, RevealSection } from "@/components/ui/reveal";

/** Vivid — for backgrounds, borders, decorative 3D/icon fills where WCAG text-contrast rules don't apply. */
const ACCENT_VIVID: Record<Project["accent"], string> = {
  blue: "#2F5DFF",
  teal: "#8B5CF6",
  gold: "#F5A623",
  orange: "#FF5D3A"
};

/** Darkened per-hue — for anything that's actually text or a meaningful icon, so every accent clears 4.5:1 on the porcelain background (the vivid gold/orange originals sit at ~1.9–2.8:1 and fail outright). */
const ACCENT_TEXT: Record<Project["accent"], string> = {
  blue: "#1D4ED8",
  teal: "#6D28D9",
  gold: "#92400E",
  orange: "#9A3412"
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The project's own page content — this is a real route (src/app/projects/[slug]/page.tsx),
 * not an overlay stacked on top of the home page. That means: no second
 * scroll container to fight Lenis over, no z-index layering against the
 * galaxy, and the galaxy/home page genuinely unmount while this is on screen
 * (Next.js swaps the route's page content; nothing from "/" stays mounted).
 * "Back to galaxy" is a real navigation, not a state toggle.
 */
export function ProjectDetailContent({ project }: { project: Project }) {
  const router = useRouter();
  const vivid = ACCENT_VIVID[project.accent];
  const textAccent = ACCENT_TEXT[project.accent];

  function goBack() {
    // scroll: false — otherwise Next.js's own post-navigation "scroll to
    // top" behavior fights the galaxy's own scroll-position restore on "/".
    router.push("/", { scroll: false });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") goBack();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-background"
      initial={{ opacity: 0 }}
      style={{ backgroundImage: `radial-gradient(ellipse 60rem 50rem at 20% -10%, ${vivid}1a, transparent 60%)` }}
      transition={{ duration: 0.4 }}
    >
      {/* Always-visible primary nav — outside the scrolling flow on purpose, never scrolls away, never gets buried under content. */}
      <div
        className="fixed inset-x-0 top-0 z-[110] flex justify-start"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))", paddingLeft: "max(1.25rem, env(safe-area-inset-left))" }}
      >
        <motion.button
          autoFocus
          className="legibility-scrim inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground shadow-glow"
          onClick={goBack}
          whileHover={{ x: -4, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          <ArrowLeft size={16} />
          Back to galaxy
        </motion.button>
      </div>

      <div className="section-shell py-10">
        {/* Scene 1 — title + hero image */}
        <RevealSection delay={0.1} duration={0.5} preset="cinematic">
          <p className="mt-16 text-sm font-bold uppercase tracking-wide sm:mt-12" style={{ color: textAccent }}>
            {project.summary}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{project.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar size={16} />
              {project.dates}
            </span>
            <Badge className="border-primary/25 bg-primary/10 text-primary">{project.category}</Badge>
          </div>

          {project.image && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[1.75rem] border" style={{ borderColor: `${vivid}33` }}>
              <motion.div
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
                transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              >
                <Image src={project.image} alt={`${project.name} primary image`} fill sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" priority />
              </motion.div>
            </div>
          )}
        </RevealSection>

        {/* Scene 2 — description, its own paced moment */}
        <RevealSection className="mx-auto max-w-3xl py-20 text-center" preset="fade-up">
          <p className="text-balance text-2xl font-medium leading-snug text-foreground sm:text-3xl">{project.description}</p>
        </RevealSection>

        {/* Scene 3 — the one real number worth a count-up */}
        {project.heroStat && (
          <RevealSection className="flex justify-center py-16" preset="fade-scale">
            <CountUpStat color={textAccent} label={project.heroStat.label} suffix={project.heroStat.suffix} value={project.heroStat.value} />
          </RevealSection>
        )}

        {/* Scene 4 — achievements, staggered */}
        <div className="py-16">
          <RevealSection preset="fade-up">
            <h2 className="text-center text-2xl font-bold">Results &amp; achievements</h2>
          </RevealSection>
          <RevealGroup className="mx-auto mt-8 max-w-2xl space-y-4">
            {project.achievements.map((achievement) => (
              <RevealItem className="night-card flex gap-3 rounded-2xl border p-4 text-sm leading-6 text-foreground" key={achievement} preset="slide-left">
                <CheckCircle2 className="mt-0.5 flex-none" size={18} style={{ color: textAccent }} />
                {achievement}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Scene 5 — technologies + role, two columns */}
        <div className="grid gap-10 py-16 md:grid-cols-2">
          <RevealSection preset="slide-right">
            <h2 className="text-lg font-bold">Technologies</h2>
            <RevealGroup className="mt-4 flex flex-wrap gap-2" stagger={0.05}>
              {project.technologies.map((tech) => (
                <RevealItem key={tech} preset="fade-scale">
                  <Badge className="border-primary/25 bg-primary/10 text-primary">{tech}</Badge>
                </RevealItem>
              ))}
            </RevealGroup>
          </RevealSection>
          <RevealSection delay={0.1} preset="slide-left">
            <h2 className="text-lg font-bold">My role</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{project.role}</p>
          </RevealSection>
        </div>

        {/* Scene 6 — gallery, masked reveals */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="py-16">
            <RevealSection preset="fade-up">
              <h2 className="text-center text-2xl font-bold">More from this project</h2>
            </RevealSection>
            <RevealGroup className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" stagger={0.12}>
              {project.gallery.map((src) => (
                <RevealItem className="relative aspect-square overflow-hidden rounded-xl bg-muted" key={src} preset="mask-wipe">
                  <Image src={src} alt={`${project.name} supporting figure`} fill sizes="220px" className="object-cover" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}

        {/* Scene 7 — links + closing */}
        <RevealSection className="border-t py-16" preset="fade-up">
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <span className="night-card inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
                  <Github size={16} />
                  GitHub
                </span>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                <span className="night-card inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
                  <Globe size={16} />
                  Live Demo
                </span>
              </a>
            )}
            {project.links.map((link) => (
              <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{ backgroundColor: vivid }}
                >
                  <FileText size={16} />
                  {link.label}
                </span>
              </a>
            ))}
          </div>

          <button
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            onClick={goBack}
          >
            <ArrowLeft size={16} />
            Back to galaxy
          </button>
        </RevealSection>
      </div>
    </motion.div>
  );
}
