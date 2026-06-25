import { GraduationCap, MapPin, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="01 — Curiosity"
          title="I ask how it works, then go build one."
          description="Robotics, autonomous systems, manufacturing, and the AI tooling increasingly woven through all of it."
        />
        <div className="night-card rounded-[1.75rem] border p-6 md:p-8">
          <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
            Everything I build starts with the same question: how does this actually work, and how would I
            make it better? That question has taken me underwater with autonomous robots, into wind
            tunnels chasing aerodynamic drag, and through a research summer building LLM-based tools to
            analyze how students learn. I&apos;m a mechanical engineering student at Harvey Mudd College —
            though most of what I know, I learned by building something that didn&apos;t work yet, and
            fixing it until it did.
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
            I move across the entire hardware loop: SolidWorks design, FEA/CFD simulation, machining and
            fabrication, circuit design and embedded systems, and the Python/MATLAB tooling that ties it
            together. I&apos;m looking for teams building real, physical, mission-critical systems —
            robotics, aerospace, defense, autonomous systems — where engineering rigor and fast iteration
            both matter.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-primary/15 bg-background/60 p-4">
              <GraduationCap className="text-primary" size={22} />
              <p className="mt-3 font-semibold text-foreground">{profile.degree}</p>
              <p className="text-sm text-muted-foreground">{profile.school}, {profile.graduation}</p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-background/60 p-4">
              <Target className="text-secondary" size={22} />
              <p className="mt-3 font-semibold text-foreground">Current focus</p>
              <p className="text-sm text-muted-foreground">Robotics, aerospace, simulation, embedded systems, and AI-enabled engineering.</p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-background/60 p-4">
              <MapPin className="text-accent" size={22} />
              <p className="mt-3 font-semibold text-foreground">Based in</p>
              <p className="text-sm text-muted-foreground">Claremont, CA / Bay Area</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Python", "MATLAB", "CAD", "CFD", "Embedded Systems", "Manufacturing", "AI Tools"].map((item) => (
              <Badge className="border-primary/25 bg-primary/10 text-primary" key={item}>
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
