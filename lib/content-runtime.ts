import fs from "node:fs";
import path from "node:path";
import { EMBEDDED_CONTENT } from "./content-data.generated";

/**
 * Content is compiled into EMBEDDED_CONTENT at build time.
 * Production (Vercel Node, Cloudflare Workers, OpenNext) never reads the
 * source tree. Local development may overlay new files that have not been
 * regenerated yet.
 *
 * Cloudflare Workers set process.cwd() to /bundle. Never probe that path.
 */

function normalize(relativePath: string): string {
  return relativePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

function workersCwd(cwd: string): boolean {
  return (
    cwd === "/bundle" ||
    cwd.startsWith("/bundle/") ||
    cwd === "/" ||
    cwd.startsWith("/cdn-cgi")
  );
}

function isWorkersLikeRuntime(): boolean {
  const env = typeof process !== "undefined" ? process.env : undefined;
  if (!env) return true;
  if (
    env.CLOUDFLARE ||
    env.CF_PAGES ||
    env.WORKERS_CI ||
    env.OPEN_NEXT_CLOUDFLARE ||
    env.NEXT_RUNTIME === "edge"
  ) {
    return true;
  }
  try {
    return workersCwd(process.cwd());
  } catch {
    return true;
  }
}

function canReadDisk(): boolean {
  if (typeof process === "undefined" || !process.env) return false;
  if (process.env.NODE_ENV === "production") return false;
  if (isWorkersLikeRuntime()) return false;
  try {
    return !workersCwd(process.cwd());
  } catch {
    return false;
  }
}

function readFromDisk(normalized: string): string | null {
  if (!canReadDisk()) return null;
  try {
    const absolutePath = path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
    if (fs.existsSync(/*turbopackIgnore: true*/ absolutePath)) {
      return fs.readFileSync(/*turbopackIgnore: true*/ absolutePath, "utf8");
    }
  } catch {
    // Production runtimes do not ship the source tree.
  }
  return null;
}

function listFromDisk(normalizedDir: string, extension: string): string[] | null {
  if (!canReadDisk()) return null;
  try {
    const absoluteDir = path.join(/*turbopackIgnore: true*/ process.cwd(), normalizedDir);
    if (!fs.existsSync(/*turbopackIgnore: true*/ absoluteDir)) return null;
    const out: string[] = [];
    const walk = (dir: string, rel: string) => {
      for (const entry of fs.readdirSync(/*turbopackIgnore: true*/ dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        const nextRel = `${rel}/${entry.name}`;
        if (entry.isDirectory()) walk(full, nextRel);
        else if (entry.isFile() && entry.name.endsWith(extension)) out.push(nextRel);
      }
    };
    walk(absoluteDir, normalizedDir);
    return out.sort();
  } catch {
    return null;
  }
}

/**
 * Always prefer the build-time catalog. Disk is a development overlay only.
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
  const fromEmbedded = Object.keys(EMBEDDED_CONTENT)
    .filter((filePath) => filePath.startsWith(`${normalizedDir}/`) && filePath.endsWith(extension))
    .sort();
  const fromDisk = listFromDisk(normalizedDir, extension);
  if (!fromDisk || fromDisk.length === 0) return fromEmbedded;
  return Array.from(new Set([...fromEmbedded, ...fromDisk])).sort();
}
