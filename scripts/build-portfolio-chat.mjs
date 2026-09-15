import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.resolve(repositoryRoot, "static-landing", "chat");
const expectedRelativePath = path.relative(repositoryRoot, outputDirectory);

if (
  expectedRelativePath !== path.join("static-landing", "chat") ||
  path.dirname(outputDirectory) !== path.resolve(repositoryRoot, "static-landing")
) {
  throw new Error("Refusing to build outside static-landing/chat");
}

try {
  const outputStats = await lstat(outputDirectory);
  if (outputStats.isSymbolicLink()) {
    throw new Error("Refusing to remove a symlink at static-landing/chat");
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await build({
  entryPoints: {
    "portfolio-chat": path.resolve(repositoryRoot, "features", "portfolio-chat", "main.ts"),
  },
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  outdir: outputDirectory,
  entryNames: "[name]",
  chunkNames: "chunks/[name]-[hash]",
  minify: true,
  sourcemap: false,
  external: ["url"],
  logLevel: "info",
});

await build({
  entryPoints: {
    "portfolio-chat-worker": path.resolve(
      repositoryRoot,
      "features",
      "portfolio-chat",
      "webllm.worker.ts",
    ),
  },
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  outdir: outputDirectory,
  entryNames: "[name]",
  minify: true,
  sourcemap: false,
  external: ["url"],
  logLevel: "info",
});

const files = await readdir(outputDirectory, { recursive: true });
const requiredFiles = [
  "portfolio-chat.js",
  "portfolio-chat.css",
  "portfolio-chat-worker.js",
];
for (const requiredFile of requiredFiles) {
  if (!files.includes(requiredFile)) {
    throw new Error(`Missing generated chatbot artifact: ${requiredFile}`);
  }
}

await Promise.all(
  requiredFiles.map(async (file) => {
    const fileStats = await stat(path.join(outputDirectory, file));
    if (fileStats.size === 0) throw new Error(`Generated chatbot artifact is empty: ${file}`);
  }),
);

const mainBundle = await readFile(path.join(outputDirectory, "portfolio-chat.js"), "utf8");
if (/Qwen2\.5|@mlc-ai\/web-llm|CreateWebWorkerMLCEngine/u.test(mainBundle)) {
  throw new Error("WebLLM was included in the critical chatbot entry bundle");
}

const cssBundle = await readFile(path.join(outputDirectory, "portfolio-chat.css"), "utf8");
const workerBundle = await readFile(
  path.join(outputDirectory, "portfolio-chat-worker.js"),
  "utf8",
);
const cacheVersion = createHash("sha256")
  .update(`${mainBundle}\n${cssBundle}\n${workerBundle}`)
  .digest("hex")
  .slice(0, 12);

console.log(
  `Portfolio chat built in ${path.relative(repositoryRoot, outputDirectory)} (cache ${cacheVersion}; update static-landing/index.html references manually)`,
);
