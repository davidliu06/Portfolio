import { BadgeCheck, Cpu, Plane, Shield, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";

const focusAreas = [
  {
    title: "Aerospace Systems",
    icon: Plane,
    copy: "CFD, wind tunnel validation, vehicle design, and fluid mechanics analysis."
  },
  {
    title: "Defense and Reliability",
    icon: Shield,
    copy: "Mission-focused hardware, mechanical reliability, testing, and practical manufacturing constraints."
  },
  {
    title: "Autonomous Robotics",
    icon: Waves,
    copy: "AUVs, sensors, controls, environmental monitoring, and field-tested mechatronic systems."
  },
  {
    title: "Electro-Mechanical Design",
    icon: Cpu,
    copy: "SolidWorks assemblies, machine guards, sheet metal, access-control systems, and validation."
  }
];

export function MissionBoardSection() {
  return (
    <section id="mission" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Mission Board"
          title="Internship focus areas"
          description="A quick recruiter-friendly view of the roles and engineering environments David is targeting."
        />
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="night-card rounded-[2rem] border p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck size={24} />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Current objective</p>
                <h3 className="text-2xl font-bold text-foreground">Mechanical / Robotics / Aerospace Internships</h3>
              </div>
            </div>
            <p className="mt-5 leading-7 text-muted-foreground">{profile.takeaway}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.roles.slice(0, 6).map((role) => (
                <Badge className="border-primary/25 bg-primary/10 text-primary" key={role}>
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article className="night-card rounded-[1.5rem] border p-5 transition hover:-translate-y-1 hover:border-cyan-300/40" key={area.title}>
                  <Icon className="text-secondary" size={26} />
                  <h3 className="mt-4 font-bold text-foreground">{area.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{area.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
