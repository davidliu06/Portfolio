"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { pcbStory } from "@/data/pcb-story";
import { electricalProjects } from "@/data/electrical";
import { PcbViewer } from "@/components/pcb-viewer";
import { ModelErrorBoundary } from "@/three/assembly/ModelErrorBoundary";
import { usePrefersReducedMotion } from "@/three/hooks/usePrefersReducedMotion";
import { getLenis } from "@/lib/scroll";

const ScrollBoard = dynamic(() => import("@/three/pcb/ScrollBoard"), { ssr: false });
const card = electricalProjects[0];

export function PcbScrollStory() {
  const track = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();
  const onReady = useCallback(() => setReady(true), []);
  const step = progress * (pcbStory.length - 1);
  const active = Math.round(step);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!track.current) return;
      const bounds = track.current.getBoundingClientRect();
      const distance = bounds.height - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, -bounds.top / Math.max(1, distance))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, [reduced]);

  function goToChapter(index: number) {
    if (!track.current) return;
    const top = window.scrollY + track.current.getBoundingClientRect().top;
    const target = top + (track.current.offsetHeight - window.innerHeight) * index / (pcbStory.length - 1);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  }

  const poster = <Image src={card.image} alt="David Liu's NFC business card with wave artwork" fill priority sizes="100vw" className="object-contain p-8" />;
  return <>
    {reduced ? <section className="section-shell py-12" aria-label="NFC card story">
      <p className="text-sm text-primary">NFC PCB BUSINESS CARD</p>
      <h1 className="mt-3 text-4xl font-bold">What brought you here?</h1>
      <div className="relative my-6 h-[45svh]">{poster}</div>
      <div className="grid gap-8 md:grid-cols-2">{pcbStory.map(chapter => <article key={chapter.label}><h2 className="text-2xl font-semibold">{chapter.title}</h2><p className="mt-3 leading-7 text-muted-foreground">{chapter.body}</p></article>)}</div>
    </section> : <section ref={track} className="pcb-story-track" style={{ height: `${pcbStory.length * 100 + 50}svh` }} aria-label="NFC card scroll story">
      <div className="pcb-story-stage" data-chapter={active} style={{ "--story-clip": `${Math.min(1, step) * 41}%` } as CSSProperties}>
        <div className="pcb-story-topline"><span>DAVID LIU / NFC CARD</span><a href="#inspect-card">Skip to inspection<ArrowDown size={14} aria-hidden /></a></div>
        <div className="pcb-story-model" aria-label="Scroll-controlled 360 degree PCB view">
          {!ready && poster}
          <ModelErrorBoundary fallback={poster}><ScrollBoard progress={progress} onReady={onReady} /></ModelErrorBoundary>
        </div>
        <div className="pcb-story-copy">
          {pcbStory.map((chapter, index) => {
            const distance = Math.abs(step - index);
            const opacity = Math.max(0, 1 - distance * 1.8);
            return <div className={`pcb-story-chapter ${index === 0 ? "is-intro" : ""}`} key={chapter.label} aria-hidden={active !== index} style={{ opacity, transform: `translateY(${(index - step) * 22}px)`, visibility: distance > 1 ? "hidden" : "visible" }}>
              <p className="pcb-story-eyebrow" style={{ color: chapter.color }}>{String(index + 1).padStart(2, "0")} / {chapter.label}</p>
              {index === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
              <p className="pcb-story-body">{chapter.body}</p>
              {index >= 5 && index <= 7 && <nav className="nfc-demo-steps" aria-label="NFC demonstration steps">{["Approach", "Red LED", "Receive link"].map((label, i) => <button key={label} type="button" tabIndex={active === index ? 0 : -1} aria-current={active === i + 5 ? "step" : undefined} onClick={() => goToChapter(i + 5)}><span>{i + 1}</span>{label}</button>)}</nav>}
              <p className="pcb-story-detail" style={{ color: chapter.color }}>{index === 4 ? <><span style={{ color: "#ffc879" }}>D1 LED</span>{" / "}<span style={{ color: "#a5ebd5" }}>R1 RESISTOR</span>{" / "}<span style={{ color: "#bcaaff" }}>C1 CAPACITOR</span></> : chapter.detail}</p>
            </div>;
          })}
        </div>
        <nav className="pcb-story-chapters" aria-label="PCB story chapters">
          {pcbStory.map((chapter, index) => <button type="button" key={chapter.label} title={chapter.label} aria-label={`Chapter ${index + 1}: ${chapter.label}`} aria-current={active === index ? "step" : undefined} onClick={() => goToChapter(index)}><span style={{ backgroundColor: active === index ? chapter.color : undefined }} /></button>)}
          <span className="pcb-story-counter">{String(active + 1).padStart(2, "0")} / {String(pcbStory.length).padStart(2, "0")}</span>
        </nav>
        <div className="pcb-story-progress" style={{ transform: `scaleX(${progress})`, background: pcbStory[active].color }} />
      </div>
    </section>}
    <section id="inspect-card" className="pcb-inspection">
      <div className="section-shell pt-12"><p className="text-sm font-semibold text-primary">YOUR TURN</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Every angle. Every detail.</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">The real KiCad board, from artwork to circuitry.</p></div>
      <PcbViewer model={card.model} image={card.image} name={card.name} large />
      <div className="section-shell grid gap-8 pb-16 md:grid-cols-2"><div><h3 className="text-xl font-semibold">Skills applied &amp; lessons learned</h3><p className="mt-3 leading-7 text-muted-foreground">{card.skills}</p></div><div><h3 className="text-xl font-semibold">Hands-on testing</h3><p className="mt-3 leading-7 text-muted-foreground">{card.testing}</p><a href="#pocket-rhythm" className="mt-5 inline-flex items-center gap-2 text-primary">Next: PocketRhythm drum machine<ArrowUpRight size={16} aria-hidden /></a></div></div>
    </section>
  </>;
}
