"use client";

import { Bot, CircuitBoard, Code2, Cog, DraftingCompass, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem, RevealSection } from "@/components/ui/reveal";
import { skills } from "@/data/skills";

const icons = { Cog, DraftingCompass, Bot, Code2, CircuitBoard, Rocket };

export function SkillsSection() {
  return (
    <section id="skills" className="py-20">
      <div className="section-shell">
        <RevealSection preset="fade-scale">
          <SectionHeading
            eyebrow="02 — Building"
            title="Technical skills"
            description="Tools and methods I use across design, analysis, and fabrication."
          />
        </RevealSection>
        <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {skills.map((group) => {
            const Icon = icons[group.icon as keyof typeof icons];
            return (
              <RevealItem key={group.category} preset="cinematic">
                <div className="night-card h-full rounded-[1.5rem] border p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={22} />
                    </span>
                    <h3 className="font-bold">{group.category}</h3>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
