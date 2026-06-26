import { NextResponse } from "next/server";
import { chatbotKnowledge } from "@/data/chatbot";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type KnowledgeSnippet = {
  title: string;
  content: string;
  tags: string[];
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "are",
  "can",
  "david",
  "did",
  "does",
  "for",
  "from",
  "has",
  "have",
  "his",
  "how",
  "into",
  "like",
  "me",
  "more",
  "tell",
  "that",
  "the",
  "this",
  "was",
  "what",
  "when",
  "where",
  "with",
  "would",
  "you"
]);

const SYNONYMS: Record<string, string[]> = {
  ai: ["artificial intelligence", "llm", "machine learning", "invite"],
  aerospace: ["aerodynamics", "cfd", "wind tunnel", "nose cone", "vehicle", "rocketry", "rocket", "propulsion"],
  auv: ["underwater", "muddsub", "robosub", "submarine", "depth", "sensor"],
  automotive: ["mach", "vehicle", "hybrid", "powertrain", "steering", "braking"],
  cad: ["solidworks", "mechanical design", "assembly", "drawing"],
  defense: ["reliability", "mission", "aerospace", "hardware", "testing"],
  electronics: ["pcb", "circuit", "signal", "teensy", "arduino", "sensor"],
  jarvis: ["voice assistant", "voice ai", "desktop automation", "workflow automation", "local ai", "gpt tool calling"],
  manufacturing: ["machining", "sheet metal", "fabrication", "assembly", "mrp"],
  rocketry: ["apollyon", "rocket", "propulsion", "spaceport", "tripoli", "high power rocketry", "l1", "altitude", "apogee", "muddrocket"],
  robotics: ["auv", "muddsub", "robosub", "autonomous", "sensor", "controls"],
  simulation: ["fea", "cfd", "comsol", "analysis", "modeling"]
};

function tokenize(value: string) {
  const expanded = normalize(value);
  return expanded
    .split(/[^a-z0-9+#.]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/muddsub/g, "muddsub robosub auv underwater")
    .replace(/robo sub/g, "robosub")
    .replace(/mach/g, "mach automotive hybrid vehicle")
    .replace(/solid works/g, "solidworks")
    .replace(/nosecone/g, "nose cone")
    .replace(/llms/g, "llm")
    .replace(/résumé/g, "resume")
    .replace(/apollyon/g, "apollyon rocketry rocket propulsion")
    .replace(/muddrocket/g, "muddrocket rocketry rocket")
    .replace(/jarvis/g, "jarvis voice ai automation");
}

function expandedQueryTokens(question: string, history: ChatMessage[]) {
  const recentContext = history
    .slice(-5)
    .map((message) => message.content)
    .join(" ");
  const baseTokens = tokenize(`${recentContext} ${question}`);
  const tokens = new Set(baseTokens);

  for (const token of baseTokens) {
    for (const synonym of SYNONYMS[token] ?? []) {
      tokenize(synonym).forEach((item) => tokens.add(item));
    }
  }

  return [...tokens];
}

function scoreSnippet(tokens: string[], snippet: KnowledgeSnippet) {
  const haystack = normalize(`${snippet.title} ${snippet.content} ${snippet.tags.join(" ")}`);
  let score = 0;

  for (const token of tokens) {
    if (haystack.includes(token)) score += snippet.tags.includes(token) ? 5 : 2;
  }

  if (tokens.some((token) => normalize(snippet.title).includes(token))) score += 4;
  return score;
}

function retrieveSnippets(question: string, history: ChatMessage[]) {
  const tokens = expandedQueryTokens(question, history);
  return chatbotKnowledge
    .map((entry) => ({
      title: entry.title,
      content: entry.content,
      tags: entry.tags,
      score: scoreSnippet(tokens, entry)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function portfolioDigest() {
  const projectLines = projects
    .map(
      (project) =>
        `${project.name} (${project.dates}): ${project.summary} Role: ${project.role} Tech: ${project.technologies.join(", ")}.`
    )
    .join("\n");
  const experienceLines = experience
    .map(
      (item) =>
        `${item.role} at ${item.organization} (${item.dates}): ${item.bullets.join(" ")} Tools: ${item.tools.join(", ")}.`
    )
    .join("\n");
  const skillLines = skills.map((group) => `${group.category}: ${group.skills.join(", ")}.`).join("\n");

  return [
    `${profile.name}: ${profile.headline}. ${profile.degree} at ${profile.school}, ${profile.graduation}, GPA ${profile.gpa}.`,
    `Contact: ${profile.email}. LinkedIn: ${profile.linkedin}. GitHub: ${profile.github}.`,
    `Target roles: ${profile.roles.join(", ")}.`,
    `Target opportunities: ${profile.targets.join(", ")}.`,
    `Recruiter takeaway: ${profile.takeaway}`,
    `Projects:\n${projectLines}`,
    `Experience:\n${experienceLines}`,
    `Skills:\n${skillLines}`
  ].join("\n\n");
}

function localIntentAnswer(question: string, matches: ReturnType<typeof retrieveSnippets>) {
  const query = normalize(question);

  if (query.includes("contact") || query.includes("email") || query.includes("reach")) {
    return `David can be reached at ${profile.email}. His LinkedIn is ${profile.linkedin}.`;
  }

  if (query.includes("resume")) {
    return "David's resume is embedded on the site and available as a PDF download. It emphasizes mechanical design, SolidWorks, manufacturing, robotics, CFD/FEA, embedded sensing, and AI-enabled engineering work.";
  }

  if (query.includes("why") && (query.includes("hire") || query.includes("candidate") || query.includes("fit"))) {
    return [
      "David is a strong mechanical/robotics internship candidate because he has worked across the full hardware loop: design, simulation, fabrication, electronics, testing, and field validation.",
      "Relevant examples include AUV sensor/control work, COMSOL CFD and FEA studies, SolidWorks manufacturing design at MRP Solutions, and vehicle systems work through MACH.",
      "He is especially aligned with aerospace, defense, robotics, autonomous systems, manufacturing automation, and high-growth hardware teams."
    ].join("\n");
  }

  if (query.includes("robotics") || query.includes("robot")) {
    return [
      "David's robotics experience is strongest in autonomous underwater systems and hands-on mechatronics.",
      "On his AUV project, he integrated pressure, pH, turbidity, and temperature sensing; built signal-conditioning circuits; calibrated sensors in MATLAB; and implemented Arduino/Teensy depth control.",
      "On MuddSub/RoboSub, he worked on a torpedo release mechanism, COMSOL FEA, and PCB layout improvements for underwater reliability."
    ].join("\n");
  }

  if (query.includes("auv") || query.includes("underwater") || query.includes("muddsub") || query.includes("robosub")) {
    return [
      "David's AUV work combines mechanical design, embedded sensing, electronics, controls, and field testing.",
      "For the environmental-monitoring AUV, he integrated pH, turbidity, temperature, and pressure sensors; designed analog signal-conditioning circuits; created MATLAB calibration models; and used pressure feedback for depth tracking.",
      "He also contributes to MuddSub/RoboSub, including mechanism design, COMSOL FEA, and PCB layout improvements."
    ].join("\n");
  }

  if (query.includes("cad") || query.includes("solidworks") || query.includes("simulation") || query.includes("fea") || query.includes("cfd") || query.includes("comsol")) {
    return [
      "David uses SolidWorks for mechanical assemblies, sheet-metal components, machine guards, vehicle systems, and prototype mechanisms.",
      "His simulation work includes COMSOL CFD for nose cone aerodynamics, wind tunnel validation, and FEA for mechanisms and underwater robot components.",
      "He is strongest where CAD, analysis, fabrication constraints, and physical testing connect."
    ].join("\n");
  }

  if (query.includes("aerospace") || query.includes("defense")) {
    return [
      "David fits aerospace and defense-oriented internships through his work in CFD, wind tunnel testing, vehicle systems, reliability-focused hardware, and autonomous robotics.",
      "His nose cone project directly connects to aerodynamic analysis: COMSOL CFD, wind tunnel measurements, Reynolds number effects, drag coefficients, and model validation.",
      "His AUV and MuddSub work also show mission-style engineering: sensors, controls, electronics, mechanisms, testing, and iteration under real constraints."
    ].join("\n");
  }

  if (query.includes("mach") || query.includes("automotive") || query.includes("vehicle")) {
    return [
      "On MACH, David contributes to Harvey Mudd's student-built hybrid vehicle.",
      "His work supports SolidWorks modeling, manufacturable parts, vehicle frame/front-end assemblies, braking, steering, powertrain integration, machining, assembly, and testing.",
      "It is a strong example of practical mechanical systems work beyond class projects."
    ].join("\n");
  }

  if (query.includes("experience") || query.includes("professional") || query.includes("internship")) {
    return [
      "David's professional experience spans manufacturing engineering, research, teaching, and technical teams.",
      "At MRP Solutions, he designs SolidWorks assemblies, machine guards, sheet-metal parts, and access-control systems for automated manufacturing equipment.",
      "He also has AI/data research experience through UIUC INVITE, robotics teaching experience through Project Think, and hands-on team experience through MACH and MuddSub."
    ].join("\n");
  }

  if (query.includes("skill") || query.includes("technical")) {
    return [
      "David's core technical stack includes SolidWorks, CAD, FEA, CFD, COMSOL, MATLAB, Python, Arduino/Teensy, embedded sensing, analog signal conditioning, PCB layout, machining, and fabrication.",
      "His strongest overlap is mechanical design plus robotics: building systems that combine hardware, electronics, controls, simulation, and testing."
    ].join("\n");
  }

  if (
    query.includes("rocket") ||
    query.includes("rocketry") ||
    query.includes("apollyon") ||
    query.includes("propulsion") ||
    query.includes("spaceport") ||
    query.includes("tripoli") ||
    query.includes("muddrocket")
  ) {
    return [
      "David leads propulsion and structures on Harvey Mudd's Muddrocket team, building Apollyon I for Spaceport America Cup 2026.",
      "Target is 10,000 ft AGL with a dual-deployment recovery system — drogue at apogee, main chute at 700 ft for a sub-25 fps landing.",
      "His work covers motor selection and OpenRocket flight simulation, composite airframe design, aluminum fin can manufacturing, and launch operations.",
      "He has earned his Tripoli Rocketry Association L1 certification, the first step toward full high-power rocketry clearance."
    ].join("\n");
  }

  if (
    query.includes("jarvis") ||
    query.includes("voice assistant") ||
    query.includes("desktop automation") ||
    query.includes("voice ai") ||
    query.includes("workflow automation")
  ) {
    return [
      "Jarvis is David's self-built local voice AI desktop assistant — you speak a command, it figures out what tool to call, then executes it on your desktop.",
      "The system uses GPT-4o mini with OpenAI structured tool calling to dispatch browser control, app launching, file I/O, clipboard, screenshots, OCR, and more.",
      "It includes a persistent SQLite memory system with hybrid keyword + embedding search wired into every LLM prompt, plus a 40+ module architecture for execution tracing, retry policy, and multi-step planning.",
      "The most advanced layer is self-healing workflow automation: it records your UI interactions, anchors them to screen elements via OCR, and re-resolves those anchors at playback time even if windows move."
    ].join("\n");
  }

  if (query.includes("weakness") || query.includes("improve")) {
    return "A fair growth area is deepening industry-scale deployment experience. David is already building toward that through MRP Solutions, MACH, MuddSub, and project work that forces designs through testing, troubleshooting, and iteration.";
  }

  if (query.includes("course") || query.includes("coursework")) {
    return "The site data does not list David's full coursework yet. Based on the portfolio, the strongest visible areas are mechanical design, fluid mechanics, computational engineering, programming, chemistry labs, CAD/simulation, electronics, and robotics.";
  }

  if (!matches.length) return null;

  if (query.includes("summarize") || query.includes("summary") || query.includes("overview")) {
    return `${matches[0].title}: ${matches[0].content}`;
  }

  return null;
}

function formatLocalAnswer(question: string, matches: ReturnType<typeof retrieveSnippets>) {
  const intentAnswer = localIntentAnswer(question, matches);
  if (intentAnswer) return intentAnswer;

  if (!matches.length) {
    return "I do not have that specific detail in David's portfolio data yet. I can answer confidently about his AUV project, nose cone CFD/wind tunnel project, GlideLounge mechanism, MRP internship, MACH, MuddSub, INVITE, CAD/simulation skills, and aerospace/defense interests.";
  }

  const best = matches.slice(0, 3);
  const answer = best
    .map((match) => {
      const content = match.content.replace(new RegExp(`^${match.title}:?\\s*`, "i"), "");
      return `${match.title}: ${content}`;
    })
    .join("\n\n");

  return answer.length > 950 ? `${answer.slice(0, 947)}...` : answer;
}

async function answerWithOpenAI(question: string, messages: ChatMessage[], context: string) {
  const { OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.25,
    max_tokens: 260,
    messages: [
      {
        role: "system",
        content:
          "You are Ask David, David Liu's portfolio assistant. Answer recruiters and interviewers concisely using only the supplied portfolio facts. Be specific, technical, and professional. If a fact is not available, say that the portfolio does not list it yet. Do not invent private information. Use 2-5 short sentences or bullets."
      },
      {
        role: "user",
        content: `Portfolio facts:\n${context}`
      },
      ...messages.slice(-6).map((message) => ({
        role: message.role as "assistant" | "user",
        content: message.content
      })),
      {
        role: "user",
        content: question
      }
    ]
  });

  return completion.choices[0]?.message.content?.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = body.messages ?? [];
    const lastQuestion = messages.filter((message) => message.role === "user").at(-1)?.content ?? "";

    if (!lastQuestion.trim()) {
      return NextResponse.json({
        answer: "Ask me about David's projects, experience, skills, resume, or fit for aerospace/defense/robotics internships."
      });
    }

    const previousMessages = messages.slice(0, -1);
    const matches = retrieveSnippets(lastQuestion, previousMessages);
    const retrievedContext = matches.map((match) => `${match.title}: ${match.content}`).join("\n\n");
    const context = retrievedContext || portfolioDigest();

    if (process.env.OPENAI_API_KEY) {
      try {
        const answer = await answerWithOpenAI(lastQuestion, previousMessages, context);
        if (answer) return NextResponse.json({ answer });
      } catch {
        // Fall back to deterministic local answers if the AI provider is unavailable.
      }
    }

    return NextResponse.json({ answer: formatLocalAnswer(lastQuestion, matches) });
  } catch {
    return NextResponse.json(
      { answer: "I had trouble reading that question. Please try asking again in one sentence." },
      { status: 200 }
    );
  }
}
