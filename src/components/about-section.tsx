import { GraduationCap, MapPin, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="About"
          title="Mechanical engineering student at Harvey Mudd College."
          description="Robotics, manufacturing systems, computational engineering, and AI-enabled hardware."
        />
        <div className="night-card rounded-[1.75rem] border p-6 md:p-8">
          <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
            I am an engineering student at Harvey Mudd College with interests in robotics, manufacturing
            systems, computational engineering, and artificial intelligence. My experience includes
            developing AI-based data analysis tools, conducting engineering research, designing embedded
            sensing systems for autonomous underwater robots, and performing computational and
            experimental fluid dynamics studies.
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
            I have worked across research, manufacturing, and educational environments, applying Python,
            MATLAB, CAD, data analysis, and engineering design principles to solve technical challenges. I
            am seeking opportunities involving advanced robotics, aerospace systems, simulation, embedded
            systems, and AI-enabled engineering.
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
