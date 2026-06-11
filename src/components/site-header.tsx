import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Projects", "#projects"],
  ["Mission", "#mission"],
  ["Experience", "#experience"],
  ["Resume", "#resume"],
  ["Contact", "#contact"]
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/78 backdrop-blur-xl">
      <nav className="section-shell flex h-16 items-center justify-between gap-4">
        <Link className="group flex items-center gap-3" href="#top" aria-label="David Liu home">
          <span className="grid h-10 w-10 place-items-center rounded-[1rem_0.65rem_1rem_0.65rem] border bg-card font-black tracking-normal shadow-sm">
            <span className="relative text-primary">
              DL
              <span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-accent transition group-hover:scale-150" />
            </span>
          </span>
          <span className="hidden text-sm font-semibold sm:block">David Liu</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
