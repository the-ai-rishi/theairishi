"use strict";

/**
 * Source-repo path → public learner concept.
 *
 * The mastery GitHub repo is a PRIVATE authoring source. theairishi.com
 * is the learner front door. Public content must never link that
 * repository (root, blob, tree, raw, issues, or any path).
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

/** Substrings that identify the private authoring repository. */
const MASTERY_REPO_MARKERS = [
  "github.com/the-ai-rishi/devops-engineer-mastery",
  "raw.githubusercontent.com/the-ai-rishi/devops-engineer-mastery",
  "git@github.com:the-ai-rishi/devops-engineer-mastery",
  "the-ai-rishi/devops-engineer-mastery",
];

const AUTHOR_FILE_RE = /current-skills-gap\.md/i;

function loadLearnerSurface(rootDir) {
  const filePath = path.join(rootDir || process.cwd(), CONFIG_REL);
  if (!fs.existsSync(filePath)) {
    return {
      authorOnlyPaths: AUTHOR_ONLY_DEFAULT,
      forbiddenRawPaths: FORBIDDEN_RAW_DEFAULT,
      concepts: [],
      sourceRepo: {
        name: "devops-engineer-mastery",
        role: "private-authoring-source",
        public: false,
      },
    };
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function conceptBySourcePath(config, sourcePath) {
  const list = (config && config.concepts) || [];
  return list.find((item) => item.sourcePath === sourcePath) || null;
}

function textLeaksMasteryRepo(text) {
  const lower = String(text || "").toLowerCase();
  return MASTERY_REPO_MARKERS.some((marker) => lower.includes(marker.toLowerCase()));
}

function collectMasteryRepoLeakErrors(text, relPath) {
  if (!textLeaksMasteryRepo(text)) return [];
  return [
    String(relPath || "content") +
      " mentions the private mastery authoring repository (the-ai-rishi/devops-engineer-mastery). " +
      "That repository is not a public learner destination. Teach on this website. " +
      "Do not link the root, blob, tree, raw, commit, issues, or any other path.",
  ];
}

function collectLearnerSurfaceErrors(text, relPath, config) {
  const errors = [];
  const body = String(text || "");
  const file = String(relPath || "content");
  const cfg = config || {};
  const authorOnly = cfg.authorOnlyPaths || AUTHOR_ONLY_DEFAULT;
  const forbidden = cfg.forbiddenRawPaths || FORBIDDEN_RAW_DEFAULT;

  errors.push(...collectMasteryRepoLeakErrors(body, file));

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

  for (const item of forbidden) {
    if (authorOnly.includes(item)) continue;
    if (!body.includes(item)) continue;
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
        ". Do not send people to GitHub."
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
  collectMasteryRepoLeakErrors,
  textLeaksMasteryRepo,
  duplicateConceptIds,
  conceptBySourcePath,
  AUTHOR_ONLY_DEFAULT,
  FORBIDDEN_RAW_DEFAULT,
  MASTERY_REPO_MARKERS,
};
