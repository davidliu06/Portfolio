import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    slug: "autonomous-underwater-vehicle",
    name: "Autonomous Underwater Robot",
    category: "Engineering Focused",
    dates: "Jan 2026 - May 2026",
    summary: "Embedded sensing and depth-control AUV for environmental monitoring at Dana Point.",
    description:
      "Designed, deployed, and analyzed an autonomous underwater vehicle that collected pH, temperature, turbidity, and pressure data to evaluate water-quality indicators across depths from 0 to 2 meters.",
    challenge:
      "Integrated four sensing systems, designed signal-conditioning circuits, calibrated sensors with MATLAB models, and used pressure feedback for autonomous depth tracking.",
    role: "Sensor integration, analog circuits, calibration, controls, field testing, and data analysis.",
    technologies: ["Embedded Systems", "Analog Circuit Design", "Teensy 4.0", "Arduino", "MATLAB", "AUV"],
    links: [{ label: "Read report", href: "/docs/auv-final-report.pdf" }],
    document: "/docs/auv-final-report.pdf",
    featured: true,
    accent: "blue",
    image: "/images/portfolio/portfolio-image-p2-1.png"
  },
  {
    slug: "aerodynamic-nose-cones",
    name: "Computational and Experimental Aerodynamic Analysis of Nose Cone Geometries",
    category: "Engineering Focused",
    dates: "Jan 2026 - May 2026",
    summary: "CFD and wind tunnel comparison of flat, rounded, and pointed nose cone geometries.",
    description:
      "Investigated aerodynamic drag through wind tunnel testing and COMSOL CFD simulation. Airflow velocities were measured with a Pitot tube and digital manometer, and drag forces were quantified using an LVDT.",
    challenge:
      "Validated simulation trends against physical testing and analyzed how mesh resolution, geometric approximation, and testing conditions affected accuracy.",
    role: "CFD modeling, experimental setup, wind tunnel testing, data analysis, and report writing.",
    technologies: ["COMSOL", "CFD", "Wind Tunnel", "Pitot Tube", "LVDT", "Fluid Mechanics"],
    links: [{ label: "Read report", href: "/docs/nose-cone-analysis.pdf" }],
    document: "/docs/nose-cone-analysis.pdf",
    featured: true,
    accent: "gold",
    image: "/images/project-docs/nose-cone-image-p1-1.png"
  },
  {
    slug: "glidelounge-sofa-bed",
    name: "Convertible Sofa-Bed System for Camper Van Applications",
    category: "Engineering Focused",
    dates: "Jan 2025 - May 2025",
    summary: "Deployable camper-van sofa-bed mechanism designed for easier conversion and storage access.",
    description:
      "Led the design of a deployable sofa-bed mechanism for a client seeking improved ergonomics and functionality in a camper van living space.",
    challenge:
      "Developed prototypes, incorporated client feedback, refined hinge/folding/removable-leg designs, conducted FEA studies, fabricated a full-scale prototype, and validated an 82-second conversion with a single user.",
    role: "Client-centered design, mechanism prototyping, CAD, FEA, fabrication, assembly, and validation testing.",
    technologies: ["CAD", "FEA", "Mechanism Design", "Fabrication", "Prototype Testing"],
    links: [{ label: "Read memo", href: "/docs/glidelounge-prototype-memo.pdf" }],
    document: "/docs/glidelounge-prototype-memo.pdf",
    featured: true,
    accent: "teal",
    image: "/images/project-docs/glidelounge-image-p1-1.png"
  }
];
