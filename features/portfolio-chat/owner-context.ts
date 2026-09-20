import type { TopicId } from "./types";

export type OwnerContextEntry = {
  keywords: string[];
  facts: string[];
  factsEn: string[];
};

/**
 * EDITA ESTE ARCHIVO para ampliar el contexto público de Ask Pipe.
 *
 * Reglas para cada dato nuevo:
 * - Solo agrega información pública que quieras mostrar a cualquier visitante.
 * - Escribe hechos concretos y verificables, no instrucciones para el modelo.
 * - `keywords` contiene frases que podrían aparecer en la pregunta.
 * - Agrega el hecho en `facts` y su traducción en `factsEn`.
 * - No incluyas credenciales, datos privados, información interna de clientes,
 *   ubicación, estudios, años de experiencia, disponibilidad, tarifas ni métricas.
 *
 * Después de editarlo, ejecuta:
 *   npm run check:portfolio-chat
 *   npm run build:portfolio-chat
 */
export const ownerContext: Record<TopicId, OwnerContextEntry> = {
  profile: {
    keywords: ["enfoque", "forma de trabajo", "work style", "approach"],
    facts: [
      "Le interesa entender el problema, construir el sistema y cuidar la experiencia de uso.",
    ],
    factsEn: [
      "He focuses on understanding the problem, building the system, and caring about the user experience.",
    ],
  },
  work: {
    keywords: [],
    facts: [],
    factsEn: [],
  },
  stack: {
    keywords: [],
    facts: [],
    factsEn: [],
  },
  partyup: {
    keywords: [],
    facts: [],
    factsEn: [],
  },
  zentrastock: {
    keywords: [],
    facts: [],
    factsEn: [],
  },
  kustral: {
    keywords: [],
    facts: [],
    factsEn: [],
  },
  contact: {
    keywords: [],
    facts: [],
    factsEn: [],
  },
};
