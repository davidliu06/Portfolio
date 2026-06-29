"use client";

import { FormEvent, useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealSection } from "@/components/ui/reveal";
import { profile } from "@/data/profile";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setStatusMessage("");
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; note?: string };
      if (response.ok) {
        setStatus("sent");
        setStatusMessage("Message sent. Thanks for reaching out.");
        form.reset();
      } else {
        setStatus("error");
        setStatusMessage(data.error ?? data.note ?? "Message could not be sent. Please email me directly.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("The contact endpoint could not be reached. Please email me directly.");
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="section-shell">
        <RevealSection preset="fade-up">
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's build something."
            description="Reach out directly — messages go straight to my inbox through Resend."
          />
        </RevealSection>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <RevealSection preset="slide-right">
            <div className="night-card h-full rounded-[1.5rem] border p-6">
              <h3 className="text-xl font-bold">Links</h3>
              <div className="mt-5 grid gap-3">
                <a className="flex w-full items-center gap-3 rounded-2xl border border-primary/15 bg-background/60 p-4 transition hover:bg-muted" href={`mailto:${profile.email}`}>
                  <Mail size={20} />
                  {profile.email}
                </a>
                <a className="flex w-full items-center gap-3 rounded-2xl border border-primary/15 bg-background/60 p-4 transition hover:bg-muted" href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={20} />
                  LinkedIn
                </a>
                <a className="flex w-full items-center gap-3 rounded-2xl border border-primary/15 bg-background/60 p-4 transition hover:bg-muted" href={profile.github} target="_blank" rel="noreferrer">
                  <Github size={20} />
                  GitHub
                </a>
              </div>
            </div>
          </RevealSection>
          <RevealSection delay={0.1} glow="cobalt" preset="cinematic">
          <form className="night-card rounded-[1.5rem] border p-6" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Name
                <input
                  className="contact-field h-11 rounded-2xl border px-4 outline-none focus:ring-2 focus:ring-ring"
                  name="name"
                  required
                  suppressHydrationWarning
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input
                  className="contact-field h-11 rounded-2xl border px-4 outline-none focus:ring-2 focus:ring-ring"
                  name="email"
                  required
                  suppressHydrationWarning
                  type="email"
                />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold">
              Message
              <textarea
                className="contact-field min-h-36 rounded-2xl border p-4 outline-none focus:ring-2 focus:ring-ring"
                name="message"
                required
                suppressHydrationWarning
              />
            </label>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button disabled={status === "loading"} type="submit">
                <Send size={18} />
                {status === "loading" ? "Sending" : "Send Message"}
              </Button>
              {status === "sent" && <p className="text-sm font-semibold text-secondary">{statusMessage}</p>}
              {status === "error" && <p className="max-w-md text-sm font-semibold text-accent">{statusMessage}</p>}
            </div>
          </form>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
