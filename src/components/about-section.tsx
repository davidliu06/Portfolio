import { profile } from "@/data/profile";

export function AboutSection() {
  return <section id="about" className="py-16">
    <div className="section-shell grid gap-8 md:grid-cols-[240px_1fr]">
      <h2 className="text-2xl font-semibold">About me</h2>
      <div className="max-w-3xl">
        <p className="text-lg leading-8">I'm an engineering student at Harvey Mudd College interested in robotics, aerospace, and embedded systems. My work combines mechanical design, simulation, fabrication, electronics, and programming.</p>
        <p className="mt-4 leading-7 text-muted-foreground">I've worked on underwater sensing systems, manufacturing equipment, aerodynamic studies, and PCB design. I enjoy hands-on work and understanding how the parts of a system fit together.</p>
        <dl className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2">
          <div><dt className="text-xs text-muted-foreground">Education</dt><dd className="mt-2 text-sm">{profile.degree}, {profile.school}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Graduation</dt><dd className="mt-2 text-sm">{profile.graduation}</dd></div>
        </dl>
      </div>
    </div>
  </section>;
}
