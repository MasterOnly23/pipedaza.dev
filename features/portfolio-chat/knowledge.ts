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
    quickQuestions: ["¿Quién es Juan Felipe?"],
    deterministicAnswer:
      "Juan Felipe Daza es Software Developer y desarrollador Full Stack. Su trabajo público se centra en construir sistemas y productos digitales útiles.",
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
      "what does he build",
      "what does he do",
    ],
    facts: [
      "Desarrolla aplicaciones web, herramientas internas, automatizaciones y productos propios.",
      "Su enfoque público combina entender el problema, construir el sistema y cuidar la experiencia de uso.",
    ],
    quickQuestions: ["¿Qué construye Juan Felipe?"],
    deterministicAnswer:
      "Desarrolla aplicaciones web, herramientas internas, automatizaciones y productos propios. También le interesa entender el problema y cuidar la experiencia de uso.",
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
    quickQuestions: ["¿Qué tecnologías utiliza?"],
    deterministicAnswer:
      "Su stack público incluye Python, Django, JavaScript, TypeScript, React, Next.js, SQL y FastAPI.",
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
    quickQuestions: ["Cuéntame sobre PartyUp"],
    deterministicAnswer:
      "PartyUp es un producto social/gaming para encontrar jugadores compatibles, crear grupos y organizar partidas. Está en desarrollo con React, Django y WebSockets.",
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
    quickQuestions: ["¿Qué es ZentraStock?"],
    deterministicAnswer:
      "ZentraStock es una herramienta de control de inventario, lotes, vencimientos y movimientos. Su stack público incluye React, Django y PostgreSQL.",
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
    quickQuestions: ["¿Cómo contacto a Juan Felipe?"],
    deterministicAnswer:
      "Puedes escribir a pipedaza.dev@gmail.com o revisar el GitHub público de Juan Felipe.",
    links: [
      { label: "Enviar email", url: allowedUrl("email") },
      githubLink,
    ],
  },
];
