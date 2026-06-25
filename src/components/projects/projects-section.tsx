"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Calendar, FileText, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/data/projects";
import { Scene } from "@/three/Scene";
import { LazyCanvas } from "@/three/LazyCanvas";
import { ProjectDetailView } from "./project-detail-view";

const ProjectGalaxy = dynamic(() => import("@/three/scenes/ProjectGalaxy"), { ssr: false });

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
  const [detailSlug, setDetailSlug] = useState<string | null>(null);
  const [originPoint, setOriginPoint] = useState({ x: 0, y: 0 });

  const activeProject = projects.find((project) => project.slug === detailSlug) ?? null;

  function handleCloseProject() {
    setDetailSlug(null);
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
              <ProjectGalaxy
                activeSlug={detailSlug}
                onCloseProject={handleCloseProject}
                onOpenProject={(slug, point) => {
                  setOriginPoint(point);
                  setDetailSlug(slug);
                }}
              />
            </Scene>
          </LazyCanvas>
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
            Click a planet to explore · Esc to close
          </p>
        </div>
      </div>

      <AnimatePresence>
        {activeProject && <ProjectDetailView onClose={handleCloseProject} originPoint={originPoint} project={activeProject} />}
      </AnimatePresence>
    </section>
  );
}
