import { FlaskConical } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/data/experience";

const RESEARCH_TAKEAWAYS: Record<string, string> = {
  "Undergraduate Researcher - INVITE Institute REU":
    "Built LLM-based tools to analyze how students learn — designing synthetic datasets and Python pipelines to evaluate model accuracy at scale.",
  "Lab TA, Tutor, and Grader":
    "Tutored and graded for General Chemistry — turning lab troubleshooting and code debugging into clear, actionable feedback.",
  "Undergraduate Researcher - Degrees of Freedom Project (DOFPro)":
    "Produced research-backed lecture material on chemical and thermal processes, published for other students to learn from.",
  Writer: "Wrote and published chemistry education articles, translating technical material for a general audience."
};

function takeawayFor(role: string) {
  return RESEARCH_TAKEAWAYS[role] ?? "";
}

export function ResearchSection() {
  const researchEntries = experience.filter((item) => item.chapter === "research");

  return (
    <section id="research" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="03 — Research"
          title="Research is curiosity with a method."
          description="The same instinct that sends me into a workshop sends me into a dataset — test the idea, gather the evidence, explain what's actually true."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {researchEntries.map((item) => (
            <article className="night-card rounded-[1.5rem] border p-5" key={`${item.organization}-${item.role}`}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <FlaskConical size={20} />
              </span>
              <h3 className="mt-4 font-bold text-foreground">{item.role}</h3>
              <p className="text-sm font-semibold text-primary">{item.organization}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{takeawayFor(item.role)}</p>
              <p className="mt-3 text-xs text-muted-foreground">{item.dates}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
