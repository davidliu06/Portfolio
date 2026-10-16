"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, List, Orbit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/data/projects";
import { Scene } from "@/three/Scene";
import { LazyCanvas } from "@/three/LazyCanvas";
import { getLenis } from "@/lib/scroll";

const ProjectGalaxy = dynamic(() => import("@/three/scenes/ProjectGalaxy"), { ssr: false });

const SCROLL_STORAGE_KEY = "galaxy-scroll-y";
// How long the camera gets to dive toward the clicked planet before the
// route actually changes — long enough to read as "diving in," short enough
// to still feel responsive.
const DIVE_DELAY_MS = 550;


export function ProjectsSection() {
  const router = useRouter();
  const [showGalaxy, setShowGalaxy] = useState(false);
  // Purely the pre-navigation "diving in" visual — the moment the route
  // actually changes, this component (and the whole galaxy) unmounts with
  // it, so this never needs a "show the project" branch of its own.
  const [divingSlug, setDivingSlug] = useState<string | null>(null);
  const navigateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore the scroll position the user was at right before they dove into
  // a project, the moment they're back on "/" — instant, not animated, so it
  // reads as "returning to where you were," not a fresh scroll. A short
  // timeout (rather than just one rAF) gives the page a moment to settle
  // into its real layout height first; resize() refreshes Lenis's cached
  // dimensions against that settled height before the jump, and force:true
  // means the jump still happens even if Lenis briefly reports itself
  // stopped/locked during the just-mounted moment.
  //
  // Deliberately does NOT remove the sessionStorage key until the timeout
  // actually fires. React's Strict Mode double-invokes effects in
  // development (mount -> cleanup -> mount again) — clearing the key on the
  // first invocation meant the second invocation always found nothing to
  // restore, since the first invocation's own timeout had already been
  // cancelled by its cleanup. Leaving the key in place until the surviving
  // invocation's timeout fires makes this safe under double-invocation.
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!saved) return;
    const y = Number(saved);
    const id = setTimeout(() => {
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
      const lenis = getLenis();
      lenis?.resize();
      if (lenis) lenis.scrollTo(y, { force: true, immediate: true });
      else window.scrollTo(0, y);
    }, 80);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => () => {
    if (navigateTimeout.current) clearTimeout(navigateTimeout.current);
  }, []);

  function handleOpenProject(slug: string) {
    setDivingSlug(slug);
    sessionStorage.setItem(SCROLL_STORAGE_KEY, String(window.scrollY));
    navigateTimeout.current = setTimeout(() => {
      router.push(`/projects/${slug}`);
    }, DIVE_DELAY_MS);
  }

  function handleCancelDive() {
    if (navigateTimeout.current) {
      clearTimeout(navigateTimeout.current);
      navigateTimeout.current = null;
    }
    setDivingSlug(null);
  }

  return (
    <section id="projects" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="04 — Engineering"
          title="Hardware that shipped"
          description="From underwater sensing to flight hardware: the design decisions, prototypes, and results behind my work."
        />
        <div className="mb-6 flex items-center justify-between gap-4 border-b pb-4">
          <p className="text-sm text-muted-foreground">{projects.length} projects</p>
          <div className="flex gap-1 rounded-lg border p-1" role="group" aria-label="Project view">
            <button type="button" aria-pressed={!showGalaxy} onClick={() => setShowGalaxy(false)} className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm ${!showGalaxy ? "bg-muted text-foreground" : "text-muted-foreground"}`}><List size={17} aria-hidden />Overview</button>
            <button type="button" aria-pressed={showGalaxy} onClick={() => setShowGalaxy(true)} className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm ${showGalaxy ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Orbit size={17} aria-hidden />Galaxy</button>
          </div>
        </div>
        {showGalaxy && <div className="relative mb-8 h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[#0B1120] sm:h-[540px] lg:h-[640px]">
          <LazyCanvas className="absolute inset-0" fallback={<p className="p-6 text-muted-foreground" role="status">Loading galaxy...</p>}>
            <Scene cameraPosition={[0, 0, 8.5]} fallback={<p className="p-6 text-muted-foreground" role="status">3D view unavailable.</p>}>
              <ProjectGalaxy activeSlug={divingSlug} onCloseProject={handleCancelDive} onOpenProject={handleOpenProject} />
            </Scene>
          </LazyCanvas>
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-card/90 px-3 py-1 text-xs text-slate-300">
            Click a planet to explore · Esc to close
          </p>
        </div>}
        <div className="divide-y divide-border">
          {projects.map(project => <article key={project.slug} className="project-overview grid gap-5 py-7 sm:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr] lg:gap-8">
            <Link href={`/projects/${project.slug}`} aria-label={`View ${project.shortTitle}`} className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-muted">
              {project.image ? <Image src={project.image} alt={project.shortTitle} fill sizes="(min-width: 1024px) 240px, (min-width: 640px) 180px, 100vw" className="object-contain" /> : <div className="grid h-full place-items-center text-muted-foreground"><FileText size={32} aria-hidden /></div>}
            </Link>
            <div className="min-w-0 self-center">
              <p className="text-xs text-muted-foreground">{project.dates}</p>
              <h3 className="mt-2 text-2xl font-semibold"><Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-3 hover:text-primary">{project.shortTitle}<ArrowUpRight className="shrink-0" size={20} aria-hidden /></Link></h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">{project.technologies.slice(0, 4).map(tech => <Badge key={tech}>{tech}</Badge>)}</div>
            </div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
