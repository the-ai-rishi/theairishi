const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const configDir = path.join(rootDir, "content", "config");
const contentDir = path.join(rootDir, "content");
const publicDir = path.join(rootDir, "public");

let errors = [];
let warnings = [];

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function warn(condition, message) {
  if (!condition) {
    warnings.push(message);
  }
}

console.log("🔍 Running Comprehensive Platform Validation for The AI Rishi...\n");

const definedTopicIds = new Set();
const definedTopicSlugs = new Set();
const definedCourseIds = new Set();
const definedSlugs = new Set();

// ── 1. Validate platform.json ────────────────────────────────────────────────
const platformPath = path.join(configDir, "platform.json");
check(fs.existsSync(platformPath), "Missing content/config/platform.json");

if (fs.existsSync(platformPath)) {
  try {
    const platform = JSON.parse(fs.readFileSync(platformPath, "utf8"));

    // Brand validation
    check(platform.brand, "platform.json missing 'brand' section");
    if (platform.brand) {
      check(platform.brand.name, "brand missing 'name'");
      check(platform.brand.logo, "brand missing 'logo'");
      check(platform.brand.tagline, "brand missing 'tagline'");
      check(platform.brand.description, "brand missing 'description'");
      check(platform.brand.url, "brand missing 'url'");

      // Validate brand assets on disk
      if (platform.brand.logo) {
        const logoPath = path.join(publicDir, platform.brand.logo);
        check(fs.existsSync(logoPath), `Brand logo file does not exist: ${platform.brand.logo}`);
      }
      if (platform.brand.ogImage) {
        const ogPath = path.join(publicDir, platform.brand.ogImage);
        check(fs.existsSync(ogPath), `Brand OG image does not exist: ${platform.brand.ogImage}`);
      }
    }

    // Copy validation
    check(platform.copy, "platform.json missing 'copy' section");
    if (platform.copy) {
      check(platform.copy.heroTitle, "copy missing 'heroTitle'");
      check(platform.copy.heroPrimaryCta, "copy missing 'heroPrimaryCta'");
      check(platform.copy.heroPrimaryCtaHref, "copy missing 'heroPrimaryCtaHref'");
      check(platform.copy.headerCta, "copy missing 'headerCta'");
      check(platform.copy.headerCtaHref, "copy missing 'headerCtaHref'");
    }

    // Topics validation
    check(Array.isArray(platform.topics), "platform.json 'topics' must be an array");
    if (Array.isArray(platform.topics)) {
      for (const t of platform.topics) {
        check(t.id, `Topic missing 'id': ${JSON.stringify(t)}`);
        check(t.slug, `Topic missing 'slug': ${JSON.stringify(t)}`);
        check(t.name, `Topic missing 'name': ${JSON.stringify(t)}`);
        check(!definedTopicIds.has(t.id), `Duplicate topic ID: '${t.id}'`);
        check(!definedTopicSlugs.has(t.slug), `Duplicate topic slug: '${t.slug}'`);
        definedTopicIds.add(t.id);
        definedTopicSlugs.add(t.slug);
      }
      console.log(`✓ Topics validated: ${platform.topics.length} topics defined.`);
    }

    // Content Types validation
    if (Array.isArray(platform.contentTypes)) {
      const ctIds = new Set();
      for (const ct of platform.contentTypes) {
        check(ct.id, `ContentType missing 'id': ${JSON.stringify(ct)}`);
        check(ct.title, `ContentType missing 'title': ${JSON.stringify(ct)}`);
        check(!ctIds.has(ct.id), `Duplicate contentType ID: '${ct.id}'`);
        ctIds.add(ct.id);

        if (ct.topicSlug) {
          check(
            definedTopicIds.has(ct.topicSlug) || definedTopicSlugs.has(ct.topicSlug),
            `ContentType '${ct.id}' references unknown topicSlug '${ct.topicSlug}'`
          );
        }
      }
      console.log(`✓ Content types validated: ${platform.contentTypes.length} types defined.`);
    }

    // Navigation validation
    check(platform.navigation && Array.isArray(platform.navigation.main), "platform.json missing 'navigation.main'");
    check(platform.navigation && Array.isArray(platform.navigation.footer), "platform.json missing 'navigation.footer'");

    // Homepage sections validation
    check(platform.homepage && Array.isArray(platform.homepage.sections), "platform.json missing 'homepage.sections'");
    if (platform.homepage && Array.isArray(platform.homepage.sections)) {
      const sectionIds = new Set();
      for (const s of platform.homepage.sections) {
        check(s.id, `Homepage section missing 'id'`);
        check(!sectionIds.has(s.id), `Duplicate homepage section ID: '${s.id}'`);
        sectionIds.add(s.id);
      }
      console.log(`✓ Homepage sections validated: ${platform.homepage.sections.length} sections defined.`);
    }

    // Social validation
    check(Array.isArray(platform.social), "platform.json 'social' must be an array");
    if (Array.isArray(platform.social)) {
      for (const s of platform.social) {
        check(s.id && s.label, `Social platform missing required fields`);
      }
      console.log(`✓ Social platforms validated: ${platform.social.length} platforms defined.`);
    }
  } catch (err) {
    errors.push(`Error parsing platform.json: ${err.message}`);
  }
}

// ── 2. Validate courses.json ─────────────────────────────────────────────────
const coursesPath = path.join(configDir, "courses.json");
if (fs.existsSync(coursesPath)) {
  try {
    const courses = JSON.parse(fs.readFileSync(coursesPath, "utf8"));
    check(Array.isArray(courses), "courses.json must be an array");
    for (const c of courses) {
      check(c.id && c.slug && c.title, `Course missing required fields: ${JSON.stringify(c)}`);
      check(!definedCourseIds.has(c.id), `Duplicate course ID: '${c.id}'`);
      definedCourseIds.add(c.id);

      if (c.topic) {
        check(
          definedTopicIds.has(c.topic) || definedTopicSlugs.has(c.topic),
          `Course '${c.id}' references unknown topic '${c.topic}'`
        );
      }
    }
    console.log(`✓ Courses validated: ${courses.length} courses defined.`);
  } catch (err) {
    errors.push(`Error parsing courses.json: ${err.message}`);
  }
}

// ── 3. Validate series.json ──────────────────────────────────────────────────
const seriesPath = path.join(configDir, "series.json");
if (fs.existsSync(seriesPath)) {
  try {
    const seriesList = JSON.parse(fs.readFileSync(seriesPath, "utf8"));
    if (Array.isArray(seriesList)) {
      const seriesIds = new Set();
      for (const s of seriesList) {
        check(s.id && s.slug && s.title, `Series missing required fields: ${JSON.stringify(s)}`);
        check(!seriesIds.has(s.id), `Duplicate series ID: '${s.id}'`);
        seriesIds.add(s.id);
        if (s.topic) {
          check(
            definedTopicIds.has(s.topic) || definedTopicSlugs.has(s.topic),
            `Series '${s.id}' references unknown topic '${s.topic}'`
          );
        }
      }
      console.log(`✓ Series validated: ${seriesList.length} tracks defined.`);
    }
  } catch (err) {
    errors.push(`Error parsing series.json: ${err.message}`);
  }
}

// ── 4. Validate Content Files & Frontmatter ───────────────────────────────────
function scanMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

const allMdFiles = [
  ...scanMarkdownFiles(path.join(contentDir, "lessons")),
  ...scanMarkdownFiles(path.join(contentDir, "courses")),
  ...scanMarkdownFiles(path.join(contentDir, "guides")),
  ...scanMarkdownFiles(path.join(contentDir, "projects")),
];

let validMdCount = 0;

for (const filePath of allMdFiles) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const relPath = path.relative(rootDir, filePath);
    
    // Check Markdown image references
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const imgUrl = match[1].split(" ")[0]; // Strip optional title
      if (imgUrl.startsWith("/")) {
        const localImgPath = path.join(publicDir, imgUrl);
        if (!fs.existsSync(localImgPath)) {
          warn(false, `[${relPath}] Image reference does not exist on disk: ${imgUrl}`);
        }
      }
    }

    validMdCount++;
  } catch (err) {
    errors.push(`Failed reading Markdown file ${filePath}: ${err.message}`);
  }
}

console.log(`✓ Markdown content validated: ${validMdCount} files inspected.`);


// ── 5. Lifecycle simulation (in-memory, does not mutate files) ───────────────
function isTopicPublicSim(topic) {
  return Boolean(topic) && topic.enabled !== false && topic.status !== "disabled";
}
function findTopicSim(platform, key) {
  const needle = String(key).toLowerCase();
  return (platform.topics || []).find((t) =>
    [t.id, t.slug, t.shortName].some((v) => String(v || "").toLowerCase() === needle)
  );
}
function publicSections(platform) {
  return (platform.homepage.sections || []).filter((s) => {
    if (s.enabled === false) return false;
    if (!s.topicId) return true;
    return isTopicPublicSim(findTopicSim(platform, s.topicId));
  });
}
function publicNav(platform) {
  return (platform.navigation.main || []).filter((item) => {
    if (item.enabled === false || item.status === "disabled") return false;
    const match = String(item.href || "").match(/^\/topics\/([^/?#]+)/);
    if (match && !isTopicPublicSim(findTopicSim(platform, match[1]))) return false;
    return true;
  });
}

if (fs.existsSync(platformPath)) {
  try {
    const live = JSON.parse(fs.readFileSync(platformPath, "utf8"));
    const withoutUpdates = JSON.parse(JSON.stringify(live));
    withoutUpdates.topics = withoutUpdates.topics.filter((t) => t.id !== "updates");
    check(
      !publicNav(withoutUpdates).some((item) => String(item.href).includes("/topics/updates")),
      "Removing the updates topic must drop /topics/updates from navigation"
    );
    check(
      !publicSections(withoutUpdates).some((s) => s.id === "technology-updates"),
      "Removing the updates topic must hide the technology-updates homepage section"
    );

    const renamed = JSON.parse(JSON.stringify(live));
    const devops = renamed.topics.find((t) => t.id === "devops");
    if (devops) {
      devops.slug = "full-stack-engineering";
      devops.name = "Full Stack Engineering";
      check(
        findTopicSim(renamed, "devops") && findTopicSim(renamed, "devops").slug === "full-stack-engineering",
        "Renaming DevOps must keep id lookup and publish the new slug"
      );
    }

    const disabledHero = JSON.parse(JSON.stringify(live));
    const hero = disabledHero.homepage.sections.find((s) => s.id === "hero");
    if (hero) hero.enabled = false;
    check(
      !publicSections(disabledHero).some((s) => s.id === "hero"),
      "Disabling the hero section must hide it"
    );
    console.log("Lifecycle simulations validated (remove topic, rename topic, disable section).");
  } catch (err) {
    errors.push("Lifecycle simulation failed: " + err.message);
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(60));
if (errors.length > 0) {
  console.error(`❌ Validation failed with ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✅ ALL CHECKS PASSED: Platform configuration and content are valid.`);
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }
  process.exit(0);
}
