import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/data/experience";

const SYSTEMS_TAKEAWAYS: Record<string, string> = {
  "Propulsion Lead":
    "Directed systems integration and launch-readiness reviews across 5 subteams on Apollyon I — coordinating 40+ members to 1st Place at FAR Unlimited 2026.",
  "Engineering Team Member":
    "Supported powertrain, braking, steering, and structural integration on one hybrid vehicle platform, where every subsystem decision affects every other one."
};

export function SystemsThinkingSection() {
  const systemsEntries = experience.filter((item) => item.alsoFeaturedIn?.includes("systems"));

  return (
    <section id="systems" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="06 — Systems Thinking"
          title="Systems thinking, not just parts."
          description="Individual components are easy. The hard part is making 40 people, 5 subteams, and a dozen subsystems converge on a single launch date."
        />
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="night-card rounded-[2rem] border p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <GitBranch size={24} />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">The unglamorous part</p>
                <h3 className="text-2xl font-bold text-foreground">Reviews, trade studies, and interfaces</h3>
              </div>
            </div>
            <p className="mt-5 leading-7 text-muted-foreground">
              On Apollyon I, my job wasn&apos;t just propulsion — it was making sure propulsion,
              structures, avionics, recovery, and simulation all agreed with each other before a single
              switch got flipped. That&apos;s the part of engineering most people don&apos;t see: the
              design reviews, the trade studies, the moment you catch a conflict between two subteams
              before it becomes a launch-pad problem.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Systems Integration", "Launch-Readiness Reviews", "Cross-Team Coordination", "Trade Studies"].map((item) => (
                <Badge className="border-primary/25 bg-primary/10 text-primary" key={item}>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {systemsEntries.map((item) => (
              <article className="night-card rounded-[1.5rem] border p-5 transition hover:-translate-y-1 hover:border-primary/40" key={item.role}>
                <h3 className="font-bold text-foreground">{item.role}</h3>
                <p className="text-sm font-semibold text-primary">{item.organization}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{SYSTEMS_TAKEAWAYS[item.role]}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
