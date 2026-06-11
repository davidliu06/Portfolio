"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, FileText, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/data/projects";

const groups = ["Engineering Focused", "Other"] as const;

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title="Project timeline"
          description="Engineering projects are separated from other research and educational work, with images and reports added where available."
        />

        <div className="space-y-14">
          {groups.map((group) => {
            const groupProjects = projects.filter((project) => project.category === group);
            return (
              <div key={group}>
                <div className="mb-6 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-foreground">{group}</h3>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="relative space-y-8 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-violet-200/20 md:before:left-1/2">
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
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
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
      </div>
    </section>
  );
}
