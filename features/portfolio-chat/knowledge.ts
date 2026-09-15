import type { AllowedLink, KnowledgeTopic } from "./types";

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
    ],
    facts: [
      "Juan Felipe Daza es Software Developer y desarrollador Full Stack.",
      "Su trabajo público se centra en construir sistemas y productos digitales útiles.",
    ],
    factsEn: [
      "Juan Felipe Daza is a Software Developer and Full Stack developer.",
      "His public work focuses on building useful systems and digital products.",
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
      "what products does he build",
      "what products does he develop",
      "what systems does he build",
      "what systems does he develop",
      "what kinds of systems",
    ],
    facts: [
      "Desarrolla aplicaciones web, herramientas internas, automatizaciones y productos propios.",
      "Su enfoque público combina entender el problema, construir el sistema y cuidar la experiencia de uso.",
    ],
    factsEn: [
      "He develops web applications, internal tools, automations, and personal products.",
      "His public approach combines understanding the problem, building the system, and caring about the user experience.",
    ],
    quickQuestions: ["¿Qué construye Juan Felipe?"],
    deterministicAnswer:
      "Desarrolla aplicaciones web, herramientas internas, automatizaciones y productos propios. También le interesa entender el problema y cuidar la experiencia de uso.",
    deterministicAnswerEn:
      "He develops web applications, internal tools, automations, and personal products. He also cares about understanding the problem and the user experience.",
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
    ],
    facts: [
      "Su stack público incluye Python, Django, JavaScript, TypeScript, React, Next.js, SQL y FastAPI.",
    ],
    factsEn: [
      "His public stack includes Python, Django, JavaScript, TypeScript, React, Next.js, SQL, and FastAPI.",
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
    ],
    facts: [
      "PartyUp es un producto social/gaming para encontrar jugadores compatibles, crear grupos y organizar partidas.",
      "PartyUp está en desarrollo.",
      "Su stack público incluye React, Django y WebSockets.",
    ],
    factsEn: [
      "PartyUp is a social/gaming product for finding compatible players, creating groups, and organizing matches.",
      "PartyUp is in development.",
      "Its public stack includes React, Django, and WebSockets.",
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
    ],
    facts: [
      "ZentraStock es una herramienta de control de inventario, lotes, vencimientos y movimientos.",
      "Su stack público incluye React, Django y PostgreSQL.",
      "ZentraStock tiene una demo pública.",
    ],
    factsEn: [
      "ZentraStock is an inventory, lot, expiration, and movement control tool.",
      "Its public stack includes React, Django, and PostgreSQL.",
      "ZentraStock has a public demo.",
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
    ],
    facts: [
      "El email público de contacto es pipedaza.dev@gmail.com.",
      "También hay un perfil público de GitHub con sus repositorios.",
    ],
    factsEn: [
      "The public contact email is pipedaza.dev@gmail.com.",
      "There is also a public GitHub profile with his repositories.",
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
