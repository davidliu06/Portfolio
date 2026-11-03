import Image from "next/image";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { visibility } from "@/data/visibility";

export function HeroSection() {
  return <section id="top" className="portfolio-intro">
    <div className="section-shell">
      <div className="intro-kicker"><span>Engineering portfolio</span><span>Harvey Mudd College / 2028</span></div>
      <h1>David Liu<span className="text-primary">.</span></h1>
      <div className="intro-content">
        <div>
          <p className="intro-role">Electromechanical engineering.</p>
          <p className="intro-description">I design and build hardware, from underwater robots and vehicle systems to circuits you can hold in your hand.</p>
          <p className="mt-5 text-sm text-muted-foreground">B.S. Engineering, Harvey Mudd College. Open to engineering internships.</p>
          <div className="intro-links">
            <a href="#projects" className="intro-primary">Selected work <ArrowDown size={17} /></a>
            {visibility.resume && <a href={profile.resumePath} download><Download size={17} />Resume</a>}
            <a href="#contact">Get in touch <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <figure>
          <Image src={profile.headshotPath} alt="David Liu" width={320} height={320} priority className="aspect-square w-full object-cover" />
          <figcaption className="mt-3 text-xs text-muted-foreground">Claremont, California</figcaption>
        </figure>
      </div>
      <div className="intro-index"><span>Mechanical design</span><span>Electronics</span><span>Robotics &amp; controls</span></div>
    </div>
  </section>;
}
