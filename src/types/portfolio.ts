export type LinkItem = {
  label: string;
  href: string;
};

/**
 * The 7-chapter cinematic narrative: Curiosity -> Building -> Research ->
 * Engineering -> AI -> Systems Thinking -> Future Vision. `chapter` is where
 * an entry's full card renders; `alsoFeaturedIn` lets a chapter pull a
 * condensed highlight from an entry that primarily lives elsewhere (e.g.
 * Rocketry's systems-integration bullets surface in Systems Thinking even
 * though the full card lives in Engineering).
 */
export type Chapter = "curiosity" | "building" | "research" | "engineering" | "ai" | "systems" | "vision";

export type Project = {
  slug: string;
  name: string;
  category: "Engineering Focused" | "Other";
  dates: string;
  summary: string;
  description: string;
  challenge: string;
  role: string;
  technologies: string[];
  links: LinkItem[];
  featured: boolean;
  accent: "blue" | "teal" | "orange" | "gold";
  chapter: Chapter;
  alsoFeaturedIn?: Chapter[];
  image?: string;
  gallery?: string[];
  document?: string;
  /** Punchy, measurable results — distinct from `challenge`'s narrative framing. */
  achievements: string[];
  /** Only set when a project genuinely has one — these are physical hardware projects, not every one has a repo or live demo. */
  githubUrl?: string;
  demoUrl?: string;
  /** A single standout, real number worth a count-up moment in the detail view. */
  heroStat?: {
    value: number;
    suffix: string;
    label: string;
  };
};

export type Experience = {
  organization: string;
  role: string;
  dates: string;
  location: string;
  type: "Internship" | "Research" | "Leadership" | "Club" | "Project";
  bullets: string[];
  tools: string[];
  chapter: Chapter;
  alsoFeaturedIn?: Chapter[];
  image?: string;
  imageAlt?: string;
};

export type SkillGroup = {
  category: string;
  icon: string;
  skills: string[];
  strength: number;
};

export type ChatKnowledgeEntry = {
  id: string;
  title: string;
  content: string;
  tags: string[];
};
