export const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

const MODEL_CACHE_SCOPE = "webllm/model";
const MODEL_BASE_URL =
  "https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC/";

type TensorCacheManifest = {
  records?: Array<{ dataPath?: unknown }>;
};

/**
 * Checks WebLLM's pinned Cache Storage layout without importing its 5.7 MB
 * runtime bundle. A failure is treated as a cache miss so manual activation
 * remains available.
 */
export async function hasLocalChatModelInCache(): Promise<boolean> {
  if (!("caches" in window)) return false;

  try {
    const cache = await window.caches.open(MODEL_CACHE_SCOPE);
    const manifestUrl = new URL("tensor-cache.json", MODEL_BASE_URL).href;
    const manifestResponse = await cache.match(manifestUrl);
    if (!manifestResponse) return false;

    const manifest = (await manifestResponse.json()) as TensorCacheManifest;
    if (!Array.isArray(manifest.records) || manifest.records.length === 0) return false;

    const modelFiles = manifest.records.map((record) =>
      typeof record.dataPath === "string"
        ? new URL(record.dataPath, MODEL_BASE_URL).href
        : null,
    );
    if (modelFiles.some((url) => url === null)) return false;

    const cachedFiles = await Promise.all(
      modelFiles.map((url) => cache.match(url as string)),
    );
    return cachedFiles.every(Boolean);
  } catch {
    return false;
  }
}
