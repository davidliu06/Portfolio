import { AboutSection } from "@/components/about-section";
import { Chatbot } from "@/components/chatbot/chatbot";
import { ContactSection } from "@/components/contact-section";
import { HeroSection } from "@/components/hero/hero-section";
import { MissionBoardSection } from "@/components/mission-board-section";
import { ProjectsSection } from "@/components/projects/projects-section";
import { ResumeSection } from "@/components/resume-section";
import { SiteHeader } from "@/components/site-header";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/timeline/experience-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <MissionBoardSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <footer className="relative z-10 border-t py-8">
        <div className="section-shell flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>David Liu - Mechanical Engineering, Robotics, Aerospace, Autonomous Systems.</p>
          <p>Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and shadcn-style components.</p>
        </div>
      </footer>
      <Chatbot />
    </>
  );
}
