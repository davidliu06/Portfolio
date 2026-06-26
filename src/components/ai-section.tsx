"use client";

import dynamic from "next/dynamic";
import { Bot, MessageCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealSection } from "@/components/ui/reveal";
import { experience } from "@/data/experience";
import { Scene } from "@/three/Scene";
import { LazyCanvas } from "@/three/LazyCanvas";

const NeuralNetwork = dynamic(() => import("@/three/scenes/NeuralNetwork"), { ssr: false });

export function AiSection() {
  const invite = experience.find((item) => item.organization === "INVITE Institute, UIUC");

  return (
    <section id="ai" className="relative overflow-hidden py-20">
      <LazyCanvas className="absolute inset-0 -z-10">
        <Scene cameraPosition={[0, 0, 8]}>
          <NeuralNetwork />
        </Scene>
      </LazyCanvas>
      <div className="section-shell">
        <RevealSection preset="depth-drift">
          <SectionHeading
            eyebrow="05 — AI"
            title="The assistant answering your questions? I built that."
            description="AI isn't a side interest here — it's a tool I've used in real research, and it's running live on this page."
            scrim
          />
        </RevealSection>
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <RevealSection preset="slide-right">
            <article className="night-card h-full rounded-[1.75rem] border p-6 transition hover:-translate-y-1 md:p-8">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={22} />
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">{invite?.role}</h3>
              <p className="font-semibold text-primary">{invite?.organization} · {invite?.dates}</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {invite?.bullets.map((bullet) => (
                  <li className="flex gap-3" key={bullet}>
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {invite?.tools.map((tool) => (
                  <Badge key={tool}>{tool}</Badge>
                ))}
              </div>
            </article>
          </RevealSection>

          <RevealSection delay={0.1} glow="violet" preset="slide-left">
            <article className="night-card flex h-full flex-col rounded-[1.75rem] border p-6 transition hover:-translate-y-1 md:p-8">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                <Bot size={22} />
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">Meet Ask David</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                A retrieval-grounded assistant built on this portfolio&apos;s own project, experience, and
                skills data, with an OpenAI-backed layer for natural answers and a deterministic fallback so
                it never goes offline. Ask it about the AUV, the rocketry team, or why David fits a
                robotics internship.
              </p>
              <Button
                className="mt-6 w-fit"
                onClick={() => window.dispatchEvent(new Event("open-ask-david"))}
              >
                <MessageCircle size={18} />
                Ask David something
              </Button>
            </article>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
