import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** For sections with their own 3D/video background layer behind the heading — adds a blurred scrim so text never blends into what's drifting underneath. */
  scrim?: boolean;
};

export function SectionHeading({ eyebrow, title, description, scrim = false }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 max-w-3xl text-left", scrim && "py-6")}>
      <p className="mb-3 text-xs font-medium text-primary">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  );
}
