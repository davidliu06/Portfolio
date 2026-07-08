import Link from "next/link";
import { Compass, Home } from "lucide-react";

/** On-brand 404 — a "lost in deep space" beacon instead of the framework default. */
export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <div className="night-card w-full max-w-xl rounded-[2rem] border p-10 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">Signal lost · ERR 404</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">Lost in deep space</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          This coordinate doesn&apos;t map to any page in the portfolio. The page may have been moved,
          deorbited, or never launched in the first place.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            href="/"
          >
            <Home size={16} />
            Return to base
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            href="/#projects"
          >
            <Compass size={16} />
            Explore projects
          </Link>
        </div>
      </div>
    </main>
  );
}
