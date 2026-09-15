export type ProjectCategory = "featured" | "secondary" | "experiment";

export type Project = {
  name: string;
  eyebrow: string;
  description: string;
  stack: string[];
  url: string;
  github?: string;
  status: string;
  category: ProjectCategory;
  accent: "lime" | "coral" | "blue" | "amber";
  index: string;
};

// Portfolio content lives here so adding a project does not require touching the UI.
export const projects: Project[] = [
  {
    name: "PartyUp",
    eyebrow: "Social product / Gaming",
    description:
      "A matchmaking platform built to help players find the right people to play with — without the noise of a generic social network.",
    stack: ["React", "Django", "PostgreSQL"],
    url: "https://partyup.pipedaza.dev",
    github: "https://github.com/pipedaza",
    status: "Building",
    category: "featured",
    accent: "lime",
    index: "01",
  },
  {
    name: "Kustral OCR",
    eyebrow: "Applied AI / Finance",
    description:
      "Document intelligence that turns financial PDFs and images into structured, reviewable data.",
    stack: ["Python", "Django", "OCR"],
    url: "https://kustral.pipedaza.dev",
    github: "https://github.com/pipedaza",
    status: "In production",
    category: "featured",
    accent: "coral",
    index: "02",
  },
  {
    name: "Orbit",
    eyebrow: "Desktop product / Games",
    description:
      "One place to connect game libraries, understand access and explore what to play next.",
    stack: ["TypeScript", "Electron", "React"],
    url: "https://orbit.pipedaza.dev",
    status: "Prototype",
    category: "secondary",
    accent: "blue",
    index: "03",
  },
  {
    name: "Internal Tools",
    eyebrow: "Operations / Automation",
    description:
      "Small, focused systems that replace repetitive workflows with dependable software.",
    stack: ["FastAPI", "SQL", "Automation"],
    url: "https://tools.pipedaza.dev",
    status: "Ongoing",
    category: "secondary",
    accent: "amber",
    index: "04",
  },
  {
    name: "OCR Lab",
    eyebrow: "Computer vision",
    description: "Testing extraction strategies against messy real-world documents.",
    stack: ["Python", "Vision"],
    url: "https://lab.pipedaza.dev/ocr",
    status: "Experiment",
    category: "experiment",
    accent: "coral",
    index: "A1",
  },
  {
    name: "Game Signals",
    eyebrow: "Data experiment",
    description: "A tiny playground for finding patterns across game libraries.",
    stack: ["TypeScript", "Data"],
    url: "https://lab.pipedaza.dev/signals",
    status: "Experiment",
    category: "experiment",
    accent: "blue",
    index: "A2",
  },
];

