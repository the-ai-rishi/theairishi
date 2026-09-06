import fs from "node:fs";
import path from "node:path";
import { EMBEDDED_CONTENT } from "./content-data.generated";

function normalize(relativePath: string): string {
  return relativePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

/**
 * Reads content from the normal repository filesystem when it exists (local
 * dev/Vercel), and falls back to the build-time embedded catalog in Workers.
 */
export function readContentFile(relativePath: string): string | null {
  const normalized = normalize(relativePath);
  try {
    const absolutePath = path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
    if (fs.existsSync(/*turbopackIgnore: true*/ absolutePath)) return fs.readFileSync(/*turbopackIgnore: true*/ absolutePath, "utf8");
  } catch {
    // Cloudflare's node compatibility layer does not expose the source tree.
  }
  return EMBEDDED_CONTENT[normalized] ?? null;
}

export function listContentFiles(relativeDir: string, extension: string): string[] {
  const normalizedDir = normalize(relativeDir).replace(/\/$/, "");
  try {
    const absoluteDir = path.join(/*turbopackIgnore: true*/ process.cwd(), normalizedDir);
    if (fs.existsSync(/*turbopackIgnore: true*/ absoluteDir)) {
      return fs
        .readdirSync(/*turbopackIgnore: true*/ absoluteDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
        .map((entry) => `${normalizedDir}/${entry.name}`);
    }
  } catch {
    // Fall through to the embedded catalog.
  }
  return Object.keys(EMBEDDED_CONTENT)
    .filter((filePath) => filePath.startsWith(`${normalizedDir}/`) && filePath.endsWith(extension))
    .sort();
}
