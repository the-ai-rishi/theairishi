"use strict";

/**
 * Source-repo path → public learner concept.
 *
 * The mastery GitHub repo is the authoring source of truth.
 * theairishi.com is the learner front door. Public lessons must not
 * tell a visitor to open authoring files or clone the repo.
 */

const fs = require("fs");
const path = require("path");

const CONFIG_REL = "content/config/learner-surface.json";

const AUTHOR_ONLY_DEFAULT = ["docs/current-skills-gap.md"];

const FORBIDDEN_RAW_DEFAULT = [
  "docs/current-skills-gap.md",
  "docs/how-a-day-works.md",
  "docs/where-work-goes.md",
  "docs/DAY120.md",
  "daily-learning/",
  "roadmap/120-day-execution.md",
  "roadmap/curriculum/",
  "break-fix/",
  "interview-preparation/",
  "labs/day-",
  "templates/",
  "START-HERE.md",
];

const INTERNAL_BLOB_RE =
  /https:\/\/github\.com\/the-ai-rishi\/devops-engineer-mastery\/(?:blob|tree)\/[^/\s)"']+\/(?:daily-learning|roadmap|labs|break-fix|interview-preparation|templates|docs)\//i;

const AUTHOR_FILE_RE = /current-skills-gap\.md/i;

function loadLearnerSurface(rootDir) {
  const filePath = path.join(rootDir || process.cwd(), CONFIG_REL);
  if (!fs.existsSync(filePath)) {
    return {
      authorOnlyPaths: AUTHOR_ONLY_DEFAULT,
      forbiddenRawPaths: FORBIDDEN_RAW_DEFAULT,
      concepts: [],
      sourceRepo: {
        url: "https://github.com/the-ai-rishi/devops-engineer-mastery",
      },
    };
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function conceptBySourcePath(config, sourcePath) {
  const list = (config && config.concepts) || [];
  return list.find((item) => item.sourcePath === sourcePath) || null;
}

function collectLearnerSurfaceErrors(text, relPath, config) {
  const errors = [];
  const body = String(text || "");
  const file = String(relPath || "content");
  const cfg = config || {};
  const authorOnly = cfg.authorOnlyPaths || AUTHOR_ONLY_DEFAULT;
  const forbidden = cfg.forbiddenRawPaths || FORBIDDEN_RAW_DEFAULT;

  for (const item of authorOnly) {
    if (body.includes(item) || AUTHOR_FILE_RE.test(body)) {
      const concept = conceptBySourcePath(cfg, item);
      const label = concept ? concept.learnerLabel : "Your Starting Assessment";
      errors.push(
        file +
          " surfaces author-only path `" +
          item +
          "`. That file is personal author data. Use `" +
          label +
          "` on the website instead. Do not link it from public lessons."
      );
      break;
    }
  }

  if (INTERNAL_BLOB_RE.test(body)) {
    errors.push(
      file +
        " links to an internal mastery-repo path (daily-learning, roadmap, labs, docs, …). " +
        "Learners complete the day on this site. Optional GitHub may point at the repository root, not an authoring file."
    );
  }

  for (const item of forbidden) {
    if (authorOnly.includes(item)) continue;
    if (!body.includes(item)) continue;
    const aroundGithub = new RegExp(
      "https://github.com/the-ai-rishi/devops-engineer-mastery[^\\s)\\]\"']*" +
        item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    if (aroundGithub.test(body)) continue;
    const concept = conceptBySourcePath(cfg, item);
    const label = concept
      ? concept.learnerLabel + (concept.publicHref ? " (" + concept.publicHref + ")" : "")
      : "a learner-facing page";
    errors.push(
      file +
        " mentions internal repository path `" +
        item +
        "` as if the learner should open it. Map it to " +
        label +
        ", or offer the repository root as an optional resource."
    );
  }

  return errors;
}

function duplicateConceptIds(config) {
  const seen = new Set();
  const dupes = [];
  for (const item of (config && config.concepts) || []) {
    const id = item && item.id;
    if (!id) {
      dupes.push("(missing concept id)");
      continue;
    }
    if (seen.has(id)) dupes.push(id);
    seen.add(id);
  }
  return dupes;
}

module.exports = {
  CONFIG_REL,
  loadLearnerSurface,
  collectLearnerSurfaceErrors,
  duplicateConceptIds,
  conceptBySourcePath,
  AUTHOR_ONLY_DEFAULT,
  FORBIDDEN_RAW_DEFAULT,
};
