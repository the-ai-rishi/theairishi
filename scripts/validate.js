"use strict";

const fs = require("fs");
const path = require("path");
const vis = require("../lib/visibility-core");
const { collectPlatformConfigErrors } = require("../lib/platform-schema");
const { collectProgramErrors } = require("../lib/program-schema");
const { runScenarioTests } = require("./scenario-test");
const matter = require("gray-matter");
const { checkWorkerBundle } = require("./check-worker-bundle");
const { execFileSync } = require("child_process");
const {
  generateContentData,
  collectPublishedLessonSlugs,
  collectStaticLearnSegments,
} = require("./generate-content-data");

const rootDir = process.cwd();
const configDir = path.join(rootDir, "content", "config");
const contentDir = path.join(rootDir, "content");
const publicDir = path.join(rootDir, "public");

const errors = [];
const warnings = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function scanFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...scanFiles(full, predicate));
    else if (predicate(entry.name, full)) out.push(full);
  }
  return out;
}

console.log("Running platform validation...\n");

const generatedPath = path.join(rootDir, "lib", "content-data.generated.ts");
execFileSync(process.execPath, [path.join(__dirname, "generate-content-data.js")], { stdio: "inherit" });

const platformPath = path.join(configDir, "platform.json");
check(fs.existsSync(platformPath), "Missing content/config/platform.json");
if (fs.existsSync(platformPath)) {
  try {
    JSON.parse(fs.readFileSync(platformPath, "utf8"));
  } catch (err) {
    errors.push("Error parsing platform.json: " + err.message);
  }
}

const configSourcePath = path.join(rootDir, "lib", "config.ts");
check(fs.existsSync(configSourcePath), "Missing lib/config.ts");
if (fs.existsSync(configSourcePath)) {
  const configSource = fs.readFileSync(configSourcePath, "utf8");
  check(
    /import\s+platformJson\s+from\s+["']\.\.\/content\/config\/platform\.json["']/.test(configSource),
    "lib/config.ts must statically import platform.json"
  );
  check(!configSource.includes("Platform config not found"), "lib/config.ts contains the obsolete platform config error");
  check(!/\breadFileSync\s*\(/.test(configSource), "lib/config.ts must not use readFileSync for platform loading");
}

const programsSourcePath = path.join(rootDir, "lib", "programs.ts");
check(fs.existsSync(programsSourcePath), "Missing lib/programs.ts");
if (fs.existsSync(programsSourcePath)) {
  const programsSource = fs.readFileSync(programsSourcePath, "utf8");
  check(
    /import\s+programsJson\s+from\s+["']\.\.\/content\/config\/programs\.json["']/.test(programsSource),
    "lib/programs.ts must statically import programs.json"
  );
  check(!/\breadFileSync\s*\(/.test(programsSource), "lib/programs.ts must not use readFileSync for program loading");
}

const runtimeSourcePath = path.join(rootDir, "lib", "content-runtime.ts");
check(fs.existsSync(runtimeSourcePath), "Missing lib/content-runtime.ts");
if (fs.existsSync(runtimeSourcePath)) {
  const runtimeSource = fs.readFileSync(runtimeSourcePath, "utf8");
  check(runtimeSource.includes("EMBEDDED_CONTENT"), "content-runtime must use the embedded catalog");
  check(runtimeSource.includes("canReadDisk") || runtimeSource.includes("NODE_ENV"), "content-runtime must gate filesystem reads");
  check(!runtimeSource.includes("Platform config not found"), "content-runtime contains the obsolete platform config error");
}

const embeddedContentPath = path.join(rootDir, "lib", "content-data.generated.ts");
check(fs.existsSync(embeddedContentPath), "Missing generated content catalog. Run content:generate");
if (fs.existsSync(embeddedContentPath)) {
  const embeddedSource = fs.readFileSync(embeddedContentPath, "utf8");
  check(
    embeddedSource.includes("content/config/platform.json") || embeddedSource.includes("The AI Rishi"),
    "Generated catalog does not embed platform.json or the platform brand"
  );
  check(embeddedSource.includes("content/config/courses.json"), "Generated catalog does not embed courses.json");
  check(embeddedSource.includes("content/config/programs.json"), "Generated catalog does not embed programs.json");
  check(embeddedSource.includes("content/lessons/"), "Generated catalog does not embed lesson markdown");
  check(embeddedSource.includes("content/guides/"), "Generated catalog does not embed guide markdown");
  check(embeddedSource.includes("content/projects/"), "Generated catalog does not embed project markdown");
}

const workerBundle = checkWorkerBundle({ rootDir, allowMissing: true, logger: null });
if (!workerBundle.skipped) {
  check(workerBundle.ok, workerBundle.errors.join("; "));
}

let platform = null;
const definedTopicIds = new Set();
const definedTopicSlugs = new Set();
const definedCourseIds = new Set();

if (fs.existsSync(platformPath)) {
  try {
    platform = JSON.parse(fs.readFileSync(platformPath, "utf8"));
  } catch (err) {
    errors.push("Error parsing platform.json: " + err.message);
  }
}

if (platform) {
  for (const err of collectPlatformConfigErrors(platform, vis)) {
    errors.push(err);
  }
  check(platform.brand, "platform.json missing brand");
  if (platform.brand) {
    check(platform.brand.name, "brand missing name");
    check(platform.brand.logo, "brand missing logo");
    check(platform.brand.logoMark, "brand missing logoMark");
    check(platform.brand.ogImage, "brand missing ogImage");
    for (const field of ["logo", "logoMark", "ogImage"]) {
      const rel = platform.brand[field];
      if (!rel) continue;
      const disk = path.join(publicDir, rel.replace(/^\//, ""));
      check(fs.existsSync(disk), "Brand asset missing on disk: " + rel);
    }
    const favicon = platform.brand.faviconUrl;
    if (favicon) {
      const inPublic = path.join(publicDir, favicon.replace(/^\//, ""));
      const inApp = path.join(rootDir, "app", favicon.replace(/^\//, ""));
      check(
        fs.existsSync(inPublic) || fs.existsSync(inApp),
        "Favicon missing on disk: " + favicon
      );
    }
  }

  check(platform.copy, "platform.json missing copy");
  check(Array.isArray(platform.topics), "topics must be an array");

  for (const t of platform.topics || []) {
    check(t.id && t.slug && t.name, "Topic missing id/slug/name");
    check(!definedTopicIds.has(t.id), "Duplicate topic id: " + t.id);
    check(!definedTopicSlugs.has(t.slug), "Duplicate topic slug: " + t.slug);
    definedTopicIds.add(t.id);
    definedTopicSlugs.add(t.slug);
    check(
      vis.isValidLifecycle(t.status || "active"),
      "Topic " + t.id + " has invalid status: " + t.status
    );
  }

  const sectionIds = new Set();
  check(platform.homepage && Array.isArray(platform.homepage.sections), "homepage.sections required");
  for (const s of (platform.homepage && platform.homepage.sections) || []) {
    check(s.id, "Homepage section missing id");
    check(!sectionIds.has(s.id), "Duplicate homepage section id: " + s.id);
    sectionIds.add(s.id);
    if (s.enabled === false) continue;
    check(
      s.type && vis.SECTION_TYPES.includes(s.type),
      "Homepage section '" + s.id + "' has unknown type: " + s.type
    );
    if (s.source && s.source.kind === "topic") {
      check(
        definedTopicIds.has(s.source.topicId) || definedTopicSlugs.has(s.source.topicId),
        "Section '" + s.id + "' source topic missing: " + s.source.topicId
      );
    }
    if (s.source && s.source.kind === "channel") {
      const chId = s.source.channelId || s.source.id;
      const found = (platform.social || []).some((ch) => ch.id === chId);
      check(found, "Section '" + s.id + "' source channel missing: " + chId);
    }
    if (s.source && s.source.kind === "format") {
      const typeId = vis.FORMAT_TO_CONTENT_TYPE[s.source.format] || s.source.format;
      const found = (platform.contentTypes || []).some((ct) => ct.id === typeId || ct.id === s.source.format);
      warn(found, "Section '" + s.id + "' format '" + s.source.format + "' has no matching contentType");
    }
  }

  for (const listName of ["main", "footer"]) {
    const list = (platform.navigation && platform.navigation[listName]) || [];
    const navIds = new Set();
    for (const item of list) {
      if (item && item.id) {
        if (navIds.has(item.id)) {
          errors.push(
            "Problem: duplicate navigation id '" +
              item.id +
              "' in navigation." +
              listName +
              ". Fix: edit content/config/platform.json, set FIELD navigation." +
              listName +
              "[].id to VALUE a unique id (each id may appear only once inside " +
              listName +
              ")."
          );
        }
        navIds.add(item.id);
      } else {
        errors.push(
          "Problem: a navigation." +
            listName +
            " item is missing id. Fix: edit content/config/platform.json, set FIELD id to VALUE a unique string."
        );
      }
      if (item.enabled === false) continue;
      if (item.source && item.source.kind === "topic") {
        const key = item.source.topicId || item.source.id;
        check(
          definedTopicIds.has(key) || definedTopicSlugs.has(key),
          "Nav " + listName + " item '" + item.id + "' points at missing topic " + key
        );
      }
      if (item.source && item.source.kind === "contentType") {
        const found = (platform.contentTypes || []).some((ct) => ct.id === item.source.id);
        check(found, "Nav " + listName + " item '" + item.id + "' points at missing contentType " + item.source.id);
      }
      if (item.source && item.source.kind === "channel") {
        const key = item.source.channelId || item.source.id;
        const found = (platform.social || []).some((ch) => ch.id === key);
        check(found, "Nav " + listName + " item '" + item.id + "' points at missing channel " + key);
      }
      const topicHref = String(item.href || "").match(/^\/topics\/([^/?#]+)/);
      if (topicHref && !item.source) {
        const slug = topicHref[1];
        check(
          definedTopicIds.has(slug) || definedTopicSlugs.has(slug),
          "Nav " + listName + " item '" + item.id + "' href points at missing topic " + slug
        );
      }
    }
  }

  for (const ct of platform.contentTypes || []) {
    check(ct.id && ct.title, "contentType missing id/title");
    check(vis.isValidLifecycle(ct.status || "active"), "contentType " + ct.id + " invalid status");
    if (ct.topicSlug) {
      check(
        definedTopicIds.has(ct.topicSlug) || definedTopicSlugs.has(ct.topicSlug),
        "contentType " + ct.id + " unknown topicSlug " + ct.topicSlug
      );
    }
  }

  for (const ch of platform.social || []) {
    check(ch.id && ch.label, "social platform missing id/label");
    check(vis.isValidLifecycle(ch.status || "active"), "social " + ch.id + " invalid status");
  }
}

const coursesPath = path.join(configDir, "courses.json");
let courses = [];
if (fs.existsSync(coursesPath)) {
  try {
    courses = JSON.parse(fs.readFileSync(coursesPath, "utf8"));
    check(Array.isArray(courses), "courses.json must be an array");
    for (const c of courses) {
      check(c.id && c.slug && c.title, "Course missing required fields");
      check(!definedCourseIds.has(c.id), "Duplicate course id: " + c.id);
      definedCourseIds.add(c.id);
      if (c.topic) {
        check(
          definedTopicIds.has(c.topic) || definedTopicSlugs.has(c.topic),
          "Course " + c.id + " unknown topic " + c.topic
        );
      }
      if (c.status) {
        check(vis.isValidLifecycle(c.status), "Course " + c.id + " invalid status " + c.status);
      }
    }
  } catch (err) {
    errors.push("Error parsing courses.json: " + err.message);
  }
}

function scanMarkdown(dir) {
  return scanFiles(dir, (name) => name.endsWith(".md"));
}

const lessonFiles = [
  ...scanMarkdown(path.join(contentDir, "lessons")),
  ...scanMarkdown(path.join(contentDir, "courses")),
];
const lessonCounts = {};
for (const filePath of lessonFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const m = content.match(/^course:\s*"?([a-z0-9-]+)"?/m);
  if (m) lessonCounts[m[1]] = (lessonCounts[m[1]] || 0) + 1;
}

const topicCounts = {};
for (const filePath of lessonFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const m = content.match(/^topic:\s*"?([a-z0-9-]+)"?/m);
  if (m) topicCounts[m[1]] = (topicCounts[m[1]] || 0) + 1;
}
for (const filePath of scanMarkdown(path.join(contentDir, "guides"))) {
  const content = fs.readFileSync(filePath, "utf8");
  const m = content.match(/^topic:\s*"?([a-z0-9-]+)"?/m);
  if (m) topicCounts[m[1]] = (topicCounts[m[1]] || 0) + 1;
}

if (platform) {
  for (const t of platform.topics || []) {
    if (t.enabled === false) continue;
    const status = vis.normalizeStatus(t.status);
    if (status !== "active") continue;
    const count = topicCounts[t.id] || topicCounts[t.slug] || 0;
    if (t.showOnHomepage !== false && count <= 0) {
      errors.push(
        "Active topic '" +
          t.id +
          "' is showOnHomepage but has zero published lessons/guides. Mark it planned/coming-soon or add content."
      );
    } else if (count <= 0) {
      warnings.push("Active topic '" + t.id + "' has zero content");
    }
  }
}

for (const c of courses) {
  if (c.enabled === false) continue;
  const status = vis.normalizeStatus(c.status);
  if (status !== "active") continue;
  const count = lessonCounts[c.id] || lessonCounts[c.slug] || 0;
  if (count <= 0) {
    errors.push(
      "Active course '" + c.id + "' has zero lessons. Mark it coming-soon or add lessons."
    );
  }
}

function isSiteRootUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().replace(/\/+$/, "");
  return [
    "https://github.com",
    "http://github.com",
    "https://www.github.com",
    "https://instagram.com",
    "https://www.instagram.com",
    "https://youtube.com",
    "https://www.youtube.com",
  ].includes(trimmed);
}

for (const filePath of scanMarkdown(path.join(contentDir, "projects"))) {
  const content = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(rootDir, filePath);
  const gh = content.match(/^githubUrl:\s*"?([^"\n]+)"?/m);
  const demo = content.match(/^demoUrl:\s*"?([^"\n]+)"?/m);
  if (gh && isSiteRootUrl(gh[1])) {
    errors.push("[" + relPath + "] githubUrl is a placeholder site root: " + gh[1]);
  }
  if (demo && isSiteRootUrl(demo[1])) {
    errors.push("[" + relPath + "] demoUrl is a placeholder site root: " + demo[1]);
  }
}

const codeRoots = [
  path.join(rootDir, "app"),
  path.join(rootDir, "components"),
  path.join(rootDir, "lib"),
];
const skipNames = new Set(["visibility-core.js", "visibility-core.d.ts", "scenario-test.js"]);
const frozenPatterns = [
  /getTopicBySlug\(\s*["']updates["']\s*\)/,
  /getTopicBySlug\(\s*["']interview["']\s*\)/,
  /getContentForTopic\(\s*["']updates["']\s*\)/,
  /getContentForTopic\(\s*["']interview["']\s*\)/,
  /function getTechnologyUpdates/,
  /function getInterviewContent/,
  /case\s+["']technology-updates["']/,
  /case\s+["']interviews["']/,
  /href:\s*["']\/topics\/updates["']/,
];

for (const root of codeRoots) {
  const files = scanFiles(root, (name) => /\.(ts|tsx|js|jsx)$/.test(name));
  for (const file of files) {
    if (skipNames.has(path.basename(file))) continue;
    const src = fs.readFileSync(file, "utf8");
    const rel = path.relative(rootDir, file);
    for (const pattern of frozenPatterns) {
      if (pattern.test(src)) {
        errors.push("Hardcoded frozen id in " + rel + ": " + pattern);
      }
    }
    if (/https?:\/\/github\.com\/?\s*["']/.test(src) && !rel.includes("visibility-core")) {
      warnings.push("Possible placeholder GitHub URL in " + rel);
    }
    if (src.includes("/file.svg")) {
      errors.push("Placeholder /file.svg in " + rel);
    }
  }
}

function problem(file, field, value, issue) {
  return (
    "Problem: " +
    issue +
    ". Fix: edit " +
    file +
    ", set FIELD " +
    field +
    " to VALUE " +
    value
  );
}

function parseMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    const parsed = matter(raw);
    return { data: parsed.data || {}, content: parsed.content || "", raw };
  } catch (err) {
    return { data: {}, content: raw, raw, parseError: err.message };
  }
}

function collectMarkdownGroup(relDir) {
  return scanMarkdown(path.join(contentDir, relDir)).map((filePath) => {
    const parsed = parseMarkdownFile(filePath);
    const rel = path.relative(rootDir, filePath);
    const filenameSlug = path.basename(filePath, ".md");
    const slug =
      typeof parsed.data.slug === "string" && parsed.data.slug.trim()
        ? parsed.data.slug.trim()
        : filenameSlug;
    return { filePath, rel, filenameSlug, slug, data: parsed.data, content: parsed.content, raw: parsed.raw, parseError: parsed.parseError };
  });
}

const lessonMarkdown = [
  ...collectMarkdownGroup("lessons"),
  ...collectMarkdownGroup("courses"),
];
const guideMarkdown = collectMarkdownGroup("guides");
const projectMarkdown = collectMarkdownGroup("projects");

function checkDuplicateSlugs(items, kind) {
  const seen = new Map();
  for (const item of items) {
    if (item.parseError) {
      errors.push(
        problem(item.rel, "frontmatter", "valid YAML between --- fences", "could not parse frontmatter (" + item.parseError + ")")
      );
      continue;
    }
    const key = String(item.slug || "").toLowerCase();
    if (!key) {
      errors.push(
        problem(item.rel, "slug", item.filenameSlug, kind + " is missing a slug and a usable filename")
      );
      continue;
    }
    if (seen.has(key)) {
      errors.push(
        problem(
          item.rel,
          "slug",
          "a unique " + kind + " slug (also used by " + seen.get(key) + ")",
          "duplicate " + kind + " slug '" + item.slug + "'"
        )
      );
    } else {
      seen.set(key, item.rel);
    }
  }
}

checkDuplicateSlugs(lessonMarkdown, "lesson");
checkDuplicateSlugs(guideMarkdown, "guide");
checkDuplicateSlugs(projectMarkdown, "project");

for (const item of [...lessonMarkdown, ...guideMarkdown, ...projectMarkdown]) {
  if (item.parseError) continue;
  const title = item.data.title;
  if (!title || (typeof title === "string" && !title.trim())) {
    errors.push(
      problem(item.rel, "title", '"A clear title"', "missing required frontmatter title")
    );
  }
}

for (const item of lessonMarkdown) {
  if (item.parseError) continue;
  const course = item.data.course;
  const topic = item.data.topic || item.data.topicSlug;
  if (!course || (typeof course === "string" && !String(course).trim())) {
    errors.push(
      problem(item.rel, "course", '"ai" or another courses.json id', "lesson is missing required frontmatter course")
    );
  }
  if (!topic || (typeof topic === "string" && !String(topic).trim())) {
    errors.push(
      problem(item.rel, "topic", '"ai" or another topics[].id', "lesson is missing required frontmatter topic")
    );
  }
}

const imageRefPattern = /!\[[^\]]*\]\((\/(?:brand|images)\/[^)\s]+)\)|<(?:img|Image)[^>]+(?:src|srcSet)=["'](\/(?:brand|images)\/[^"'\s]+)["']/gi;
for (const item of [...lessonMarkdown, ...guideMarkdown, ...projectMarkdown]) {
  const haystack = item.raw || "";
  let match;
  const found = new Set();
  imageRefPattern.lastIndex = 0;
  while ((match = imageRefPattern.exec(haystack))) {
    const relUrl = match[1] || match[2];
    if (relUrl) found.add(relUrl);
  }
  for (const relUrl of found) {
    const disk = path.join(publicDir, relUrl.replace(/^\//, ""));
    if (!fs.existsSync(disk)) {
      errors.push(
        problem(
          item.rel,
          "markdown image path " + relUrl,
          "a file that exists under public" + relUrl,
          "markdown image is missing on disk"
        )
      );
    }
  }
}

const FORBIDDEN_LINEAGE = "Ancient patience. Modern systems.";
const FORBIDDEN_DIARY = [
  FORBIDDEN_LINEAGE,
  "public learning journey",
  "public learning system",
  "learning in public",
  "I am learning in public",
  "I learn in public",
  "build in public",
  "public program",
  "creator journey",
  "my public journey",
  "Learn. Build. Stay Ahead.",
];

function scanForbiddenPhrase(dir, predicate) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForbiddenPhrase(full, predicate);
      continue;
    }
    if (!predicate(entry.name, full)) continue;
    const src = fs.readFileSync(full, "utf8");
    for (const phrase of FORBIDDEN_DIARY) {
      if (src.includes(phrase)) {
        errors.push(
          "ERROR:\nThe phrase \"" +
            phrase +
            "\" appears in " +
            path.relative(rootDir, full) +
            ".\n\nFix:\nRemove that framing. The site is a technology learning platform, not a diary or a slogan brand."
        );
      }
    }
  }
}
scanForbiddenPhrase(configDir, (name) => name.endsWith(".json"));
scanForbiddenPhrase(path.join(rootDir, "app"), (name) => /\.(ts|tsx|js|jsx)$/.test(name));
scanForbiddenPhrase(path.join(rootDir, "components"), (name) => /\.(ts|tsx|js|jsx)$/.test(name));
scanForbiddenPhrase(path.join(rootDir, "lib"), (name, full) => {
  if (path.basename(full) === "content-data.generated.ts") return false;
  return /\.(ts|tsx|js|jsx)$/.test(name);
});
scanForbiddenPhrase(path.join(rootDir, "templates"), (name) => true);
if (platform && platform.brand && Object.prototype.hasOwnProperty.call(platform.brand, "lineage")) {
  errors.push(
    "ERROR:\nplatform.json brand.lineage must not exist.\n\nFix:\nDelete brand.lineage from content/config/platform.json. The brand stands on its own."
  );
}

const startUnderscore = path.join(rootDir, "docs", "START_HERE.md");
if (fs.existsSync(startUnderscore)) {
  errors.push(
    "ERROR:\nDuplicate documentation entry docs/START_HERE.md.\n\nFix:\nKeep only docs/START-HERE.md and delete docs/START_HERE.md."
  );
}

const STALE_DOC_PHRASES = [
  "Start / Journey / About",
  "Overflow disclosure is More",
  "See the 120-day journey",
];
function scanStaleDocs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanStaleDocs(full);
      continue;
    }
    if (!entry.name.endsWith(".md")) continue;
    const src = fs.readFileSync(full, "utf8");
    for (const phrase of STALE_DOC_PHRASES) {
      if (src.includes(phrase)) {
        errors.push(
          "ERROR:\nStale documentation phrase \"" +
            phrase +
            "\" in " +
            path.relative(rootDir, full) +
            ".\n\nFix:\nNav is Start / 120 Days / About. Overflow is Explore. Update the doc to match platform.json."
        );
      }
    }
  }
}
scanStaleDocs(path.join(rootDir, "docs"));

if (platform && platform.navigation && Array.isArray(platform.navigation.main)) {
  for (const item of platform.navigation.main) {
    if (item && /journey/i.test(String(item.label || ""))) {
      errors.push(
        "ERROR:\nnavigation.main item '" +
          item.id +
          "' is still labelled Journey.\n\nFix:\nUse a learner-centric label such as 120 Days."
      );
    }
  }
}

if (platform && platform.copy && platform.brand) {
  if (platform.copy.heroTitle && platform.copy.heroTitle === platform.brand.name) {
    errors.push(
      "ERROR:\ncopy.heroTitle repeats the brand name.\n\nFix:\nLeave heroTitle empty so the hero uses the current program title."
    );
  }
  if (platform.copy.heroBadge && platform.copy.heroBadge === platform.brand.name) {
    errors.push(
      "ERROR:\ncopy.heroBadge repeats the brand name.\n\nFix:\nUse a kicker such as Current program."
    );
  }
}

const seriesPath = path.join(configDir, "series.json");
if (fs.existsSync(seriesPath)) {
  try {
    const series = JSON.parse(fs.readFileSync(seriesPath, "utf8"));
    if (!Array.isArray(series)) {
      errors.push("series.json must be an array");
    } else {
      for (const item of series) {
        if (item && item.enabled === true) {
          errors.push(
            "series.json entry '" +
              (item.id || "?") +
              "' is enabled, but the site has no series UI. Keep enabled: false until a series surface exists."
          );
        }
      }
    }
  } catch (err) {
    errors.push("Error parsing series.json: " + err.message);
  }
}

const nextConfigSource = fs.readFileSync(path.join(rootDir, "next.config.ts"), "utf8");
if (!nextConfigSource.includes("generate-content-data.js")) {
  errors.push(
    "ERROR:\nnext.config.ts no longer regenerates the content catalog.\n\nFix:\nKeep the generateContentData() call (via createRequire) at the top of next.config.ts so `npx next build` cannot compile a stale published-lesson allow-list."
  );
}

try {
  const generated = generateContentData(rootDir);
  const expectedSlugs = collectPublishedLessonSlugs(generated.embedded);
  const expectedStatic = collectStaticLearnSegments(rootDir);
  const slugFile = fs.readFileSync(generated.slugPath, "utf8");
  const writtenSlugs = JSON.parse(slugFile.match(/PUBLISHED_LESSON_SLUGS = (\[[^\]]*\])/s)[1]);
  const writtenStatic = JSON.parse(slugFile.match(/STATIC_LEARN_SEGMENTS = (\[[^\]]*\])/s)[1]);
  if (JSON.stringify(writtenSlugs) !== JSON.stringify(expectedSlugs)) {
    errors.push(
      "ERROR:\nlib/published-lesson-slugs.generated.ts does not match published markdown.\n\nFix:\nRun node scripts/generate-content-data.js. Adding a lesson file must regenerate this allow-list before next build."
    );
  }
  if (JSON.stringify(writtenStatic) !== JSON.stringify(expectedStatic)) {
    errors.push(
      "ERROR:\nSTATIC_LEARN_SEGMENTS does not match app/learn static folders.\n\nFix:\nDo not hardcode /learn exceptions in middleware. They are generated from app/learn/* directories."
    );
  }
  if (!expectedSlugs.includes("day-01")) {
    errors.push("ERROR:\nPublished slug catalog is missing day-01.");
  }
  if (expectedSlugs.includes("day-04") === false && fs.existsSync(path.join(rootDir, "content/lessons/day-04.md"))) {
    errors.push("ERROR:\nday-04.md exists on disk but is not in the published slug catalog.");
  }
  const probeEmbedded = Object.assign({}, generated.embedded, {
    "content/lessons/day-04.md": "---\ntitle: Permissions as an incident\nstatus: published\n---\n",
  });
  if (!collectPublishedLessonSlugs(probeEmbedded).includes("day-04")) {
    errors.push(
      "ERROR:\nAdding content/lessons/day-04.md would not enter the published slug catalog.\n\nFix:\nscripts/generate-content-data.js collectPublishedLessonSlugs must include new public lesson files so middleware cannot keep 404ing a newly published day."
    );
  }
} catch (err) {
  errors.push("ERROR:\nCould not verify generated lesson slug catalog: " + err.message);
}

function operatorFix(issue, file, field, value) {
  return (
    "ERROR:\n" +
    issue +
    "\n\nFix:\nEdit " +
    file +
    ". Set FIELD " +
    field +
    " to VALUE " +
    value +
    "."
  );
}

const programsPath = path.join(configDir, "programs.json");
check(fs.existsSync(programsPath), operatorFix(
  "Missing DevOps Engineer Mastery program file.",
  "content/config/programs.json",
  "(file)",
  "a JSON program with 120 days and 11 phases"
));

let programConfig = null;
if (fs.existsSync(programsPath)) {
  try {
    programConfig = JSON.parse(fs.readFileSync(programsPath, "utf8"));
  } catch (err) {
    errors.push(operatorFix(
      "programs.json is not valid JSON (" + err.message + ")",
      "content/config/programs.json",
      "JSON",
      "valid JSON"
    ));
  }
}

if (programConfig) {
  for (const err of collectProgramErrors(programConfig)) {
    errors.push(err);
  }

  const phaseIds = new Set(
    (programConfig.phases || []).map((phase) => phase && phase.id).filter(Boolean)
  );
  const dayByNumber = new Map();
  for (const day of programConfig.days || []) {
    if (day && typeof day.day === "number") dayByNumber.set(day.day, day);
  }

  const publishedDayNumbers = new Set();
  for (const item of lessonMarkdown) {
    if (item.parseError) continue;
    const data = item.data || {};
    const dayNumber =
      typeof data.day === "number"
        ? data.day
        : typeof data.day === "string" && data.day.trim()
          ? Number(data.day)
          : NaN;
    const phase = typeof data.phase === "string" ? data.phase.trim() : "";
    const programId = typeof data.program === "string" ? data.program.trim() : "";

    if (Number.isFinite(dayNumber)) {
      if (publishedDayNumbers.has(dayNumber)) {
        errors.push(operatorFix(
          "Two lessons both claim day " + dayNumber + ". The second file is \"" + item.rel + "\".",
          item.rel,
          "day",
          "a unique day number that is not already used"
        ));
      }
      publishedDayNumbers.add(dayNumber);
      const planned = dayByNumber.get(dayNumber);
      if (!planned) {
        errors.push(operatorFix(
          "Lesson \"" + item.slug + "\" uses day " + dayNumber + ", which is not in the 120-day program map.",
          item.rel,
          "day",
          "a day number that exists in content/config/programs.json"
        ));
      } else {
        if (phase && planned.phaseId && phase !== planned.phaseId) {
          errors.push(operatorFix(
            "Lesson \"" + item.slug + "\" references phase \"" + phase + "\" but day " + dayNumber + " belongs to \"" + planned.phaseId + "\".",
            item.rel,
            "phase",
            planned.phaseId
          ));
        }
        if (item.slug !== planned.slug && planned.slug) {
          warnings.push(
            "Lesson file slug \"" +
              item.slug +
              "\" does not match programs.json slug \"" +
              planned.slug +
              "\" for day " +
              dayNumber +
              ". That is allowed only if you intend a stable URL different from the day slug."
          );
        }
      }
    }

    if (phase && phaseIds.size && !phaseIds.has(phase)) {
      errors.push(operatorFix(
        "Lesson \"" + item.slug + "\" references phase \"" + phase + "\".",
        item.rel,
        "phase",
        "an existing phase ID from content/config/programs.json (example: phase-01)"
      ));
    }

    if (programId && programConfig.id && programId !== programConfig.id) {
      errors.push(operatorFix(
        "Lesson \"" + item.slug + "\" references program \"" + programId + "\".",
        item.rel,
        "program",
        programConfig.id
      ));
    }

    if ((phase || Number.isFinite(dayNumber) || programId) && data.course && programConfig.id) {
      if (data.course !== programConfig.id && Number.isFinite(dayNumber)) {
        errors.push(operatorFix(
          "Lesson \"" + item.slug + "\" is day " + dayNumber + " but course is \"" + data.course + "\".",
          item.rel,
          "course",
          programConfig.id
        ));
      }
    }
  }
}

console.log("Running scenario tests...");
const scenariosOk = runScenarioTests();
check(scenariosOk, "Scenario tests failed");

console.log("\n" + "=".repeat(60));
if (errors.length > 0) {
  console.error("Validation failed with " + errors.length + " error(s):");
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("ALL CHECKS PASSED");
if (warnings.length > 0) {
  console.log("\n" + warnings.length + " warning(s):");
  warnings.forEach((w) => console.log("  - " + w));
}
process.exit(0);
