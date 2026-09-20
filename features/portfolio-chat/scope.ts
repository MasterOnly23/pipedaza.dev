import { allowedLinks, knowledge } from "./knowledge";
import type { AllowedLink, KnowledgeTopic } from "./types";

export const FALLBACK_ANSWER =
  "Solo puedo responder preguntas sobre Juan Felipe, sus proyectos, su stack y sus formas públicas de contacto.";
export const FALLBACK_ANSWER_EN =
  "I can only answer questions about Juan Felipe, his projects, his stack, and his public contact options.";

const INSUFFICIENT_INFORMATION_ANSWER = "No tengo información pública suficiente sobre eso.";
const INSUFFICIENT_INFORMATION_ANSWER_EN = "I don't have enough public information about that.";

export type AnswerLanguage = "es" | "en";

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

const TOPIC_LABELS_EN: Record<KnowledgeTopic["id"], string> = {
  profile: "profile",
  work: "work",
  stack: "stack",
  partyup: "PartyUp",
  zentrastock: "ZentraStock",
  contact: "contact",
};

const ENGLISH_LANGUAGE_MARKERS = [
  "the",
  "what",
  "who",
  "how",
  "tell",
  "about",
  "does",
  "do",
  "build",
  "develop",
  "use",
  "technologies",
  "contact",
  "compare",
  "and",
  "or",
  "is",
  "are",
  "products",
  "projects",
  "systems",
  "which",
];

const SPANISH_LANGUAGE_MARKERS = [
  "que",
  "quien",
  "como",
  "cuentame",
  "sobre",
  "contacto",
  "construye",
  "desarrolla",
  "tecnologias",
  "utiliza",
  "es",
  "son",
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "de",
  "del",
  "en",
  "con",
  "para",
  "por",
  "y",
  "o",
  "trabajo",
  "productos",
  "proyectos",
  "sistemas",
  "cuales",
];

export function normalizeQuestion(input: string): string {
  return String(input ?? "")
    .replace(CONTROL_CHARACTERS, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreLanguage(normalized: string, markers: string[]): number {
  return markers.reduce(
    (score, marker) => score + (containsCompleteAlias(normalized, marker) ? 1 : 0),
    0,
  );
}

export function detectQuestionLanguage(input: string): AnswerLanguage {
  const normalized = normalizeQuestion(input);
  return scoreLanguage(normalized, ENGLISH_LANGUAGE_MARKERS) > scoreLanguage(normalized, SPANISH_LANGUAGE_MARKERS)
    ? "en"
    : "es";
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
  /\b(actua como|actúa como|act as|pretend|roleplay|eres otra ia|be another ai)\b/u,
  /\bjailbreak\b/u,
];

export function isInjectionLike(question: string): boolean {
  const normalized = normalizeQuestion(question);
  return INJECTION_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function sanitizeQuestionForModel(
  question: string,
  topics: KnowledgeTopic[],
  language: AnswerLanguage = detectQuestionLanguage(question),
): string {
  const labels = topics
    .map((topic) => (language === "en" ? TOPIC_LABELS_EN[topic.id] : TOPIC_LABELS[topic.id]))
    .join(language === "en" ? " and " : " y ");
  if (isInjectionLike(question)) {
    return language === "en"
      ? `The visitor is asking about these public topics: ${labels}. Answer only with the provided facts about them.`
      : `El visitante pregunta por los temas públicos: ${labels}. Responde únicamente con los hechos proporcionados sobre esos temas.`;
  }

  const validated = validateQuestion(question);
  return language === "en"
    ? `Visitor question: ${validated.ok ? validated.value : ""}`
    : `Pregunta del visitante: ${validated.ok ? validated.value : ""}`;
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

const PROJECT_OVERVIEW_PATTERN = /\b(?:proyecto|proyectos|project|projects|portfolio|portafolio)\b/u;

export function findDeterministicResponse(
  question: string,
): { answer: string; links: AllowedLink[] } | null {
  const normalized = normalizeQuestion(question);
  if (!PROJECT_OVERVIEW_PATTERN.test(normalized)) return null;

  const topics = selectTopics(question);
  if (!topics.some((topic) => topic.id === "work")) return null;

  const workTopic = knowledge.find((topic) => topic.id === "work");
  if (!workTopic) return null;

  const language = detectQuestionLanguage(question);
  const projectTopics = knowledge.filter(
    (topic) => topic.id === "partyup" || topic.id === "zentrastock",
  );
  return {
    answer:
      language === "en"
        ? workTopic.deterministicAnswerEn ?? workTopic.factsEn?.join(" ") ?? ""
        : workTopic.deterministicAnswer ?? workTopic.facts.join(" "),
    links: linksForTopics(projectTopics),
  };
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
  /\b(ubicad[oa]|ubicaci[oó]n|vive|reside|location|located)\b/iu,
  /\b(estudios|educacion|education|degree|universidad|university)\b/iu,
  /\b(disponibilidad|availability|freelance|tarifa|rate|precio|price|salario|salary)\b/iu,
  /\b(usuarios|users|ingresos|revenue|metricas|metrics|lanzamiento|launch date)\b/iu,
  /\b(system prompt|system message|prompt del sistema|secreto|secret)\b/iu,
  /\b(renowned|famous|well-known|known for|expert|expertise|speciali[sz]es?|specialist|professional experience)\b/iu,
  /\b(reconocid[oa]s?|famos[oa]s?|conocid[oa] por|expert[oa]s?|especialista|experiencia profesional)\b/iu,
];

function hasUnsupportedClaim(answer: string, topics: KnowledgeTopic[]): boolean {
  const knownFacts = normalizeQuestion(topics.flatMap((topic) => topic.facts).join(" "));
  return UNSUPPORTED_CLAIM_PATTERNS.some(
    (pattern) => pattern.test(answer) && !pattern.test(knownFacts),
  );
}

function sharesKnownFactSignal(answer: string, topics: KnowledgeTopic[]): boolean {
  const knownWords = new Set(
    normalizeQuestion(topics.flatMap((topic) => topic.facts).join(" "))
      .split(" ")
      .filter((word) => word.length >= 4),
  );
  const answerWords = new Set(
    normalizeQuestion(answer)
      .split(" ")
      .filter((word) => word.length >= 4),
  );
  let overlap = 0;
  for (const word of answerWords) {
    if (knownWords.has(word)) overlap += 1;
    if (overlap >= 2) return true;
  }
  return false;
}

function removeRepeatedFragments(answer: string): string {
  const fragments = answer
    .split(/\n+|(?<=[.!?])\s+/u)
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

function fallbackAnswerForLanguage(
  topics: KnowledgeTopic[],
  language: AnswerLanguage,
): string {
  const answers = topics
    .map((topic) =>
      language === "en"
        ? topic.deterministicAnswerEn ?? topic.factsEn?.join(" ")
        : topic.deterministicAnswer ?? topic.facts.join(" "),
    )
    .filter((answer): answer is string => Boolean(answer));
  return limitAnswer(answers.join(" "));
}

function hasLanguageMismatch(answer: string, language: AnswerLanguage): boolean {
  const normalized = normalizeQuestion(answer);
  const expectedMarkers = language === "en" ? ENGLISH_LANGUAGE_MARKERS : SPANISH_LANGUAGE_MARKERS;
  const otherMarkers = language === "en" ? SPANISH_LANGUAGE_MARKERS : ENGLISH_LANGUAGE_MARKERS;
  const expectedScore = scoreLanguage(normalized, expectedMarkers);
  const otherScore = scoreLanguage(normalized, otherMarkers);
  return otherScore >= 2 && otherScore > expectedScore;
}

export function postValidateAnswer(
  rawAnswer: string,
  topics: KnowledgeTopic[],
  language: AnswerLanguage = "es",
): string {
  const answer = String(rawAnswer ?? "")
    .replace(CONTROL_CHARACTERS, " ")
    .replace(/\b(?:https?:\/\/|www\.)[^\s<>"']+/giu, "")
    .trim();
  const cleaned = removeRepeatedFragments(answer);

  if (!cleaned) {
    return language === "en"
      ? INSUFFICIENT_INFORMATION_ANSWER_EN
      : INSUFFICIENT_INFORMATION_ANSWER;
  }

  if (hasUnsupportedClaim(cleaned, topics)) {
    const groundedFallback = sharesKnownFactSignal(cleaned, topics)
      ? fallbackAnswerForLanguage(topics, language)
      : "";
    return groundedFallback ||
      (language === "en" ? INSUFFICIENT_INFORMATION_ANSWER_EN : INSUFFICIENT_INFORMATION_ANSWER);
  }

  if (hasLanguageMismatch(cleaned, language)) {
    return fallbackAnswerForLanguage(topics, language) ||
      (language === "en" ? INSUFFICIENT_INFORMATION_ANSWER_EN : INSUFFICIENT_INFORMATION_ANSWER);
  }

  return limitAnswer(cleaned);
}
