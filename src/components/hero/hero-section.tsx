"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/data/profile";
import { ChibiAvatar } from "./chibi-avatar";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_22%_18%,rgba(168,85,247,0.26),transparent_32%),radial-gradient(circle_at_72%_20%,rgba(34,211,238,0.14),transparent_26%)]" />
      <div className="section-shell grid min-h-[calc(100vh-7rem)] items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Sparkles size={14} className="mr-2" />
            Mechanical engineering portfolio
          </Badge>
          <h1 className="text-balance text-5xl font-black tracking-normal sm:text-6xl lg:text-7xl">
            {profile.shortHero}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-muted-foreground">{profile.subheadline}</p>
          <p className="mt-4 font-semibold text-primary">{profile.currentRole}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#projects">
              <Button size="lg">
                View Projects
                <ArrowDown size={18} />
              </Button>
            </Link>
            <a href={profile.resumePath} download>
              <Button size="lg" variant="outline">
                <Download size={18} />
                Download Resume
              </Button>
            </a>
            <Link href="#contact">
              <Button size="lg" variant="ghost">
                <Mail size={18} />
                Contact
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {["Aerospace", "Defense", "Robotics", "Manufacturing"].map((item) => (
              <div className="night-card rounded-2xl border p-3 text-sm font-semibold text-foreground transition hover:-translate-y-1" key={item}>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="soft-panel relative mx-auto aspect-[0.88] max-w-[460px] rounded-[2rem] border bg-card/70 p-4 shadow-glow backdrop-blur">
            <div className="absolute right-5 top-5 z-10 rounded-full border border-primary/25 bg-background/80 px-3 py-1 font-mono text-xs font-semibold text-primary shadow-sm backdrop-blur">
              OPEN TO INTERNSHIPS
            </div>
            <Image
              src={profile.headshotPath}
              alt="David Liu headshot"
              width={520}
              height={520}
              priority
              className="h-full w-full rounded-[1.5rem] object-cover opacity-95"
            />
            <div className="absolute -bottom-12 -left-2 w-36 sm:-left-6 sm:w-44">
              <ChibiAvatar />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
