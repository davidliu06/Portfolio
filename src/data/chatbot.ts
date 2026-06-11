import type { ChatKnowledgeEntry } from "@/types/portfolio";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skills } from "./skills";

export const suggestedQuestions = [
  "Why is David a strong robotics intern?",
  "Tell me about David's AUV project.",
  "What CAD and simulation experience does David have?",
  "What did David do on MACH?",
  "How does David fit aerospace or defense roles?",
  "Summarize David's professional experience."
];

export const chatbotKnowledge: ChatKnowledgeEntry[] = [
  {
    id: "profile",
    title: "Profile",
    content: `${profile.name} is a ${profile.headline}. He studies ${profile.degree} at ${profile.school}, graduates ${profile.graduation}, and has a ${profile.gpa} GPA. ${profile.takeaway}`,
    tags: ["profile", "education", "summary", "school"]
  },
  {
    id: "interests",
    title: "Career Interests",
    content: `David is targeting ${profile.targets.join(", ")}. Desired roles include ${profile.roles.join(", ")}.`,
    tags: ["career", "roles", "internship", "aerospace", "defense", "robotics"]
  },
  ...projects.map((project) => ({
    id: `project-${project.slug}`,
    title: project.name,
    content: `${project.name}: ${project.summary} ${project.description} Challenge: ${project.challenge} Role: ${project.role} Technologies: ${project.technologies.join(", ")}.`,
    tags: ["project", project.slug, ...project.technologies.map((item) => item.toLowerCase())]
  })),
  ...experience.map((item, index) => ({
    id: `experience-${index}`,
    title: `${item.role} at ${item.organization}`,
    content: `${item.role} at ${item.organization}, ${item.dates}. ${item.bullets.join(" ")} Tools: ${item.tools.join(", ")}.`,
    tags: ["experience", item.type.toLowerCase(), item.organization.toLowerCase()]
  })),
  ...skills.map((group) => ({
    id: `skill-${group.category}`,
    title: group.category,
    content: `${group.category}: ${group.skills.join(", ")}.`,
    tags: ["skills", group.category.toLowerCase(), ...group.skills.map((item) => item.toLowerCase())]
  })),
  {
    id: "contact",
    title: "Contact",
    content: `David can be contacted at ${profile.email}. LinkedIn: ${profile.linkedin}. GitHub is currently TBD.`,
    tags: ["contact", "email", "linkedin", "github"]
  }
];
