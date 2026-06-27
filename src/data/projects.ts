import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    slug: "autonomous-underwater-vehicle",
    name: "Autonomous Underwater Robot",
    shortTitle: "Underwater Robot",
    category: "Engineering Focused",
    dates: "Jan 2026 - May 2026",
    summary: "Embedded sensing and depth-control AUV for environmental monitoring at Dana Point.",
    description:
      "Designed, deployed, and analyzed an autonomous underwater vehicle that collected pH, temperature, turbidity, and pressure data to evaluate water-quality indicators across depths from 0 to 2 meters.",
    challenge:
      "Integrated four sensing systems, designed signal-conditioning circuits, calibrated sensors with MATLAB models, and used pressure feedback for autonomous depth tracking.",
    role: "Sensor integration, analog circuits, calibration, controls, field testing, and data analysis.",
    technologies: ["Embedded Systems", "Analog Circuit Design", "Teensy 4.0", "Arduino", "MATLAB", "AUV"],
    achievements: [
      "Integrated 4 independent sensing systems — pH, temperature, turbidity, and pressure — into one vehicle",
      "Closed the loop on autonomous depth tracking using real-time pressure feedback control",
      "Collected and validated water-quality data across 0–2 m depth in field testing at Dana Point"
    ],
    links: [{ label: "Read report", href: "/docs/auv-final-report.pdf" }],
    document: "/docs/auv-final-report.pdf",
    featured: true,
    accent: "blue",
    chapter: "engineering",
    heroStat: { value: 2, suffix: "m", label: "max monitoring depth" },
    image: "/images/portfolio/portfolio-image-p2-1.png",
    gallery: [
      "/images/project-docs/auv-report-image-p2-2.png",
      "/images/project-docs/auv-report-image-p3-3.png",
      "/images/project-docs/auv-report-image-p5-1.png"
    ]
  },
  {
    slug: "aerodynamic-nose-cones",
    name: "Computational and Experimental Aerodynamic Analysis of Nose Cone Geometries",
    shortTitle: "Nose Cone CFD",
    category: "Engineering Focused",
    dates: "Jan 2026 - May 2026",
    summary: "CFD and wind tunnel comparison of flat, rounded, and pointed nose cone geometries.",
    description:
      "Investigated aerodynamic drag through wind tunnel testing and COMSOL CFD simulation. Airflow velocities were measured with a Pitot tube and digital manometer, and drag forces were quantified using an LVDT.",
    challenge:
      "Validated simulation trends against physical testing and analyzed how mesh resolution, geometric approximation, and testing conditions affected accuracy.",
    role: "CFD modeling, experimental setup, wind tunnel testing, data analysis, and report writing.",
    technologies: ["COMSOL", "CFD", "Wind Tunnel", "Pitot Tube", "LVDT", "Fluid Mechanics"],
    achievements: [
      "Validated COMSOL CFD drag predictions directly against physical wind-tunnel measurements",
      "Quantified drag forces via LVDT alongside Pitot-tube/digital-manometer airflow measurement",
      "Identified how mesh resolution and geometric approximation drive simulation-to-reality accuracy gaps"
    ],
    links: [{ label: "Read report", href: "/docs/nose-cone-analysis.pdf" }],
    document: "/docs/nose-cone-analysis.pdf",
    featured: true,
    accent: "gold",
    chapter: "engineering",
    heroStat: { value: 3, suffix: "", label: "nose cone geometries tested" },
    image: "/images/project-docs/nose-cone-image-p1-1.png",
    gallery: [
      "/images/project-docs/nose-cone-image-p2-1.png",
      "/images/project-docs/nose-cone-image-p2-2.png",
      "/images/project-docs/nose-cone-image-p3-1.png"
    ]
  },
  {
    slug: "glidelounge-sofa-bed",
    name: "Convertible Sofa-Bed System for Camper Van Applications",
    shortTitle: "Sofa-Bed System",
    category: "Engineering Focused",
    dates: "Jan 2025 - May 2025",
    summary: "Deployable camper-van sofa-bed mechanism designed for easier conversion and storage access.",
    description:
      "Led the design of a deployable sofa-bed mechanism for a client seeking improved ergonomics and functionality in a camper van living space.",
    challenge:
      "Developed prototypes, incorporated client feedback, refined hinge/folding/removable-leg designs, conducted FEA studies, fabricated a full-scale prototype, and validated an 82-second conversion with a single user.",
    role: "Client-centered design, mechanism prototyping, CAD, FEA, fabrication, assembly, and validation testing.",
    technologies: ["CAD", "FEA", "Mechanism Design", "Fabrication", "Prototype Testing"],
    achievements: [
      "Validated an 82-second full sofa-to-bed conversion, completed by a single user",
      "Designed, fabricated, and tested a full-scale working prototype, not just a CAD model",
      "Iterated through 5+ concepts and 3 support-leg architectures using FEA and client feedback"
    ],
    links: [{ label: "Read memo", href: "/docs/glidelounge-prototype-memo.pdf" }],
    document: "/docs/glidelounge-prototype-memo.pdf",
    featured: true,
    accent: "teal",
    chapter: "engineering",
    alsoFeaturedIn: ["building"],
    heroStat: { value: 82, suffix: "s", label: "full conversion time" },
    image: "/images/project-docs/glidelounge-image-p1-1.png",
    gallery: [
      "/images/project-docs/glidelounge-image-p1-2.png",
      "/images/project-docs/glidelounge-image-p4-1.png",
      "/images/project-docs/glidelounge-image-p5-3.png"
    ]
  },
  {
    slug: "apollyon-i-rocketry",
    name: "Apollyon I — High-Power Competition Rocketry",
    shortTitle: "Apollyon I",
    category: "Engineering Focused",
    dates: "Sep 2025 - Jun 2026",
    summary: "High-power competition rocket — 95.2% of target altitude, 13,496 pts at 2026 FAR Unlimited.",
    description:
      "Led propulsion and structures for Harvey Mudd's Muddrocket team — designing, manufacturing, and flying Apollyon I to 11,423 ft at the 2026 FAR Unlimited competition. Built from composite airframe to dual-deployment recovery, this rocket flew to 95.2% of its 12,000 ft target and earned 13,496 total competition points.",
    challenge:
      "Motor selection and propulsion analysis, composite airframe design and in-house manufacturing, fin geometry optimization, recovery system deployment sequencing, and integrating avionics for dual-deployment staging.",
    role: "Propulsion & Structures — motor selection, airframe design, fin geometry, recovery system engineering, payload integration, and launch operations.",
    technologies: ["OpenRocket", "SolidWorks", "Composite Manufacturing", "High-Power Rocketry", "Avionics", "Flight Dynamics"],
    achievements: [
      "Flew to 11,423 ft — 95.2% of the 12,000 ft target — at the 2026 FAR Unlimited competition",
      "Scored 13,496 total competition points, placing in the top tier among all competing universities",
      "Flew live video and 100G-force experiments as additional payloads alongside the primary altitude mission",
      "Designed composite airframe with aluminum fin can and fiberglass body tubes, manufactured in-house",
      "Engineered dual-deployment recovery sequence — drogue at apogee, main at 700 ft — targeting sub-25 fps landing",
      "Ran OpenRocket simulations converging on motor selection with predicted apogee within 3% of actual"
    ],
    links: [],
    image: "/images/apollyon-exploded-cad.png",
    video: "/videos/apollyon-launch.mp4",
    gallery: ["/images/apollyon-competition-results.jpg"],
    featured: true,
    accent: "orange",
    chapter: "engineering",
    heroStat: { value: 11423, suffix: "ft", label: "altitude achieved at FAR Unlimited 2026" }
  },
  {
    slug: "jarvis-ai-assistant",
    name: "Jarvis — Local Voice-Controlled AI Desktop Assistant",
    shortTitle: "Jarvis AI",
    category: "Engineering Focused",
    dates: "Jan 2026 - Present",
    summary: "Python AI assistant that listens, reasons, and acts — browser, files, apps, and desktop automation.",
    description:
      "Built a fully local voice AI assistant that converts speech to intent, calls GPT-4o mini with structured tool-calling, then executes the result — opening browsers, launching apps, searching the web, reading your clipboard, and automating multi-step workflows. Designed as a 40+ module system from the ground up.",
    challenge:
      "Architected a composable tool dispatch system where the LLM picks the right tool with validated arguments, retries on failure, traces every execution, and recovers gracefully. Extended to support vision-guided automation, persistent memory with hybrid semantic search, and self-healing workflow playback.",
    role: "Solo architect and engineer — designed the full pipeline from voice I/O through LLM integration, tool dispatch, execution tracing, persistent memory, and vision-guided desktop automation.",
    technologies: ["Python", "GPT-4o mini", "OpenAI Tool Calling", "SQLite", "PyAutoGUI", "pynput", "Speech Recognition", "Tesseract OCR"],
    achievements: [
      "Built a full LLM tool-calling pipeline with structured intent parsing, retry/timeout policy, and per-request execution tracing",
      "Wired hybrid keyword + OpenAI-embedding memory search into every LLM call — the assistant remembers and contextualizes",
      "Designed a self-healing workflow recorder/player with vision-guided UI anchoring and graduated recovery strategies",
      "Architected 40+ modules spanning voice I/O, LLM integration, multi-step planning, and desktop automation — zero frameworks, pure Python"
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/davidliu06/jarvis-v1" }
    ],
    githubUrl: "https://github.com/davidliu06/jarvis-v1",
    featured: true,
    accent: "blue",
    chapter: "ai",
    heroStat: { value: 40, suffix: "+", label: "architecture modules" }
  }
];
