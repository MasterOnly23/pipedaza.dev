import type { AllowedLink, KnowledgeTopic } from "./types";
import { ownerContext } from "./owner-context";

export const allowedLinks = new Map<string, string>([
  ["partyup", "https://partyup.pipedaza.dev/"],
  ["zentrastock", "https://zentrastock.pipedaza.dev/"],
  ["github", "https://github.com/MasterOnly23?tab=repositories"],
  ["email", "mailto:pipedaza.dev@gmail.com"],
]);

function allowedUrl(key: string): string {
  const url = allowedLinks.get(key);
  if (!url) {
    throw new Error(`Missing allowlisted link: ${key}`);
  }
  return url;
}

const githubLink: AllowedLink = {
  label: "GitHub público",
  url: allowedUrl("github"),
};

export const knowledge: KnowledgeTopic[] = [
  {
    id: "profile",
    keywords: [
      "juan felipe daza",
      "tell me about juan felipe",
      "tell me about juan felipe daza",
      "about juan felipe",
      "about juan felipe daza",
      "who is juan felipe",
      "who is juan felipe daza",
      "sobre juan felipe",
      "quien",
      "who",
      "perfil",
      "profile",
      "rol",
      "role",
      "software developer",
      "full stack",
      "fullstack",
      ...ownerContext.profile.keywords,
    ],
    facts: [
      "Juan Felipe Daza es Software Developer y desarrollador Full Stack.",
      "Su trabajo público se centra en construir sistemas y productos digitales útiles.",
      ...ownerContext.profile.facts,
    ],
    factsEn: [
      "Juan Felipe Daza is a Software Developer and Full Stack developer.",
      "His public work focuses on building useful systems and digital products.",
      ...ownerContext.profile.factsEn,
    ],
    quickQuestions: ["¿Quién es Juan Felipe?"],
    deterministicAnswer:
      "Juan Felipe Daza es Software Developer y desarrollador Full Stack. Su trabajo público se centra en construir sistemas y productos digitales útiles.",
    deterministicAnswerEn:
      "Juan Felipe Daza is a Software Developer and Full Stack developer. His public work focuses on building useful systems and digital products.",
    links: [githubLink],
  },
  {
    id: "work",
    keywords: [
      "construye",
      "construir",
      "desarrolla",
      "desarrollar",
      "que hace",
      "a que se dedica",
      "que desarrolla",
      "proyecto",
      "proyectos",
      "project",
      "projects",
      "portfolio",
      "portafolio",
      "en que trabaja",
      "sus proyectos",
      "trabajo",
      "work",
      "aplicaciones web",
      "herramientas internas",
      "automatizaciones",
      "productos propios",
      "sistemas",
      "web applications",
      "internal tools",
      "automations",
      "own products",
      "what does he build",
      "what does he do",
      "what does he work on",
      "what does juan felipe build",
      "what does juan felipe do",
      "what kind of products",
      "what kinds of products",
      "what projects",
      "which projects",
      "his projects",
      "what are his projects",
      "what are your projects",
      "what products does he build",
      "what products does he develop",
      "what systems does he build",
      "what systems does he develop",
      "what kinds of systems",
      ...ownerContext.work.keywords,
    ],
    facts: [
      "Sus proyectos destacados incluyen ZentraStock, PartyUp y Kustral Finanzas. ZentraStock tiene una demo pública, PartyUp está en desarrollo y Kustral Finanzas es un proyecto privado en producción sin acceso público.",
      "Desarrolla aplicaciones web, herramientas internas, automatizaciones y productos propios.",
      "Su enfoque público combina entender el problema, construir el sistema y cuidar la experiencia de uso.",
      ...ownerContext.work.facts,
    ],
    factsEn: [
      "His featured projects include ZentraStock, PartyUp, and Kustral Finanzas. ZentraStock has a public demo, PartyUp is in development, and Kustral Finanzas is a private production project without public access.",
      "He develops web applications, internal tools, automations, and personal products.",
      "His public approach combines understanding the problem, building the system, and caring about the user experience.",
      ...ownerContext.work.factsEn,
    ],
    quickQuestions: ["¿Qué construye Juan Felipe?"],
    deterministicAnswer:
      "Sus proyectos destacados incluyen ZentraStock, PartyUp y Kustral Finanzas. Además desarrolla aplicaciones web, herramientas internas, automatizaciones y productos propios.",
    deterministicAnswerEn:
      "His featured projects include ZentraStock, PartyUp, and Kustral Finanzas. He also develops web applications, internal tools, automations, and personal products.",
  },
  {
    id: "stack",
    keywords: [
      "tecnologia",
      "tecnologias",
      "technology",
      "technologies",
      "stack",
      "python",
      "django",
      "javascript",
      "typescript",
      "react",
      "next.js",
      "nextjs",
      "sql",
      "fastapi",
      ...ownerContext.stack.keywords,
    ],
    facts: [
      "Su stack público incluye Python, Django, JavaScript, TypeScript, React, Next.js, SQL y FastAPI.",
      ...ownerContext.stack.facts,
    ],
    factsEn: [
      "His public stack includes Python, Django, JavaScript, TypeScript, React, Next.js, SQL, and FastAPI.",
      ...ownerContext.stack.factsEn,
    ],
    quickQuestions: ["¿Qué tecnologías utiliza?"],
    deterministicAnswer:
      "Su stack público incluye Python, Django, JavaScript, TypeScript, React, Next.js, SQL y FastAPI.",
    deterministicAnswerEn:
      "His public stack includes Python, Django, JavaScript, TypeScript, React, Next.js, SQL, and FastAPI.",
  },
  {
    id: "partyup",
    keywords: [
      "partyup",
      "gaming",
      "jugar",
      "jugadores",
      "grupos",
      "partidas",
      "social gaming",
      "squad",
      ...ownerContext.partyup.keywords,
    ],
    facts: [
      "PartyUp es un producto social/gaming para encontrar jugadores compatibles, crear grupos y organizar partidas.",
      "PartyUp está en desarrollo.",
      "Su stack público incluye React, Django y WebSockets.",
      ...ownerContext.partyup.facts,
    ],
    factsEn: [
      "PartyUp is a social/gaming product for finding compatible players, creating groups, and organizing matches.",
      "PartyUp is in development.",
      "Its public stack includes React, Django, and WebSockets.",
      ...ownerContext.partyup.factsEn,
    ],
    quickQuestions: ["Cuéntame sobre PartyUp"],
    deterministicAnswer:
      "PartyUp es un producto social/gaming para encontrar jugadores compatibles, crear grupos y organizar partidas. Está en desarrollo con React, Django y WebSockets.",
    deterministicAnswerEn:
      "PartyUp is a social/gaming product for finding compatible players, creating groups, and organizing matches. It is in development with React, Django, and WebSockets.",
    links: [
      { label: "Abrir PartyUp", url: allowedUrl("partyup") },
    ],
  },
  {
    id: "zentrastock",
    keywords: [
      "zentrastock",
      "inventory",
      "inventario",
      "lotes",
      "vencimientos",
      "movimientos",
      "stock",
      ...ownerContext.zentrastock.keywords,
    ],
    facts: [
      "ZentraStock es una herramienta de control de inventario, lotes, vencimientos y movimientos.",
      "Su stack público incluye React, Django y PostgreSQL.",
      "ZentraStock tiene una demo pública.",
      ...ownerContext.zentrastock.facts,
    ],
    factsEn: [
      "ZentraStock is an inventory, lot, expiration, and movement control tool.",
      "Its public stack includes React, Django, and PostgreSQL.",
      "ZentraStock has a public demo.",
      ...ownerContext.zentrastock.factsEn,
    ],
    quickQuestions: ["¿Qué es ZentraStock?"],
    deterministicAnswer:
      "ZentraStock es una herramienta de control de inventario, lotes, vencimientos y movimientos. Su stack público incluye React, Django y PostgreSQL.",
    deterministicAnswerEn:
      "ZentraStock is an inventory, lot, expiration, and movement control tool. Its public stack includes React, Django, and PostgreSQL.",
    links: [
      { label: "Abrir ZentraStock", url: allowedUrl("zentrastock") },
    ],
  },
  {
    id: "kustral",
    keywords: [
      "kustral",
      "kustral finanzas",
      "finanzas",
      "financial operations",
      "ocr",
      ...ownerContext.kustral.keywords,
    ],
    facts: [
      "Kustral Finanzas es un backoffice financiero privado construido para un cliente.",
      "Centraliza operaciones, documentación y control diario con automatización OCR, permisos por rol y trazabilidad.",
      "Está en producción y no tiene acceso público.",
      "Su stack público incluye React, Django, PostgreSQL y OCR.",
      ...ownerContext.kustral.facts,
    ],
    factsEn: [
      "Kustral Finanzas is a private financial back office built for a client.",
      "It centralizes operations, documentation, and daily control with OCR automation, role-based permissions, and traceability.",
      "It is in production and has no public access.",
      "Its public stack includes React, Django, PostgreSQL, and OCR.",
      ...ownerContext.kustral.factsEn,
    ],
    quickQuestions: ["¿Qué es Kustral Finanzas?"],
    deterministicAnswer:
      "Kustral Finanzas es un backoffice financiero privado construido para un cliente. Está en producción y centraliza operaciones, documentación y control diario con OCR, permisos por rol y trazabilidad; no tiene acceso público.",
    deterministicAnswerEn:
      "Kustral Finanzas is a private financial back office built for a client. It is in production and centralizes operations, documentation, and daily control with OCR, role-based permissions, and traceability; it has no public access.",
  },
  {
    id: "contact",
    keywords: [
      "contacto",
      "contact",
      "contactar",
      "escribir",
      "correo",
      "email",
      "github",
      "how can i reach",
      "como puedo contactar",
      ...ownerContext.contact.keywords,
    ],
    facts: [
      "El email público de contacto es pipedaza.dev@gmail.com.",
      "También hay un perfil público de GitHub con sus repositorios.",
      ...ownerContext.contact.facts,
    ],
    factsEn: [
      "The public contact email is pipedaza.dev@gmail.com.",
      "There is also a public GitHub profile with his repositories.",
      ...ownerContext.contact.factsEn,
    ],
    quickQuestions: ["¿Cómo contacto a Juan Felipe?"],
    deterministicAnswer:
      "Puedes escribir a pipedaza.dev@gmail.com o revisar el GitHub público de Juan Felipe.",
    deterministicAnswerEn:
      "You can email pipedaza.dev@gmail.com or check Juan Felipe's public GitHub profile.",
    links: [
      { label: "Enviar email", url: allowedUrl("email") },
      githubLink,
    ],
  },
];
