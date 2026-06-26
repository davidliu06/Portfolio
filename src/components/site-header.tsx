"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["AI", "#ai"],
  ["Resume", "#resume"],
  ["Contact", "#contact"],
] as const;

const SECTION_IDS = NAV_LINKS.map(([, href]) => href.slice(1));

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { threshold: 0, rootMargin: "-40% 0px -50% 0px" }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

export function SiteHeader() {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu when route changes (hash navigation)
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-background/85 backdrop-blur">
        <nav className="section-shell flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link className="group flex items-center gap-3" href="#top" aria-label="David Liu home">
            <span className="grid h-10 w-10 place-items-center rounded-[1rem_0.65rem_1rem_0.65rem] border bg-card font-black tracking-normal shadow-sm">
              <span className="relative text-primary">
                DL
                <span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-accent transition group-hover:scale-150" />
              </span>
            </span>
            <span className="hidden text-sm font-semibold sm:block">David Liu</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(([label, href]) => {
              const isActive = active === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Hamburger — mobile only */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-lg border border-transparent transition hover:border-border hover:bg-muted md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-x-0 top-16 z-30 border-b border-white/[0.06] bg-background/97 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <nav className="section-shell flex flex-col py-4">
              {NAV_LINKS.map(([label, href]) => {
                const isActive = active === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center justify-between border-b border-border/50 py-4 text-base font-semibold transition last:border-0",
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
