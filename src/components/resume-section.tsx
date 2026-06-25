"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";
import { Scene } from "@/three/Scene";
import { usePrefersReducedMotion } from "@/three/hooks/usePrefersReducedMotion";

const FutureVision = dynamic(() => import("@/three/scenes/FutureVision"), { ssr: false });

export function ResumeSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="resume" className="relative overflow-hidden py-20">
      <div className="absolute inset-0 -z-10">
        <Scene cameraPosition={[0, 0, 9]}>
          <FutureVision />
        </Scene>
      </div>
      <div className="section-shell">
        {!reducedMotion && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto mb-2 h-28 w-28"
            src="/videos/ignition-mark.mp4"
          />
        )}
        <SectionHeading
          eyebrow="07 — Future Vision"
          title="What's next"
          description={profile.takeaway}
          scrim
        />
        <div className="night-card mb-8 rounded-[1.5rem] border p-6 md:p-8">
          <p className="text-sm font-semibold text-muted-foreground">Currently targeting</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.targets.map((target) => (
              <Badge className="border-primary/25 bg-primary/10 text-primary" key={target}>
                {target}
              </Badge>
            ))}
          </div>
        </div>
        <div className="night-card overflow-hidden rounded-[1.5rem] border">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
            <div>
              <h3 className="font-bold">David Liu Resume</h3>
              <p className="text-sm text-muted-foreground">Mechanical engineering, robotics, aerospace, autonomous systems.</p>
            </div>
            <a href={profile.resumePath} download>
              <Button>
                <Download size={18} />
                Download PDF
              </Button>
            </a>
          </div>
          <iframe
            className="h-[720px] w-full bg-muted"
            src={`${profile.resumePath}#toolbar=1&navpanes=0`}
            title="David Liu resume PDF"
          />
        </div>
      </div>
    </section>
  );
}
