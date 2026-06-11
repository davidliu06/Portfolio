import type { SkillGroup } from "@/types/portfolio";

export const skills: SkillGroup[] = [
  {
    category: "Mechanical Engineering",
    icon: "Cog",
    skills: ["Mechanism design", "GD&T", "Materials selection", "Vehicle systems", "Design for assembly"],
    strength: 88
  },
  {
    category: "CAD and Simulation",
    icon: "DraftingCompass",
    skills: ["SolidWorks", "Engineering drawings", "FEA", "CFD", "COMSOL"],
    strength: 84
  },
  {
    category: "Robotics",
    icon: "Bot",
    skills: ["AUVs", "RoboSub", "Autonomous systems", "Sensors", "Closed-loop control"],
    strength: 86
  },
  {
    category: "Programming",
    icon: "Code2",
    skills: ["Python", "MATLAB", "C++", "Java", "LabVIEW", "Arduino IDE"],
    strength: 78
  },
  {
    category: "Electronics",
    icon: "CircuitBoard",
    skills: ["Circuit design", "Signal conditioning", "Teensy 4.0", "PCB layout", "Noise reduction"],
    strength: 76
  },
  {
    category: "Aerospace and Defense",
    icon: "Rocket",
    skills: ["Aerodynamics", "Wind tunnel testing", "Reliability", "Vehicle design", "Mission-focused systems"],
    strength: 80
  }
];
