"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/data/experience";

const AssemblyShowcase = dynamic(() => import("@/three/assembly/AssemblyShowcase").then((mod) => mod.AssemblyShowcase), {
  ssr: false
});

/** Keyed by organization — drops a real, interactive CAD viewer directly above the timeline entry it belongs to. */
const EMBED_BEFORE: Record<string, { url: string; namePrefix: string; accentColor: string; title: string; caption: string }> = {
  "Mudd Amateur Rocketry Club": {
    url: "/models/rocket.glb",
    namePrefix: "APLYN1_",
    accentColor: "#FF5D3A",
    title: "Apollyon I",
    caption:
      "The actual FAR Unlimited competition rocket, rendered from the real CAD assembly — hover a part to see what it is, click to isolate it, or explode the view to see how the airframe, avionics, and recovery sections stack together."
  },
  "MuddSub / Harvey Mudd RoboSub Team": {
    url: "/models/crush-system.glb",
    namePrefix: "MdSb26_Crush_",
    accentColor: "#2F5DFF",
    title: "Crush Drive System",
    caption:
      "The drive-system assembly from MuddSub's autonomous underwater vehicle — thrusters, frame, and electronics enclosure modeled in SolidWorks. Explore it the same way: hover, click to isolate, or explode the subassemblies apart."
  }
};

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="04 — Engineering"
          title="From internship to competition rocket"
          description="The full record — internships, research, and the engineering teams where most of this was actually learned."
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-border sm:block" />
          <div className="space-y-5">
            {experience.map((item) => {
              const embed = EMBED_BEFORE[item.organization];
              return (
                <div key={`${item.organization}-${item.role}`}>
                  {embed && (
                    <div className="mb-5 sm:ml-14">
                      <AssemblyShowcase
                        accentColor={embed.accentColor}
                        caption={embed.caption}
                        namePrefix={embed.namePrefix}
                        title={embed.title}
                        url={embed.url}
                      />
                    </div>
                  )}
                  <article className="night-card relative rounded-[1.5rem] border p-6 sm:ml-14">
                    <span className="absolute -left-[3.25rem] top-6 hidden h-10 w-10 rounded-lg border bg-background sm:grid sm:place-items-center">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                    </span>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="max-w-2xl">
                        <Badge className="mb-3">{item.type}</Badge>
                        <h3 className="text-xl font-bold">{item.role}</h3>
                        <p className="font-semibold text-primary">{item.organization}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Calendar size={15} />
                          {item.dates}
                        </p>
                        <p className="mt-1 flex items-center gap-2">
                          <MapPin size={15} />
                          {item.location}
                        </p>
                      </div>
                    </div>
                    {item.image && (
                      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-muted/50">
                        <Image
                          alt={item.imageAlt ?? `${item.organization} image`}
                          className={
                            item.image.includes("invite") || item.image.includes("chemtalk") || item.image.includes("dofpro")
                              ? "max-h-56 w-full bg-white object-contain p-8"
                              : "max-h-80 w-full object-cover"
                          }
                          height={650}
                          src={item.image}
                          width={1200}
                        />
                      </div>
                    )}
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                      {item.bullets.map((bullet) => (
                        <li className="flex gap-3" key={bullet}>
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <Badge key={tool}>{tool}</Badge>
                      ))}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
