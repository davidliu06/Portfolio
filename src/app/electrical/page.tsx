import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, Mail } from "lucide-react";
import { ElectricalSection } from "@/components/electrical-section";
import { Chatbot } from "@/components/chatbot/chatbot";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "What brought you here? | David Liu's Electrical Projects",
  description: "Meet the engineering behind David Liu's NFC business card and ESP32 CAN Bus shield. Explore real 3D PCB models, design decisions, and hands-on work.",
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
    <main className="relative z-10">
      <section className="section-shell pb-4 pt-10 sm:pt-14">
        <p className="text-sm font-semibold text-primary">A tap. A connection. A little engineering.</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">What brought you here?</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Maybe it was a tap on my NFC card. I&apos;m David, an Engineering student at Harvey Mudd College. This is the circuitry behind that first hello, and a look at what else I build.</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          <Link href="/" className="inline-flex items-center gap-2 text-primary">Explore my portfolio<ArrowUpRight size={16} aria-hidden /></Link>
          <a href={profile.resumePath} download className="inline-flex items-center gap-2 text-foreground"><Download size={16} aria-hidden />Resume</a>
        </div>
      </section>
      <ElectricalSection standalone />
    </main>
    <footer className="relative z-10 border-t border-border py-8"><div className="section-shell text-sm text-muted-foreground">David Liu / ElectroMechanical Engineer</div></footer>
    <Chatbot />
  </>;
}
