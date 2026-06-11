export type LinkItem = {
  label: string;
  href: string;
};

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
  image?: string;
  document?: string;
};

export type Experience = {
  organization: string;
  role: string;
  dates: string;
  location: string;
  type: "Internship" | "Research" | "Leadership" | "Club" | "Project";
  bullets: string[];
  tools: string[];
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
