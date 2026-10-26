import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { ElectricalSection } from "@/components/electrical-section";
import { Chatbot } from "@/components/chatbot/chatbot";
import { profile } from "@/data/profile";
import { PcbScrollStory } from "@/components/pcb-scroll-story";
import "@/styles/pcb-story.css";

export const metadata: Metadata = {
  title: "What brought you here? | David Liu's Electrical Projects",
  description: "Explore David Liu's NFC business card and PocketRhythm Lite drum-machine prototype, with real 3D PCB models, design decisions, and validation details.",
  alternates: { canonical: "https://david-s-portfolio-eta.vercel.app/electrical" },
  openGraph: {
    title: "What brought you here? | David Liu",
    description: "A small card. A closer look at the engineering behind it.",
    url: "https://david-s-portfolio-eta.vercel.app/electrical"
  }
};

export default function ElectricalPage() {
  return <>
    <header className="relative z-10 border-b border-border">
      <nav aria-label="Electrical page navigation" className="section-shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={17} aria-hidden />David Liu</Link>
        <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-sm text-primary"><Mail size={16} aria-hidden />Get in touch</a>
      </nav>
    </header>
    <main className="relative z-10 bg-[#080c11]">
      <PcbScrollStory />
      <ElectricalSection standalone excludeCard />
      <div className="section-shell flex flex-wrap gap-6 pb-12 text-primary"><Link href="/">Explore my portfolio</Link><a href={profile.resumePath} download>Download resume</a></div>
    </main>
    <footer className="relative z-10 border-t border-border py-8"><div className="section-shell text-sm text-muted-foreground">David Liu / ElectroMechanical Engineer</div></footer>
    <Chatbot />
  </>;
}
