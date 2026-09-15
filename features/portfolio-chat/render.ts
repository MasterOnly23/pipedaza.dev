import { allowedLinks } from "./knowledge";
import type { AllowedLink } from "./types";

export type ChatMode =
  | "idle"
  | "unsupported"
  | "consent"
  | "loading"
  | "ready"
  | "generating"
  | "error";

export type RenderedMessage = {
  root: HTMLElement;
  body: HTMLParagraphElement;
};

export type ChatView = {
  root: HTMLDivElement;
  launcher: HTMLButtonElement;
  panel: HTMLElement;
  close: HTMLButtonElement;
  status: HTMLParagraphElement;
  progressRow: HTMLDivElement;
  progress: HTMLProgressElement;
  progressText: HTMLSpanElement;
  cancel: HTMLButtonElement;
  quickButtons: HTMLButtonElement[];
  consent: HTMLDivElement;
  consentAccept: HTMLButtonElement;
  consentCancel: HTMLButtonElement;
  messages: HTMLDivElement;
  form: HTMLFormElement;
  input: HTMLTextAreaElement;
  charCount: HTMLSpanElement;
  activate: HTMLButtonElement;
  send: HTMLButtonElement;
  retry: HTMLButtonElement;
  engineActions: HTMLDivElement;
  stop: HTMLButtonElement;
  release: HTMLButtonElement;
};

type QueryRoot = {
  querySelector<T extends Element>(selectors: string): T | null;
};

function required<T extends Element>(root: QueryRoot, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Chat UI element missing: ${selector}`);
  return element;
}

function allowlistedLink(key: string, label: string): AllowedLink {
  const url = allowedLinks.get(key);
  if (!url) throw new Error(`Chat UI link missing from allowlist: ${key}`);
  return { label, url };
}

export function createChatView(): ChatView {
  const root = document.createElement("div");
  root.id = "portfolio-chat-root";
  root.innerHTML = `
    <button class="portfolio-chat-launcher" type="button" aria-expanded="false" aria-controls="portfolio-chat-panel">
      <span class="portfolio-chat-launcher-mark" aria-hidden="true">?</span>
      <span>Pregúntame sobre Juan Felipe</span>
      <span class="portfolio-chat-launcher-arrow" aria-hidden="true">↗</span>
    </button>
    <section class="portfolio-chat-panel" id="portfolio-chat-panel" role="dialog" aria-modal="false" aria-labelledby="portfolio-chat-title" hidden>
      <header class="portfolio-chat-header">
        <div>
          <p class="portfolio-chat-kicker">LOCAL ASSISTANT</p>
          <h2 id="portfolio-chat-title">Ask Pipe</h2>
          <p class="portfolio-chat-subtitle">Respuestas sobre mis proyectos y mi trabajo</p>
        </div>
        <button class="portfolio-chat-icon-button portfolio-chat-close" type="button" aria-label="Cerrar Ask Pipe">×</button>
        <span class="portfolio-chat-badge">IA local · se ejecuta en tu dispositivo</span>
      </header>
      <p class="portfolio-chat-status" role="status" aria-live="polite">Las preguntas rápidas funcionan sin descargar el modelo.</p>
      <div class="portfolio-chat-progress" hidden>
        <div class="portfolio-chat-progress-head"><span>Cargando modelo local</span><button class="portfolio-chat-cancel" type="button">Cancelar</button></div>
        <progress max="1" value="0" aria-label="Progreso de carga del modelo"></progress>
        <span class="portfolio-chat-progress-text"></span>
      </div>
      <div class="portfolio-chat-quick">
        <div class="portfolio-chat-quick-heading"><span>Preguntas rápidas</span><span>Respuesta rápida</span></div>
        <div class="portfolio-chat-quick-actions">
          <button type="button" data-quick-question="¿Qué construye Juan Felipe?">¿Qué construye Juan Felipe?</button>
          <button type="button" data-quick-question="Cuéntame sobre PartyUp">Cuéntame sobre PartyUp</button>
          <button type="button" data-quick-question="¿Qué es ZentraStock?">¿Qué es ZentraStock?</button>
        </div>
      </div>
      <div class="portfolio-chat-consent" hidden>
        <p class="portfolio-chat-consent-title">Activa respuestas libres</p>
        <p>El modelo se descarga una vez y queda en la caché de este navegador. Puede usar cientos de MB. La pregunta y la respuesta se procesan en tu dispositivo.</p>
        <div class="portfolio-chat-consent-actions"><button class="portfolio-chat-consent-accept" type="button">Aceptar y descargar</button><button class="portfolio-chat-consent-cancel" type="button">Ahora no</button></div>
      </div>
      <div class="portfolio-chat-messages" aria-live="polite" aria-atomic="false"></div>
      <form class="portfolio-chat-form">
        <label for="portfolio-chat-input"><span>Pregunta libre</span><span class="portfolio-chat-char-count">0 / 280</span></label>
        <textarea id="portfolio-chat-input" maxlength="280" rows="2" placeholder="Activa la IA local para escribir una pregunta" disabled></textarea>
        <div class="portfolio-chat-form-actions"><button class="portfolio-chat-activate" type="button">Activar IA local</button><button class="portfolio-chat-send" type="submit" hidden>Enviar <span aria-hidden="true">↗</span></button><button class="portfolio-chat-retry" type="button" hidden>Reintentar</button></div>
      </form>
      <div class="portfolio-chat-engine-actions" hidden><button class="portfolio-chat-stop" type="button" hidden>Detener</button><button class="portfolio-chat-release" type="button" hidden>Liberar IA</button></div>
    </section>`;
  document.body.appendChild(root);

  const contact = document.createElement("div");
  contact.className = "portfolio-chat-contact";
  const contactLabel = document.createElement("span");
  contactLabel.className = "portfolio-chat-contact-label";
  contactLabel.textContent = "Contacto público";
  contact.appendChild(contactLabel);
  appendLinks(
    contact,
    [
      allowlistedLink("github", "GitHub"),
      allowlistedLink("email", "Email"),
    ],
    "portfolio-chat-contact-links",
  );
  const quick = root.querySelector<HTMLElement>(".portfolio-chat-quick");
  quick?.parentElement?.insertBefore(contact, quick.nextSibling);

  return {
    root,
    launcher: required(root, ".portfolio-chat-launcher"),
    panel: required(root, ".portfolio-chat-panel"),
    close: required(root, ".portfolio-chat-close"),
    status: required(root, ".portfolio-chat-status"),
    progressRow: required(root, ".portfolio-chat-progress"),
    progress: required(root, "progress"),
    progressText: required(root, ".portfolio-chat-progress-text"),
    cancel: required(root, ".portfolio-chat-cancel"),
    quickButtons: Array.from(root.querySelectorAll("[data-quick-question]")),
    consent: required(root, ".portfolio-chat-consent"),
    consentAccept: required(root, ".portfolio-chat-consent-accept"),
    consentCancel: required(root, ".portfolio-chat-consent-cancel"),
    messages: required(root, ".portfolio-chat-messages"),
    form: required(root, "form"),
    input: required(root, "#portfolio-chat-input"),
    charCount: required(root, ".portfolio-chat-char-count"),
    activate: required(root, ".portfolio-chat-activate"),
    send: required(root, ".portfolio-chat-send"),
    retry: required(root, ".portfolio-chat-retry"),
    engineActions: required(root, ".portfolio-chat-engine-actions"),
    stop: required(root, ".portfolio-chat-stop"),
    release: required(root, ".portfolio-chat-release"),
  };
}

export function setOpen(view: ChatView, open: boolean): void {
  view.root.dataset.open = String(open);
  view.launcher.setAttribute("aria-expanded", String(open));
  view.panel.hidden = !open;
}

export function setMode(
  view: ChatView,
  mode: ChatMode,
  retryable = false,
): void {
  view.root.dataset.state = mode;
  const ready = mode === "ready";
  const generating = mode === "generating";
  const loading = mode === "loading";

  view.consent.hidden = mode !== "consent";
  view.progressRow.hidden = !loading;
  view.cancel.hidden = !loading;
  view.activate.hidden = !["idle"].includes(mode);
  view.retry.hidden = mode !== "error" || !retryable;
  view.send.hidden = !["ready", "generating"].includes(mode);
  view.send.disabled = !ready;
  view.input.disabled = !ready;
  view.engineActions.hidden = !["ready", "generating"].includes(mode);
  view.stop.hidden = !generating;
  view.release.hidden = !["ready", "generating"].includes(mode);
  view.panel.setAttribute("aria-busy", String(loading || generating));
}

export function setStatus(view: ChatView, message: string): void {
  view.status.textContent = message;
}

export function setProgress(view: ChatView, progress: number, text: string): void {
  view.progress.value = Math.min(1, Math.max(0, progress));
  view.progressText.textContent = text || "Cargando modelo local…";
}

export function resetProgress(view: ChatView): void {
  view.progress.value = 0;
  view.progressText.textContent = "";
}

export function updateCharacterCount(view: ChatView): void {
  view.charCount.textContent = `${Array.from(view.input.value).length} / 280`;
}

function appendLinks(
  root: HTMLElement,
  links: AllowedLink[],
  className = "portfolio-chat-message-links",
): void {
  const safeLinks = links.filter((link) => Array.from(allowedLinks.values()).includes(link.url));
  if (!safeLinks.length) return;

  const linksRoot = document.createElement("div");
  linksRoot.className = className;
  for (const link of safeLinks) {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.textContent = link.label;
    linksRoot.appendChild(anchor);
  }
  root.appendChild(linksRoot);
}

export function appendMessage(
  view: ChatView,
  role: "user" | "assistant",
  text: string,
  links: AllowedLink[] = [],
): RenderedMessage {
  const root = document.createElement("article");
  root.className = `portfolio-chat-message portfolio-chat-message-${role}`;
  const meta = document.createElement("span");
  meta.className = "portfolio-chat-message-meta";
  meta.textContent = role === "user" ? "Tú" : "Ask Pipe";
  const body = document.createElement("p");
  body.className = "portfolio-chat-message-body";
  body.textContent = text;
  root.appendChild(meta);
  root.appendChild(body);
  appendLinks(root, links);
  view.messages.appendChild(root);
  view.messages.scrollTop = view.messages.scrollHeight;
  return { root, body };
}

export function updateMessage(
  message: RenderedMessage,
  text: string,
  links: AllowedLink[] = [],
): void {
  message.body.textContent = text;
  message.root.querySelector(".portfolio-chat-message-links")?.remove();
  appendLinks(message.root, links);
}

export function clearMessages(view: ChatView): void {
  view.messages.replaceChildren();
}
