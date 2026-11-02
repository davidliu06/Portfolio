import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return <section id="projects" className="py-16">
    <div className="section-shell">
      <div className="mb-8 flex items-baseline justify-between gap-4"><h2 className="text-3xl font-semibold">Selected projects</h2><span className="text-sm text-muted-foreground">{projects.length} projects</span></div>
      <div className="divide-y divide-border">
        {projects.map(project => <article key={project.slug} className="project-overview grid gap-6 py-8 sm:grid-cols-[220px_1fr] lg:grid-cols-[320px_1fr] lg:gap-12">
          <Link href={`/projects/${project.slug}`} aria-label={`View ${project.shortTitle}`} className="relative block aspect-[16/10] overflow-hidden bg-muted">
            {project.image ? <Image src={project.image} alt={project.shortTitle} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 220px, 100vw" className="object-contain" /> : <div className="grid h-full place-items-center text-muted-foreground"><FileText size={32} aria-hidden /></div>}
          </Link>
          <div className="min-w-0 self-center">
            <p className="text-xs text-muted-foreground">{project.dates}</p>
            <h3 className="mt-2 text-2xl font-semibold"><Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-3 hover:text-primary">{project.shortTitle}<ArrowUpRight className="shrink-0" size={20} aria-hidden /></Link></h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.summary}</p>
            <p className="mt-4 text-xs text-primary">{project.technologies.slice(0, 4).join(" / ")}</p>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
