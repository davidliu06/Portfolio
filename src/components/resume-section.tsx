import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";

export function ResumeSection() {
  return (
    <section id="resume" className="py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Resume"
          title="Resume"
          description="Embedded resume preview with a download option for recruiters and hiring managers."
        />
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
            className="h-[720px] w-full bg-slate-950"
            src={`${profile.resumePath}#toolbar=1&navpanes=0`}
            title="David Liu resume PDF"
          />
        </div>
      </div>
    </section>
  );
}
