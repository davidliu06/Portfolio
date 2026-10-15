import { PcbViewer } from "@/components/pcb-viewer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { electricalProjects } from "@/data/electrical";

export function ElectricalSection() {
  return (
    <section id="electrical" className="relative py-20 scroll-mt-20">
      <div className="section-shell">
        <SectionHeading eyebrow="Electrical" title="Circuits, copper, and connections" description="PCB design at the intersection of embedded systems, communication, and personal hardware." />
        <div className="divide-y divide-border">
          {electricalProjects.map(project => (
            <article key={project.id} className="grid items-start gap-8 py-10 md:grid-cols-2 lg:gap-14">
              <div className="md:sticky md:top-24 min-w-0"><PcbViewer model={project.model} image={project.image} name={project.name} /></div>
              <div>
                <p className="text-sm font-medium text-primary">{project.status}</p>
                <h3 className="mt-3 text-2xl font-bold">{project.name}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{project.description}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.details}</p>
                <div className="mt-5 flex flex-wrap gap-2">{project.technologies.map(technology => <Badge key={technology}>{technology}</Badge>)}</div>
                <h4 className="mt-8 text-lg font-semibold">Design decisions</h4>
                <div className="mt-3 divide-y divide-border">{project.choices.map(choice => <details key={choice.title} className="group py-4"><summary className="cursor-pointer font-medium text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{choice.title}</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{choice.body}</p></details>)}</div>
                <h4 className="mt-6 text-lg font-semibold">Skills applied &amp; lessons learned</h4>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.skills}</p>
                <h4 className="mt-6 text-lg font-semibold">Hands-on testing</h4>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.testing}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
