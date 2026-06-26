"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/data/profile";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-28">
      <div className="section-shell grid min-h-[calc(100vh-7rem)] items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          className="legibility-scrim rounded-[2rem] p-5 sm:p-6"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 16, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }} transition={{ duration: 0.6 }}>
            <Badge className="mb-5 border-primary/30 bg-primary/10 text-primary">
              <Sparkles size={14} className="mr-2" />
              Mechanical engineering portfolio
            </Badge>
          </motion.div>
          <motion.h1
            className="text-balance text-5xl font-black tracking-normal sm:text-6xl lg:text-7xl"
            transition={{ duration: 0.7 }}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          >
            {profile.shortHero}
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl text-xl leading-8 text-muted-foreground"
            transition={{ duration: 0.6 }}
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          >
            {profile.subheadline}
          </motion.p>
          <motion.p
            className="mt-4 font-semibold text-primary"
            transition={{ duration: 0.5 }}
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
          >
            {profile.currentRole}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            transition={{ duration: 0.55 }}
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          >
            <Link className="w-full sm:w-auto" href="#projects">
              <Button className="w-full sm:w-auto" size="lg">
                View Projects
                <ArrowDown size={18} />
              </Button>
            </Link>
            <a className="w-full sm:w-auto" href={profile.resumePath} download>
              <Button className="w-full sm:w-auto" size="lg" variant="outline">
                <Download size={18} />
                Download Resume
              </Button>
            </a>
            <Link className="w-full sm:w-auto" href="#contact">
              <Button className="w-full sm:w-auto" size="lg" variant="ghost">
                <Mail size={18} />
                Contact
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
            transition={{ staggerChildren: 0.06 }}
            variants={{ hidden: {}, visible: {} }}
          >
            {["Aerospace", "Defense", "Robotics", "Manufacturing"].map((item) => (
              <motion.div
                className="night-card rounded-2xl border p-3 text-sm font-semibold text-foreground transition hover:-translate-y-1 hover:shadow-glow"
                key={item}
                transition={{ duration: 0.45 }}
                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="soft-panel relative mx-auto aspect-[0.88] max-w-[460px] rounded-[2rem] border bg-card/70 p-4 shadow-glow backdrop-blur">
            <div className="absolute right-5 top-5 z-10 rounded-full border border-primary/25 bg-card/95 px-3 py-1 font-mono text-xs font-semibold text-primary shadow-sm">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
