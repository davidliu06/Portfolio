import { AboutSection } from "@/components/about-section";
import { ElectricalSection } from "@/components/electrical-section";
import { ContactSection } from "@/components/contact-section";
import { HeroSection } from "@/components/hero/hero-section";
import { ProjectsSection } from "@/components/projects/projects-section";
import { ResearchSection } from "@/components/research-section";
import { ResumeSection } from "@/components/resume-section";
import { SiteHeader } from "@/components/site-header";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/timeline/experience-section";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ResearchSection />
        <ExperienceSection />
        <ProjectsSection />
        <ElectricalSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <footer className="relative z-10 border-t py-8">
        <div className="section-shell flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>David Liu - ElectroMechanical Engineer, Robotics, Aerospace, Autonomous Systems.</p>
          <a href="mailto:davidliu@g.hmc.edu">davidliu@g.hmc.edu</a>
        </div>
      </footer>
    </>
  );
}
