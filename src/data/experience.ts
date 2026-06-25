import type { Experience } from "@/types/portfolio";

export const experience: Experience[] = [
  {
    organization: "MRP Solutions",
    role: "Electro-Mechanical Engineering Intern",
    dates: "June 2026 - Present",
    location: "Plattsburgh, NY",
    type: "Internship",
    bullets: [
      "Designed 10+ mechanical assemblies, machine guards, and access-control systems in SolidWorks for automated manufacturing equipment.",
      "Engineered retrofit locking systems and custom sheet-metal components for production machinery.",
      "Troubleshot integrated electro-mechanical systems across mechanical, electrical, and process-related failures.",
      "Conducted equipment testing, calibration, and validation to support engineering modifications and improve reliability."
    ],
    tools: ["SolidWorks", "Sheet Metal", "Manufacturing", "Validation", "Electro-Mechanical Systems"],
    chapter: "engineering"
  },
  {
    organization: "Mudd Amateur Rocketry Club",
    role: "Propulsion Lead",
    dates: "August 2024 - Present",
    location: "Harvey Mudd College",
    type: "Leadership",
    bullets: [
      "Led mechanical development of Apollyon I, a full-M-class FAR Unlimited competition rocket, coordinating 40+ members across propulsion, structures, avionics, recovery, and simulation to achieve 1st Place at FAR Unlimited 2026.",
      "Directed systems integration and launch-readiness reviews across 5 subteams, driving design decisions throughout the development cycle.",
      "Evaluated 10+ configurations for motor selection, stability margins, recovery sizing, and composite airframe design using OpenRocket, RASAero II, MATLAB, SolidWorks, and COMSOL.",
      "Manufactured and integrated flight hardware for Gladius III, contributing to a 3rd Place finish (2025) and validating simulations against flight data with 99.95% apogee accuracy."
    ],
    tools: ["OpenRocket", "RASAero II", "MATLAB", "SolidWorks", "COMSOL", "Systems Integration", "Propulsion"],
    chapter: "engineering",
    alsoFeaturedIn: ["systems"]
  },
  {
    organization: "Mudd Automotive Club: Hybrids",
    role: "Engineering Team Member",
    dates: "August 2024 - Present",
    location: "Harvey Mudd College",
    type: "Club",
    bullets: [
      "Contributed to the design and manufacturing of a student-built hybrid vehicle.",
      "Supported powertrain integration, braking systems, steering architecture, structural frame work, and front-end assemblies.",
      "Developed SolidWorks models and assemblies, then translated designs into manufacturable parts through machining, assembly, and testing."
    ],
    tools: ["SolidWorks", "Vehicle Design", "Machining", "Manufacturing", "System Testing"],
    image: "/images/experience/mach.png",
    imageAlt: "Mudd Automotive Club Hybrids team with vehicle frame",
    chapter: "engineering",
    alsoFeaturedIn: ["systems"]
  },
  {
    organization: "MuddSub / Harvey Mudd RoboSub Team",
    role: "Mechanical and Electrical Team Member",
    dates: "August 2024 - Present",
    location: "Harvey Mudd College",
    type: "Club",
    bullets: [
      "Designed and prototyped a torpedo release mechanism for an autonomous underwater vehicle.",
      "Performed COMSOL FEA to evaluate stress concentrations and deformation under operational loading.",
      "Redesigned PCB layout to improve signal routing reliability and reduce electrical noise in underwater environments."
    ],
    tools: ["AUVs", "COMSOL", "FEA", "PCB Layout", "Mechanism Design"],
    image: "/images/experience/muddsub-2.png",
    imageAlt: "MuddSub autonomous underwater vehicle CAD model",
    chapter: "engineering"
  },
  {
    organization: "Harvey Mudd College",
    role: "Lab TA, Tutor, and Grader",
    dates: "August 2025 - Present",
    location: "Claremont, CA",
    type: "Leadership",
    bullets: [
      "Supported laboratory instruction in General Chemistry, assisting with experimental setup, troubleshooting, and safety compliance.",
      "Tutored students in programming (Python/MATLAB), calculus, and chemistry, strengthening structured problem-solving and debugging skills.",
      "Evaluated lab reports and assignments, providing clear, actionable technical feedback to improve analytical accuracy and code quality."
    ],
    tools: ["Leadership", "Communication", "Python", "MATLAB", "Chemistry"],
    chapter: "research"
  },
  {
    organization: "INVITE Institute, UIUC",
    role: "Undergraduate Researcher - INVITE Institute REU",
    dates: "May 2025 - August 2025",
    location: "Urbana-Champaign, IL",
    type: "Research",
    bullets: [
      "Developed LLM-based tools to analyze structured student performance datasets.",
      "Designed synthetic datasets to evaluate model robustness and retrieval accuracy.",
      "Built Python pipelines for data cleaning, structuring, and statistical evaluation.",
      "Conducted quantitative analysis using performance metrics and error evaluation."
    ],
    tools: ["Python", "LLMs", "Data Analysis", "Synthetic Data", "Evaluation"],
    image: "/images/experience/invite.png",
    imageAlt: "INVITE Institute logo",
    chapter: "research",
    alsoFeaturedIn: ["ai"]
  },
  {
    organization: "Project Think",
    role: "Engineering Teacher",
    dates: "May 2025 - August 2025",
    location: "Internship",
    type: "Internship",
    bullets: [
      "Created and delivered lesson plans for 100+ students in grades 4-8 on designing and programming robots through the Hummingbird Kit.",
      "Introduced students to engineering and STEM pathways.",
      "Taught block coding, robotics, collaboration, problem solving, and advanced computing concepts."
    ],
    tools: ["Engineering Design", "Robotics", "Teaching", "Block Coding", "STEM Education"],
    chapter: "building"
  },
  {
    organization: "Harvey Mudd College",
    role: "Undergraduate Researcher - Degrees of Freedom Project (DOFPro)",
    dates: "January 2025 - May 2025",
    location: "Claremont, CA",
    type: "Research",
    bullets: [
      "Produced engaging lecture materials for Principles of Chemical and Thermal Processes using Reveal.js, LaTeX, and video editing.",
      "Published educational resources on the Degrees of Freedom Project website."
    ],
    tools: ["Reveal.js", "LaTeX", "Video Editing", "Educational Research"],
    image: "/images/experience/dofpro.png",
    imageAlt: "DOFPro logo",
    chapter: "research"
  },
  {
    organization: "ChemTalk",
    role: "Writer",
    dates: "June 2023 - March 2024",
    location: "Remote",
    type: "Internship",
    bullets: [
      "Authored educational chemistry articles and lessons for general audiences.",
      "Implemented LaTeX formatting for high-quality publication on the ChemTalk website."
    ],
    tools: ["Scientific Research", "Writing", "LaTeX", "Chemistry Communication"],
    image: "/images/experience/chemtalk.png",
    imageAlt: "ChemTalk logo",
    chapter: "research"
  }
];
