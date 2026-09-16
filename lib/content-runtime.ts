import fs from "node:fs";
import path from "node:path";
import { EMBEDDED_CONTENT } from "./content-data.generated";

function normalize(relativePath: string): string {
  return relativePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isWorkersLikeRuntime(): boolean {
  const env = typeof process !== "undefined" ? process.env : undefined;
  if (!env) return false;
  return Boolean(
    env.CLOUDFLARE ||
      env.CF_PAGES ||
      env.WORKERS_CI ||
      env.OPEN_NEXT_CLOUDFLARE ||
      env.NEXT_RUNTIME === "edge"
  );
}

function readFromDisk(normalized: string): string | null {
  if (isWorkersLikeRuntime()) return null;
  try {
    const absolutePath = path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
    if (fs.existsSync(/*turbopackIgnore: true*/ absolutePath)) {
      return fs.readFileSync(/*turbopackIgnore: true*/ absolutePath, "utf8");
    }
  } catch {
    // Cloudflare's node compatibility layer does not expose the source tree.
  }
  return null;
}

function listFromDisk(normalizedDir: string, extension: string): string[] | null {
  if (isWorkersLikeRuntime()) return null;
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
  return null;
}

/**
 * Prefer the build-time embedded catalog. That is what Cloudflare Workers
 * can actually see. Fall back to the repository filesystem in local/Vercel
 * Node so a newly added file still works before the next generate step.
 */
export function readContentFile(relativePath: string): string | null {
  const normalized = normalize(relativePath);
  if (Object.prototype.hasOwnProperty.call(EMBEDDED_CONTENT, normalized)) {
    return EMBEDDED_CONTENT[normalized];
  }
  return readFromDisk(normalized);
}

export function listContentFiles(relativeDir: string, extension: string): string[] {
  const normalizedDir = normalize(relativeDir).replace(/\/$/, "");
  const fromDisk = listFromDisk(normalizedDir, extension);
  if (fromDisk && fromDisk.length > 0) return fromDisk;
  return Object.keys(EMBEDDED_CONTENT)
    .filter((filePath) => filePath.startsWith(`${normalizedDir}/`) && filePath.endsWith(extension))
    .sort();
}
