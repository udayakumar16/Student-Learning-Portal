import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always resolve from the repo root (one level above /scripts), not from CWD.
// Running this script from /frontend previously could miss the real .next directory.
const root = path.resolve(__dirname, "..");

const targets = [
  path.join(root, "frontend", ".next"),
  path.join(root, "frontend", ".turbo"),
  path.join(root, "frontend", "node_modules", ".cache"),
  path.join(root, "node_modules", ".cache"),
  path.join(root, ".next"),
  path.join(root, ".turbo")
];

async function rmSafe(p) {
  try {
    await rm(p, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
    process.stdout.write(`Removed: ${p}\n`);
  } catch (err) {
    process.stdout.write(`Skip (could not remove): ${p}\n`);
  }
}

for (const p of targets) {
  await rmSafe(p);
}
