import { allowedLinks, knowledge } from "./knowledge";
import type { AllowedLink, KnowledgeTopic } from "./types";

export const FALLBACK_ANSWER =
  "Solo puedo responder preguntas sobre Juan Felipe, sus proyectos, su stack y sus formas públicas de contacto.";

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
const MAX_QUESTION_LENGTH = 280;
const TOPIC_LABELS: Record<KnowledgeTopic["id"], string> = {
  profile: "perfil",
  work: "trabajo",
  stack: "stack",
  partyup: "PartyUp",
  zentrastock: "ZentraStock",
  contact: "contacto",
};

export function normalizeQuestion(input: string): string {
  return String(input ?? "")
    .replace(CONTROL_CHARACTERS, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateQuestion(
  input: string,
): { ok: true; value: string } | { ok: false; reason: string } {
  if (typeof input !== "string") {
    return { ok: false, reason: "Escribe una pregunta para continuar." };
  }

  const value = input.replace(CONTROL_CHARACTERS, "").trim();
  const length = Array.from(value).length;

  if (length < 2) {
    return { ok: false, reason: "Escribe una pregunta de al menos 2 caracteres." };
  }

  if (length > MAX_QUESTION_LENGTH) {
    return {
      ok: false,
      reason: `La pregunta no puede superar ${MAX_QUESTION_LENGTH} caracteres.`,
    };
  }

  return { ok: true, value };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsCompleteAlias(text: string, alias: string): boolean {
  const normalizedAlias = normalizeQuestion(alias);
  if (!normalizedAlias) return false;

  const boundary = `(?:^|[^\\p{L}\\p{N}])${escapeRegExp(normalizedAlias)}(?=$|[^\\p{L}\\p{N}])`;
  return new RegExp(boundary, "u").test(text);
}

export function selectTopics(question: string): KnowledgeTopic[] {
  const normalized = normalizeQuestion(question);
  if (!normalized) return [];
  if (isGeneralOrCodeRequest(normalized)) return [];

  const scored = knowledge
    .map((topic, index) => {
      const matches = topic.keywords.filter((keyword) =>
        containsCompleteAlias(normalized, keyword),
      );
      const score = matches.reduce(
        (total, keyword) => total + Math.max(1, keyword.length / 8),
        0,
      );
      return { topic, index, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 3)
    .sort((left, right) => left.index - right.index);

  return scored.map((entry) => entry.topic);
}

const GENERAL_OR_CODE_PATTERNS = [
  /\b(escribe|write|crea|create|programa|program|codigo|code|funcion|function)\b/u,
  /\b(capital|capital city|weather|clima|recipe|receta|news|noticias)\b/u,
];

function isGeneralOrCodeRequest(normalizedQuestion: string): boolean {
  return GENERAL_OR_CODE_PATTERNS.some((pattern) => pattern.test(normalizedQuestion));
}

const INJECTION_PATTERNS = [
  /\bignora\b.*\b(reglas|instrucciones|anteriores|prompt|sistema)\b/u,
  /\b(ignore|disregard|forget|override)\b.*\b(previous|rules|instructions|system|prompt)\b/u,
  /\b(mensaje|system)\s+(del\s+)?sistema\b/u,
  /\b(system\s+prompt|system\s+message|prompt\s+del\s+sistema)\b/u,
  /\b(revela|reveal|muestra|show|dime|tell me)\b.*\b(prompt|secreto|secret|clave|instructions|instrucciones)\b/u,
  /\b(actua como|actúa como|pretend|roleplay|eres otra ia|be another ai)\b/u,
  /\bjailbreak\b/u,
];

export function isInjectionLike(question: string): boolean {
  const normalized = normalizeQuestion(question);
  return INJECTION_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function sanitizeQuestionForModel(
  question: string,
  topics: KnowledgeTopic[],
): string {
  const labels = topics.map((topic) => TOPIC_LABELS[topic.id]).join(" y ");
  if (isInjectionLike(question)) {
    return `El visitante pregunta por los temas públicos: ${labels}. Responde únicamente con los hechos proporcionados sobre esos temas.`;
  }

  const validated = validateQuestion(question);
  return `Pregunta del visitante: ${validated.ok ? validated.value : ""}`;
}

export function findQuickResponse(
  question: string,
): { answer: string; links: AllowedLink[] } | null {
  const normalized = normalizeQuestion(question);
  for (const topic of knowledge) {
    if (
      topic.deterministicAnswer &&
      topic.quickQuestions.some(
        (quickQuestion) => normalizeQuestion(quickQuestion) === normalized,
      )
    ) {
      return {
        answer: topic.deterministicAnswer,
        links: linksForTopics([topic]),
      };
    }
  }
  return null;
}

export function linksForTopics(topics: KnowledgeTopic[]): AllowedLink[] {
  const seen = new Set<string>();
  const links: AllowedLink[] = [];

  for (const topic of topics) {
    for (const link of topic.links ?? []) {
      if (!Array.from(allowedLinks.values()).includes(link.url)) continue;
      if (seen.has(link.url)) continue;
      seen.add(link.url);
      links.push({ label: link.label, url: link.url });
    }
  }

  return links;
}

const UNSUPPORTED_CLAIM_PATTERNS = [
  /\b(cliente|clientes|client|clients)\b/iu,
  /\b(años? de experiencia|years? of experience)\b/iu,
  /\b(ubicad[oa]|vive|reside|location|located)\b/iu,
  /\b(estudios|educacion|education|degree|universidad|university)\b/iu,
  /\b(disponibilidad|availability|freelance|tarifa|rate|precio|price|salario|salary)\b/iu,
  /\b(usuarios|users|ingresos|revenue|metricas|metrics|lanzamiento|launch date)\b/iu,
  /\b(system prompt|system message|prompt del sistema|secreto|secret)\b/iu,
];

function hasUnsupportedClaim(answer: string, topics: KnowledgeTopic[]): boolean {
  const knownFacts = normalizeQuestion(topics.flatMap((topic) => topic.facts).join(" "));
  return UNSUPPORTED_CLAIM_PATTERNS.some(
    (pattern) => pattern.test(answer) && !pattern.test(knownFacts),
  );
}

function removeRepeatedFragments(answer: string): string {
  const fragments = answer
    .split(/\n+|(?<=[.!?])\s{2,}/u)
    .map((fragment) => fragment.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  return fragments
    .filter((fragment) => {
      const key = normalizeQuestion(fragment);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function limitAnswer(answer: string): string {
  const characters = Array.from(answer);
  if (characters.length <= 600) return answer;

  const clipped = characters.slice(0, 600).join("");
  const boundary = clipped.lastIndexOf(" ");
  const readable = boundary > 360 ? clipped.slice(0, boundary) : clipped;
  return `${readable.trimEnd()}…`;
}

export function postValidateAnswer(
  rawAnswer: string,
  topics: KnowledgeTopic[],
): string {
  const answer = String(rawAnswer ?? "")
    .replace(CONTROL_CHARACTERS, " ")
    .replace(/\b(?:https?:\/\/|www\.)[^\s<>"']+/giu, "")
    .trim();
  const cleaned = removeRepeatedFragments(answer);

  if (!cleaned || hasUnsupportedClaim(cleaned, topics)) {
    return "No tengo información pública suficiente sobre eso.";
  }

  return limitAnswer(cleaned);
}
