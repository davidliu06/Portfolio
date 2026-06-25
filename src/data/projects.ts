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
  }
];
