"use strict";

/* eslint-disable @typescript-eslint/no-require-imports --
 * CJS on purpose: Node validate/generate and the Next runtime share this file.
 */

/**
 * Canonical “this markdown is a public /learn/[slug] lesson” rule.
 *
 * Used by:
 * - scripts/generate-content-data.js (middleware allow-list)
 * - lib/lessons.ts (runtime catalog)
 * - scripts/validate.js / scenario-test.js
 *
 * Do not add a second regex or gray-matter check elsewhere.
 * Course definitions live in content/config/courses.json.
 * Public lessons live only in content/lessons/*.md.
 * Markdown under content/courses/ is never a /learn route.
 */

const path = require("path");
const matter = require("gray-matter");
const vis = require("./visibility-core");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getPositiveNumber(value) {
  const num =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(num) && num > 0 ? num : null;
}

function isExplicitlyDisabled(data) {
  if (!data || typeof data !== "object") return true;
  if (data.enabled === false) return true;
  if (typeof data.enabled === "string" && data.enabled.trim().toLowerCase() === "false") return true;
  return false;
}

function isPublicLessonFrontmatter(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  if (isExplicitlyDisabled(data)) return false;
  if (data.status == null || data.status === "") return false;
  const status = vis.normalizeStatus(data.status);
  if (status !== "active") return false;
  if (!isNonEmptyString(data.title)) return false;
  if (!isNonEmptyString(data.stage)) return false;
  if (!isNonEmptyString(data.course)) return false;
  if (!getPositiveNumber(data.lesson)) return false;
  return true;
}

function isPublicLessonMarkdown(body) {
  if (typeof body !== "string" || !body.trim()) return false;
  try {
    const parsed = matter(body);
    return isPublicLessonFrontmatter(parsed.data || {});
  } catch {
    return false;
  }
}

function isLessonSourcePath(filePath) {
  const normalized = String(filePath || "")
    .split(path.sep)
    .join("/");
  return normalized.startsWith("content/lessons/") && normalized.endsWith(".md");
}

function collectPublishedLessonSlugs(embedded) {
  return [
    ...new Set(
      Object.entries(embedded || {})
        .filter(([filePath, body]) => isLessonSourcePath(filePath) && isPublicLessonMarkdown(String(body)))
        .map(([filePath]) => path.basename(filePath, ".md"))
    ),
  ].sort();
}

module.exports = {
  isPublicLessonFrontmatter,
  isPublicLessonMarkdown,
  isLessonSourcePath,
  collectPublishedLessonSlugs,
};
