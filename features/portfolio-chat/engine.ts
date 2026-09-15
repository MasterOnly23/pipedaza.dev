import type { LocalChatEngine, PromptMessage } from "./types";

export const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const WORKER_URL = "/chat/portfolio-chat-worker.js";

type ProgressReport = {
  progress: number;
  text: string;
};

type WebLLMEngine = {
  chat: {
    completions: {
      create(request: {
        messages: PromptMessage[];
        stream: true;
        temperature: number;
        top_p: number;
        max_tokens: number;
      }): Promise<AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>>;
    };
  };
  interruptGenerate(): void;
  unload(): Promise<void>;
};

function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

function cleanProgressText(text: string): string {
  return String(text ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

export function createLocalChatEngine(): LocalChatEngine {
  let worker: Worker | null = null;
  let engine: WebLLMEngine | null = null;
  let loadPromise: Promise<void> | null = null;
  let disposed = false;
  let generating = false;

  const load = (onProgress: (progress: number, text: string) => void): Promise<void> => {
    if (engine) return Promise.resolve();
    if (loadPromise) return loadPromise;

    disposed = false;
    loadPromise = (async () => {
      const webllm = await import("@mlc-ai/web-llm");
      if (disposed) throw new DOMException("Local engine disposed", "AbortError");

      const nextWorker = new Worker(WORKER_URL, { type: "module" });
      worker = nextWorker;

      try {
        const nextEngine = await webllm.CreateWebWorkerMLCEngine(
          nextWorker,
          MODEL_ID,
          {
            initProgressCallback: (report: ProgressReport) => {
              onProgress(clampProgress(report.progress), cleanProgressText(report.text));
            },
          },
          { context_window_size: 1024 },
        );

        if (disposed) {
          await nextEngine.unload();
          throw new DOMException("Local engine disposed", "AbortError");
        }
        engine = nextEngine as unknown as WebLLMEngine;
      } catch (error) {
        nextWorker.terminate();
        if (worker === nextWorker) worker = null;
        throw error;
      }
    })();

    return loadPromise.finally(() => {
      loadPromise = null;
    });
  };

  const answer = (messages: PromptMessage[]): AsyncIterable<string> => {
    if (!engine) throw new Error("Local engine is not ready");
    if (generating) throw new Error("A local response is already being generated");

    const activeEngine = engine;
    generating = true;

    return (async function* () {
      try {
        const stream = await activeEngine.chat.completions.create({
          messages,
          stream: true,
          temperature: 0.2,
          top_p: 0.85,
          max_tokens: 96,
        });

        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) yield content;
        }
      } finally {
        generating = false;
      }
    })();
  };

  const stop = async (): Promise<void> => {
    if (engine && generating) engine.interruptGenerate();
  };

  const dispose = async (): Promise<void> => {
    disposed = true;
    if (engine) {
      try {
        if (generating) engine.interruptGenerate();
        await engine.unload();
      } catch {
        // Terminating the worker below remains the final cleanup path.
      } finally {
        engine = null;
        generating = false;
      }
    }

    if (worker) {
      worker.terminate();
      worker = null;
    }
  };

  return { load, answer, stop, dispose };
}
