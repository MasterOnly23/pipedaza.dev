export type TopicId =
  | "profile"
  | "work"
  | "stack"
  | "partyup"
  | "zentrastock"
  | "kustral"
  | "contact";

export type AllowedLink = {
  label: string;
  url: string;
};

export type KnowledgeTopic = {
  id: TopicId;
  keywords: string[];
  facts: string[];
  factsEn?: string[];
  quickQuestions: string[];
  deterministicAnswer?: string;
  deterministicAnswerEn?: string;
  links?: AllowedLink[];
};

export type ChatState =
  | { kind: "closed" }
  | { kind: "idle" }
  | { kind: "unsupported"; reason: string }
  | { kind: "consent" }
  | { kind: "loading"; progress: number; text: string }
  | { kind: "ready" }
  | { kind: "generating" }
  | { kind: "error"; message: string; retryable: boolean };

export type PromptMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatHistoryEntry = {
  role: "user" | "assistant";
  content: string;
};

export type LocalChatEngine = {
  load(onProgress: (progress: number, text: string) => void): Promise<void>;
  answer(messages: PromptMessage[]): AsyncIterable<string>;
  stop(): Promise<void>;
  dispose(): Promise<void>;
};
