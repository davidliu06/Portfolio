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

- `SiteHeader`
- `HeroSection`
  - `ChibiAvatar` using `public/images/david-chibi.png`
- `AboutSection`
- `MissionBoardSection`
- `ProjectsSection`
- `ExperienceSection`
- `SkillsSection`
- `ResumeSection`
- `ContactSection`
- `Chatbot`

## Design System

- Theme: chill purple night game setting
- Audience: engineering recruiters, aerospace/defense internships, robotics and hardware teams
- Visuals: starry night background, glassy dark panels, rounded cards, chibi assistant avatar, real project images
- Motion: Framer Motion section reveals, subtle hover movement, reduced-motion support
- Accessibility: semantic sections, keyboard-reachable controls, labels, focus rings, responsive layout

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
