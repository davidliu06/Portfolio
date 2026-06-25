import { Badge } from "./badge";
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
    <div className={cn("mx-auto mb-10 max-w-3xl rounded-[2rem] text-center", scrim && "legibility-scrim p-6")}>
      <Badge className="mb-4 border-primary/30 text-primary">{eyebrow}</Badge>
      <h2 className="text-balance text-3xl font-bold tracking-normal sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  );
}
