import "./styles.css";
import { buildPromptMessages } from "./prompt";
import {
  FALLBACK_ANSWER,
  findQuickResponse,
  isInjectionLike,
  linksForTopics,
  postValidateAnswer,
  sanitizeQuestionForModel,
  selectTopics,
  validateQuestion,
} from "./scope";
import {
  appendMessage,
  clearMessages,
  createChatView,
  resetProgress,
  setMode,
  setOpen,
  setProgress,
  setStatus,
  updateCharacterCount,
  updateMessage,
} from "./render";
import type { ChatHistoryEntry, LocalChatEngine } from "./types";

type BrowserGPU = {
  requestAdapter(options?: { powerPreference?: "low-power" }): Promise<unknown | null>;
};

const view = createChatView();
let mode: Parameters<typeof setMode>[1] = "idle";
let engine: LocalChatEngine | null = null;
let history: ChatHistoryEntry[] = [];
let loadSequence = 0;
let cancelRequested = false;
let generationSequence = 0;
let generationInFlight = false;
let generationOwner = 0;
let startLoadingInFlight = false;
let opener: HTMLElement = view.launcher;

function getBrowserGPU(): BrowserGPU | null {
  if (!window.isSecureContext || !("gpu" in navigator)) return null;
  return (navigator as Navigator & { gpu?: BrowserGPU }).gpu ?? null;
}

function getChatAssetVersion(): string {
  const script = document.querySelector<HTMLScriptElement>(
    'script[src*="/chat/portfolio-chat.js"]',
  );
  const version = script
    ? new URL(script.src, window.location.href).searchParams.get("v") ?? ""
    : "";
  return /^[0-9a-f]{12}$/u.test(version) ? version : "";
}

function setChatMode(nextMode: typeof mode, retryable = false): void {
  mode = nextMode;
  setMode(view, nextMode, retryable);
}

function setIdle(message = "Las preguntas rápidas funcionan sin descargar el modelo."): void {
  resetProgress(view);
  setChatMode("idle");
  setStatus(view, message);
}

function setUnsupported(): void {
  resetProgress(view);
  setChatMode("unsupported");
  setStatus(
    view,
    "La IA local no está disponible en este navegador, pero puedes usar estas preguntas rápidas.",
  );
}

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLocaleLowerCase() : "";
  if (/out of memory|oom|insufficient memory|allocation failed/u.test(message)) return false;
  return /fetch|network|download|timeout|chunk|device lost|load|wasm/u.test(message);
}

function isDeviceLossError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLocaleLowerCase() : "";
  return /device lost|webgpu|gpu device|gpu error/u.test(message);
}

async function disposeEngine(): Promise<void> {
  const current = engine;
  engine = null;
  if (!current) return;
  try {
    await current.dispose();
  } catch {
    // The worker facade performs best-effort cleanup; no raw error is shown to visitors.
  }
}

async function requestAdapter(): Promise<unknown | null> {
  const gpu = getBrowserGPU();
  if (!gpu) return null;
  try {
    return await gpu.requestAdapter({ powerPreference: "low-power" });
  } catch {
    return null;
  }
}

async function askForConsent(): Promise<void> {
  if (mode !== "idle" && mode !== "error") return;

  view.activate.disabled = true;
  setStatus(view, "Comprobando si este navegador puede ejecutar IA local…");
  const adapter = await requestAdapter();
  view.activate.disabled = false;
  if (!adapter) {
    setUnsupported();
    return;
  }

  setChatMode("consent");
  setStatus(view, "La IA local solo se descarga después de tu confirmación.");
  view.consentAccept.focus();
}

async function startLoading(): Promise<void> {
  if (mode !== "consent" || startLoadingInFlight) return;
  startLoadingInFlight = true;
  view.consentAccept.disabled = true;
  const sequence = ++loadSequence;
  cancelRequested = false;
  try {
    const adapter = await requestAdapter();
    if (!adapter) {
      setUnsupported();
      return;
    }

    setChatMode("loading");
    setStatus(view, "Preparando la IA local…");
    resetProgress(view);

    const engineModule = await import("./engine");
    if (cancelRequested || sequence !== loadSequence) return;
    if (!engine) engine = engineModule.createLocalChatEngine(getChatAssetVersion());
    const current = engine;
    await current.load((progress, text) => {
      if (cancelRequested || sequence !== loadSequence || mode !== "loading") return;
      setProgress(view, progress, text);
    });
    if (cancelRequested || sequence !== loadSequence) return;

    setChatMode("ready");
    setStatus(view, "Modelo listo. La pregunta se procesa en este dispositivo.");
    view.input.focus();
  } catch (error) {
    if (cancelRequested || sequence !== loadSequence) return;
    const retryable = isRetryableError(error);
    await disposeEngine();
    if (retryable) {
      resetProgress(view);
      setChatMode("error", true);
      setStatus(view, "No pude descargar la IA local ahora. Puedes reintentarlo.");
    } else {
      setUnsupported();
    }
  } finally {
    startLoadingInFlight = false;
    view.consentAccept.disabled = false;
  }
}

async function cancelLoading(): Promise<void> {
  if (mode !== "loading") return;
  cancelRequested = true;
  loadSequence += 1;
  await disposeEngine();
  setIdle("Carga cancelada. Las preguntas rápidas siguen disponibles.");
  view.activate.focus();
}

function addQuickResponse(question: string): void {
  const response = findQuickResponse(question);
  if (!response) return;
  appendMessage(view, "user", question);
  appendMessage(view, "assistant", response.answer, response.links);
  setStatus(view, "Respuesta rápida · no descargó el modelo.");
}

function scheduleTextUpdate(
  message: ReturnType<typeof appendMessage>,
  getText: () => string,
): Promise<void> {
  if (typeof requestAnimationFrame !== "function") {
    updateMessage(message, getText());
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      updateMessage(message, getText());
      resolve();
    });
  });
}

async function stopGeneration(): Promise<void> {
  if (mode !== "generating") return;
  generationSequence += 1;
  try {
    await engine?.stop();
  } catch {
    // The UI still returns to a stable ready state if interruption races the stream.
  }
  setChatMode("ready");
  setStatus(view, "Generación detenida. Puedes hacer otra pregunta.");
}

async function releaseModel(): Promise<void> {
  generationSequence += 1;
  loadSequence += 1;
  cancelRequested = true;
  await disposeEngine();
  generationOwner += 1;
  generationInFlight = false;
  history = [];
  clearMessages(view);
  setIdle("IA liberada. Las preguntas rápidas siguen disponibles.");
}

async function submitQuestion(): Promise<void> {
  if (mode !== "ready" || !engine || generationInFlight) return;

  const rawQuestion = view.input.value;
  const validation = validateQuestion(rawQuestion);
  if (!validation.ok) {
    setStatus(view, validation.reason);
    return;
  }

  const topics = selectTopics(validation.value);
  view.input.value = "";
  updateCharacterCount(view);
  appendMessage(view, "user", validation.value);

  if (!topics.length) {
    appendMessage(view, "assistant", FALLBACK_ANSWER);
    setStatus(view, "Pregunta fuera del alcance público del asistente.");
    return;
  }

  const promptMessages = buildPromptMessages(validation.value, topics, history);
  const safeQuestion = sanitizeQuestionForModel(validation.value, topics);
  const responseMessage = appendMessage(view, "assistant", "Generando respuesta local…");
  const sequence = ++generationSequence;
  const owner = ++generationOwner;
  generationInFlight = true;
  setChatMode("generating");
  setStatus(
    view,
    isInjectionLike(validation.value)
      ? "Pregunta acotada a los hechos públicos seleccionados."
      : "Generando en tu dispositivo…",
  );

  let generated = "";
  try {
    for await (const chunk of engine.answer(promptMessages)) {
      if (sequence !== generationSequence) return;
      generated += chunk;
      await scheduleTextUpdate(responseMessage, () => generated || "Generando respuesta local…");
    }
    if (sequence !== generationSequence) return;

    const answer = postValidateAnswer(generated, topics);
    updateMessage(responseMessage, answer, linksForTopics(topics));
    const nextHistory: ChatHistoryEntry[] = [
      ...history,
      { role: "user", content: safeQuestion },
      { role: "assistant", content: answer },
    ];
    history = nextHistory.slice(-4);
    setChatMode("ready");
    setStatus(view, "IA local · respuesta generada en este dispositivo.");
  } catch (error) {
    if (sequence !== generationSequence) return;
    if (isDeviceLossError(error)) {
      await disposeEngine();
      setChatMode("error", true);
      setStatus(view, "La sesión de IA local se perdió. Puedes reintentarlo.");
      return;
    }
    updateMessage(
      responseMessage,
      "No pude generar una respuesta local ahora. Las preguntas rápidas siguen disponibles.",
    );
    setChatMode("ready");
    setStatus(view, "La generación falló; el modelo sigue disponible para reintentar.");
  } finally {
    if (owner === generationOwner) generationInFlight = false;
  }
}

function closeChat(): void {
  if (view.panel.hidden) return;
  setOpen(view, false);
  opener.focus();
}

function openChat(): void {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : view.launcher;
  setOpen(view, true);
  view.close.focus();
}

view.launcher.addEventListener("click", openChat);
view.close.addEventListener("click", closeChat);
view.cancel.addEventListener("click", () => void cancelLoading());
view.activate.addEventListener("click", () => void askForConsent());
view.consentAccept.addEventListener("click", () => void startLoading());
view.consentCancel.addEventListener("click", () => {
  setIdle();
  view.activate.focus();
});
view.retry.addEventListener("click", () => void askForConsent());
view.stop.addEventListener("click", () => void stopGeneration());
view.release.addEventListener("click", () => void releaseModel());
view.form.addEventListener("submit", (event) => {
  event.preventDefault();
  void submitQuestion();
});
view.input.addEventListener("input", () => updateCharacterCount(view));
view.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    void submitQuestion();
  }
});
view.quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.dataset.quickQuestion;
    if (question) addQuickResponse(question);
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !view.panel.hidden) closeChat();
});

if (getBrowserGPU()) {
  setChatMode("idle");
} else {
  setUnsupported();
}
