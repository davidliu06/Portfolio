"use client";

import { Bot, CircuitBoard, Code2, Cog, DraftingCompass, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { skills } from "@/data/skills";

const icons = { Cog, DraftingCompass, Bot, Code2, CircuitBoard, Rocket };

export function SkillsSection() {
  return (
    <section id="skills" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="02 — Building"
          title="The stack behind the hardware"
          description="What it actually takes to get from a CAD model to a working, tested system: design, simulation, robotics, manufacturing, electronics, and analysis."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => {
            const Icon = icons[group.icon as keyof typeof icons];
            return (
              <motion.div
                className="night-card rounded-[1.5rem] border p-5"
                key={group.category}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={22} />
                  </span>
                  <h3 className="font-bold">{group.category}</h3>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${group.strength}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
