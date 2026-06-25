# David Liu Portfolio

Personal engineering portfolio for David Liu, built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, lucide icons, Vercel Analytics, a Resend-ready contact route, and a local-knowledge chatbot architecture.

## Technical Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn-style UI primitives
- Lucide React icons
- Vercel Analytics
- Resend contact API route
- Local structured chatbot knowledge base with OpenAI/RAG-ready API shape

## Architecture

```txt
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── contact/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chatbot/
│   ├── hero/
│   ├── projects/
│   ├── timeline/
│   └── ui/
├── data/
│   ├── chatbot.ts
│   ├── experience.ts
│   ├── profile.ts
│   ├── projects.ts
│   └── skills.ts
├── hooks/
├── lib/
├── styles/
└── types/
```

## Component Hierarchy

The page is a 7-chapter cinematic journey (Curiosity → Building → Research → Engineering → AI →
Systems Thinking → Future Vision), not a flat section stack:

- `SiteHeader` — chapter-jump nav
- `HeroSection` — cold open; mounts the `EngineeringUniverse` Three.js scene (`src/three/`) as a
  mouse-reactive background
- `AboutSection` (01 — Curiosity)
- `SkillsSection` (02 — Building)
- `ResearchSection` (03 — Research)
- `ExperienceSection` + `ProjectsSection` (04 — Engineering)
- `AiSection` (05 — AI) — also surfaces the `Chatbot` as a live demo, not just a corner widget
- `SystemsThinkingSection` (06 — Systems Thinking)
- `ResumeSection` + `ContactSection` (07 — Future Vision)
- `Chatbot` — floating, openable from anywhere via a `window.dispatchEvent(new Event("open-ask-david"))`

`src/three/` (Scene root, hooks, procedural mechanical-part components) and `src/store/journeyStore.ts`
(Zustand store for scroll/chapter/mouse-force state shared between the DOM and the R3F canvas) are new,
additive subsystems — see the project's `.claude/plans/` history for the full redesign rationale.

## Design System

- Theme: dark luxury / sci-fi engineering lab — deep near-black navy, electric blue accents, metallic
  silver/graphite, restrained warm gold used sparingly. Single theme; no light/dark toggle.
- Audience: engineering recruiters, aerospace/defense internships, robotics and hardware teams
- Visuals: a real Three.js scene (procedural gears/bearings/shafts, bloom postprocessing) behind the
  hero, glassy dark panels, real project images
- Motion: Framer Motion section reveals + GSAP/Lenis scroll choreography, mouse-reactive 3D parts,
  reduced-motion support (the Three.js canvas never mounts for `prefers-reduced-motion: reduce`)
- Accessibility: semantic sections, keyboard-reachable controls, labels, focus rings, responsive layout,
  device-tier-aware 3D quality scaling

## Updating Content

- Profile and links: `src/data/profile.ts`
- Projects: `src/data/projects.ts`
- Experience: `src/data/experience.ts`
- Skills: `src/data/skills.ts`
- Chatbot knowledge: `src/data/chatbot.ts`
- Resume PDF: replace `public/resume/david-liu-resume.pdf`
- Headshot: replace `public/images/david-headshot.png`
- Avatar: replace `public/images/david-chibi.png`
- Extracted portfolio images: `public/images/portfolio/`

## Chatbot Upgrade Path

The current `/api/chat` route answers from local structured data. Later upgrades can preserve the same UI and request shape:

1. Add OpenAI completion calls using `OPENAI_API_KEY`.
2. Generate embeddings for `chatbotKnowledge`.
3. Store vectors in a vector database.
4. Retrieve top matches per question.
5. Pass retrieved context into the OpenAI response.

## Contact Form

The `/api/contact` route is Resend-ready. Configure these in Vercel:

```txt
RESEND_API_KEY=
CONTACT_TO_EMAIL=davidliu@g.hmc.edu
CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
```

## Local Development

```bash
npm install
npm run dev
```

## Deploying To Vercel

```bash
npm install
npx vercel login
npm run deploy
```

Set these environment variables in Vercel if you want the contact form to send email:

```txt
RESEND_API_KEY=
CONTACT_TO_EMAIL=davidliu@g.hmc.edu
CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
```
