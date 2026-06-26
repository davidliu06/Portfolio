"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, FileText, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const groups = ["Engineering Focused", "Other"] as const;

function StaticProjectsFallback() {
  return (
    <div className="space-y-14">
      {groups.map((group) => {
        const groupProjects = projects.filter((project) => project.category === group);
        return (
          <div key={group}>
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-2xl font-bold text-foreground">{group}</h3>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="relative space-y-8 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-violet/30 md:before:left-1/2">
              {groupProjects.map((project, index) => (
                <motion.article
                  className="relative grid gap-5 md:grid-cols-2 md:gap-10"
                  key={project.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                >
                  <span className="absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-glow md:left-1/2" />

                  <div className={index % 2 === 0 ? "md:pr-10" : "md:col-start-2 md:pl-10"}>
                    <div className="night-card overflow-hidden rounded-[1.5rem] border">
                      {project.image ? (
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={project.image}
                            alt={`${project.name} project image`}
                            fill
                            sizes="(min-width: 768px) 45vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="grid aspect-[16/10] place-items-center bg-muted text-center">
                          <div>
                            <ImageOff className="mx-auto text-primary" size={34} />
                            <p className="mt-3 font-mono text-sm text-primary">ADD LATER</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={index % 2 === 0 ? "md:col-start-2 md:pl-10" : "md:row-start-1 md:pr-10"}>
                    <div className="night-card rounded-[1.5rem] border p-5">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        {project.dates}
                        {project.featured && <Badge className="border-secondary/25 bg-secondary/10 text-secondary">Featured</Badge>}
                      </div>
                      <h4 className="mt-3 text-2xl font-bold text-foreground">{project.name}</h4>
                      <p className="mt-3 leading-7 text-muted-foreground">{project.description}</p>
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">{project.challenge}</p>
                      <p className="mt-4 text-sm font-semibold text-primary">{project.role}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge className="border-primary/25 bg-primary/10 text-primary" key={tech}>
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.links.map((link) => (
                          <a href={link.href} key={link.label} target={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "_blank" : undefined}>
                            <Button size="sm" variant={link.label === "ADD LATER" ? "outline" : "default"}>
                              <FileText size={16} />
                              {link.label}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProjectsSection() {
  const router = useRouter();
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
          description="Three projects, as a galaxy you can explore — click a planet to dive in, design, simulation, fabrication, and field-tested results."
        />

        <div className="relative h-[640px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#0B1120] to-[#060912] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55)]">
          <LazyCanvas className="absolute inset-0" fallback={<StaticProjectsFallback />}>
            <Scene cameraPosition={[0, 0, 8.5]} fallback={<StaticProjectsFallback />}>
              <ProjectGalaxy activeSlug={divingSlug} onCloseProject={handleCancelDive} onOpenProject={handleOpenProject} />
            </Scene>
          </LazyCanvas>
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
            Click a planet to explore · Esc to close
          </p>
        </div>
      </div>
    </section>
  );
}
