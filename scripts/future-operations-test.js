"use strict";

/**
 * Simulate the 14 future operations from the future-ready review.
 * These tests prove the operator can grow the site from JSON/markdown
 * without editing React, unless a genuinely new UI type is introduced.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const vis = require("../lib/visibility-core");
const social = require("../lib/social");
const publish = require("../lib/lesson-publish");
const {
  collectProgramErrors,
  parseProgramCatalog,
  parseProgramConfig,
  asProgramCatalog,
} = require("../lib/program-schema");
const { collectPlatformConfigErrors } = require("../lib/platform-schema");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function miniProgram(overrides) {
  return Object.assign(
    {
      id: "devops-engineer-mastery",
      slug: "devops-engineer-mastery",
      title: "DevOps Engineer Mastery",
      durationLabel: "120 days",
      currentPhaseId: "phase-01",
      repoUrl: "https://github.com/the-ai-rishi/devops-engineer-mastery",
      status: "active",
      enabled: true,
      featured: true,
      startHref: "/learn/day-01",
      description: "Practical DevOps.",
      capstone: "One system.",
      phases: [
        {
          id: "phase-01",
          number: 1,
          name: "Foundations",
          daysLabel: "1–2",
          startDay: 1,
          endDay: 2,
          summary: "Shell and Git.",
        },
      ],
      days: [
        { day: 1, phaseId: "phase-01", slug: "day-01", title: "Shell", summary: "PATH and exit codes." },
        { day: 2, phaseId: "phase-01", slug: "day-02", title: "Git", summary: "A real repo." },
      ],
    },
    overrides || {}
  );
}

function catalogOf(programs, featuredProgramId) {
  const list = (Array.isArray(programs) ? programs : [programs]).map((program) => clone(program));
  return {
    featuredProgramId: featuredProgramId || list[0].id,
    programs: list,
  };
}

function emptyCat() {
  return vis.emptyCatalog();
}

function runFutureOperationsTests(livePlatform) {
  const failures = [];
  function check(condition, message) {
    if (!condition) failures.push(message);
  }

  const livePrograms = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "content", "config", "programs.json"), "utf8")
  );

  // A. Add Day 4 — markdown + existing program day title
  const day4 =
    "---\ntitle: Day 4\ncourse: devops-engineer-mastery\nstage: Foundations\nlesson: 4\nstatus: published\n---\nbody\n";
  check(publish.isPublicLessonMarkdown(day4) === true, "Op A: complete Day 4 markdown is public");
  check(
    publish.collectPublishedLessonSlugs({ "content/lessons/day-04.md": day4 }).includes("day-04"),
    "Op A: Day 4 file becomes a /learn slug without component edits"
  );
  const liveDays = (asProgramCatalog(livePrograms).programs[0].days || []).map((d) => d.day);
  check(liveDays.includes(4), "Op A: Day 4 already exists as a title in programs.json");

  // B. Add Day 5 as title-only
  check(liveDays.includes(5), "Op B: Day 5 already exists as a title in programs.json");
  check(
    !publish.collectPublishedLessonSlugs({ "content/lessons/day-01.md": day4 }).includes("day-05"),
    "Op B: title-only Day 5 is not a public lesson"
  );

  // C. Add Phase 12 if the curriculum expands
  const expanded = clone(asProgramCatalog(livePrograms).programs[0]);
  expanded.phases.push({
    id: "phase-12",
    number: 12,
    name: "War room II",
    daysLabel: "121–121",
    startDay: 121,
    endDay: 121,
    summary: "Another pass.",
  });
  expanded.days.push({
    day: 121,
    phaseId: "phase-12",
    slug: "day-121",
    title: "Next pass",
    summary: "Copied from the mastery repo, not invented.",
  });
  expanded.mapTitle = "Twelve phases";
  const phase12Errors = collectProgramErrors(catalogOf(expanded));
  check(phase12Errors.length === 0, "Op C: adding Phase 12 is a programs.json change, not a schema rewrite");

  // D. Add AI as a second program later
  const aiStub = {
    id: "ai-foundations",
    slug: "ai-foundations",
    title: "AI Foundations",
    status: "planned",
    enabled: false,
    featured: false,
    description: "Later.",
  };
  const withAi = catalogOf([asProgramCatalog(livePrograms).programs[0], aiStub]);
  const aiErrors = collectProgramErrors(withAi);
  check(aiErrors.length === 0, "Op D: a planned AI program can sit in the catalog without phases");
  check(parseProgramConfig(withAi).id === "devops-engineer-mastery", "Op D: featured program stays DevOps");

  // E. Add Agentic AI later
  const agentsStub = {
    id: "agentic-ai",
    slug: "agentic-ai",
    title: "Agentic AI",
    status: "planned",
    enabled: false,
    featured: false,
  };
  const withAgents = catalogOf([
    asProgramCatalog(livePrograms).programs[0],
    aiStub,
    agentsStub,
  ]);
  check(collectProgramErrors(withAgents).length === 0, "Op E: Agentic AI can be added as a planned program");

  // Activate AI without replacing DevOps as current
  const aiActive = Object.assign({}, miniProgram(), {
    id: "ai-foundations",
    slug: "ai-foundations",
    title: "AI Foundations",
    featured: false,
    startHref: "/learn/ai-fundamentals-01",
  });
  const twoActive = catalogOf([miniProgram(), aiActive]);
  const twoParsed = parseProgramCatalog(twoActive);
  check(twoParsed.programs.length === 2, "Op D/E: catalog holds two programs");
  check(parseProgramConfig(twoActive).id === "devops-engineer-mastery", "Op D: homepage featured stays DevOps until featuredProgramId changes");

  // F. Add a navigation tab called AI
  const tF = clone(livePlatform);
  tF.navigation.main.push({
    id: "ai-program",
    label: "AI",
    href: "/programs/ai-foundations",
    enabled: true,
    order: 6,
    status: "active",
    placement: "explore",
  });
  check(collectPlatformConfigErrors(tF, vis).length === 0, "Op F: adding an AI tab is valid configuration");
  const navF = vis.resolveNavItems(tF, emptyCat(), "main");
  check(navF.some((item) => item.id === "ai-program" && item.label === "AI"), "Op F: AI tab appears from config");
  const splitF = vis.splitPrimaryNav(navF, 3);
  check(
    splitF.explore.some((item) => item.id === "ai-program") &&
      !splitF.primary.some((item) => item.id === "ai-program"),
    "Op F: placement explore keeps AI out of the primary verbs"
  );

  // G. Remove that tab
  const tG = clone(tF);
  const aiNav = tG.navigation.main.find((item) => item.id === "ai-program");
  aiNav.enabled = false;
  const navG = vis.resolveNavItems(tG, emptyCat(), "main");
  check(!navG.some((item) => item.id === "ai-program"), "Op G: disabling the tab removes it, no dead link");

  // H. Add Instagram as a real external destination (live config)
  const instagram = (livePlatform.social || []).find((ch) => ch.id === "instagram");
  check(instagram && social.isPublicDestination(instagram), "Op H: Instagram is a public external destination");
  check(
    social.destinationUrl(instagram) === "https://www.instagram.com/theairishi/",
    "Op H: Instagram URL is the real profile"
  );
  check(
    vis.channelRouteState(livePlatform, "instagram", emptyCat()).state === "not-found",
    "Op H: Instagram is not a fake /instagram site route"
  );
  const destHome = vis.resolveHomepageSections(livePlatform, emptyCat()).sections;
  check(
    destHome.some((section) => section.type === "destinations"),
    "Op H: homepage destinations block is config-driven"
  );
  const destSection = destHome.find((section) => section.type === "destinations");
  check(
    destSection && destSection.data.destinations.some((ch) => ch.id === "instagram"),
    "Op H: destinations lists Instagram"
  );

  // Change Instagram later — one field
  const tH2 = clone(livePlatform);
  const ig2 = tH2.social.find((ch) => ch.id === "instagram");
  ig2.url = "https://www.instagram.com/theairishi/";
  check(social.destinationUrl(ig2).includes("instagram.com/theairishi"), "Op H: changing Instagram is one url field");

  // I. Telegram: live documented placeholder; replace later with a real t.me URL
  const telegram = (livePlatform.social || []).find((ch) => ch.id === "telegram");
  check(telegram && telegram.enabled !== false, "Op I live: Telegram is enabled");
  check(
    social.isTelegramTemporaryUrl(telegram && telegram.url),
    "Op I live: Telegram uses the documented example.com placeholder, not a fake t.me group"
  );
  check(social.isPublicDestination(telegram), "Op I live: Telegram placeholder is a public destination");
  check(social.includeInSameAs(telegram) === false, "Op I live: Telegram placeholder is not in sameAs");
  check(
    social.publicDestinations(livePlatform).some((ch) => ch.id === "telegram"),
    "Op I live: Telegram appears in destinations"
  );

  const tIbad = clone(livePlatform);
  const tgBad = tIbad.social.find((ch) => ch.id === "telegram");
  tgBad.enabled = true;
  tgBad.status = "active";
  tgBad.url = "";
  check(
    social.collectSocialErrors(tIbad.social).some((err) => /telegram/i.test(err)),
    "Op I: enabling Telegram without a URL fails validation"
  );
  const tIph = clone(livePlatform);
  const tgPh = tIph.social.find((ch) => ch.id === "telegram");
  tgPh.enabled = true;
  tgPh.status = "active";
  tgPh.url = "https://t.me/your-real-community";
  check(
    social.collectSocialErrors(tIph.social).some((err) => /telegram/i.test(err)),
    "Op I: an invented t.me placeholder is rejected"
  );
  const tIseo = clone(livePlatform);
  const tgSeo = tIseo.social.find((ch) => ch.id === "telegram");
  tgSeo.includeInSameAs = true;
  check(
    social.collectSocialErrors(tIseo.social).some((err) => /sameAs|placeholder/i.test(err)),
    "Op I: placeholder Telegram cannot set includeInSameAs true"
  );
  const tIok = clone(livePlatform);
  const tgOk = tIok.social.find((ch) => ch.id === "telegram");
  tgOk.enabled = true;
  tgOk.status = "active";
  tgOk.url = "https://t.me/theairishi";
  tgOk.includeInSameAs = true;
  check(
    social.collectSocialErrors(tIok.social).length === 0,
    "Op I: replacing the placeholder with a real t.me URL is one config change"
  );
  check(social.isPublicDestination(tgOk), "Op I: real Telegram stays a public destination");
  check(social.isTemporaryDestination(tgOk) === false, "Op I: real Telegram is not temporary");
  check(social.includeInSameAs(tgOk) === true, "Op I: real Telegram may enter sameAs when includeInSameAs is true");
  check(
    social.sameAsUrls(tIok).some((url) => /t\.me\/theairishi/i.test(url)),
    "Op I: sameAs includes Telegram only after a real community URL"
  );
  check(
    !social.sameAsUrls(livePlatform).some((url) => /example\.com/i.test(url) || /t\.me\//i.test(url)),
    "Op I live: sameAs does not include the Telegram placeholder"
  );

  // GitHub: hidden now, restorable later from the same row
  const github = (livePlatform.social || []).find((ch) => ch.id === "github");
  check(github && github.enabled === false, "GitHub live: enabled false");
  check(!social.isPublicDestination(github), "GitHub live: not a public destination");
  check(
    !social.publicDestinations(livePlatform).some((ch) => ch.id === "github"),
    "GitHub live: absent from destinations"
  );
  check(
    !social.sameAsUrls(livePlatform).some((url) => /github\.com/i.test(url)),
    "GitHub live: absent from sameAs"
  );
  const tGh = clone(livePlatform);
  const ghOn = tGh.social.find((ch) => ch.id === "github");
  ghOn.enabled = true;
  ghOn.status = "active";
  ghOn.showInFooter = true;
  ghOn.showOnAbout = true;
  ghOn.includeInSameAs = true;
  check(social.collectSocialErrors(tGh.social).length === 0, "GitHub restore: enabling the existing URL is valid");
  check(social.isPublicDestination(ghOn), "GitHub restore: becomes a public destination");
  check(
    social.sameAsUrls(tGh).some((url) => /github\.com\/the-ai-rishi/i.test(url)),
    "GitHub restore: may enter sameAs when includeInSameAs is true"
  );

  // A new external channel without an icon is still config-only
  const tNew = clone(livePlatform);
  tNew.social.push({
    id: "mastodon",
    label: "Mastodon",
    kind: "external",
    url: "https://mastodon.social/@theairishi",
    enabled: true,
    status: "active",
    order: 9,
    showInFooter: true,
    showOnHomepage: true,
    includeInSameAs: false,
  });
  check(social.collectSocialErrors(tNew.social).length === 0, "New social id is valid configuration");
  check(
    social.publicDestinations(tNew).some((ch) => ch.id === "mastodon"),
    "New social id appears as a text destination without an icon registry change"
  );

  // J. Enable YouTube later — config + real items, still an internal listing
  const tJ = clone(livePlatform);
  const yt = tJ.social.find((ch) => ch.id === "youtube");
  yt.enabled = true;
  yt.status = "active";
  yt.kind = "internal";
  yt.href = "/youtube";
  const catJ = Object.assign(emptyCat(), { channelItemCounts: { youtube: 2 } });
  check(
    vis.channelRouteState(tJ, "youtube", catJ).state === "active",
    "Op J: YouTube becomes a site route only when active with items"
  );
  check(
    vis.channelRouteState(tJ, "youtube", emptyCat()).state === "not-found",
    "Op J: YouTube with zero items stays not-found"
  );

  // K. Add / reorder a homepage section
  const tK = clone(livePlatform);
  const why = tK.homepage.sections.find((section) => section.id === "why");
  const today = tK.homepage.sections.find((section) => section.id === "today");
  const whyOrder = why.order;
  why.order = today.order;
  today.order = whyOrder;
  const homeK = vis.resolveHomepageSections(tK, emptyCat()).sections;
  const whyIndex = homeK.findIndex((section) => section.id === "why");
  const todayIndex = homeK.findIndex((section) => section.id === "today");
  check(todayIndex < whyIndex, "Op K: homepage order follows configuration");

  // L. Change which program is featured
  const swapped = catalogOf(
    [miniProgram({ featured: false }), Object.assign({}, aiActive, { featured: true })],
    "ai-foundations"
  );
  check(parseProgramConfig(swapped).id === "ai-foundations", "Op L: featuredProgramId selects the homepage program");
  check(
    parseProgramConfig(catalogOf([miniProgram(), Object.assign({}, aiActive, { featured: false })])).id ===
      "devops-engineer-mastery",
    "Op L: omitting the swap keeps DevOps featured"
  );

  // M. Disable a program
  const disabledAi = catalogOf([
    miniProgram(),
    Object.assign({}, aiActive, { enabled: false, status: "disabled", featured: false }),
  ]);
  check(collectProgramErrors(disabledAi).length === 0, "Op M: a non-featured program can be disabled");
  check(parseProgramConfig(disabledAi).id === "devops-engineer-mastery", "Op M: disabling AI does not replace DevOps");

  // N. Restore a previously disabled program
  const restored = catalogOf([miniProgram(), Object.assign({}, aiActive, { enabled: true, status: "active", featured: false })]);
  check(collectProgramErrors(restored).length === 0, "Op N: restoring a program is enabled + status active");
  check(
    parseProgramCatalog(restored).programs.some((program) => program.id === "ai-foundations" && program.enabled === true),
    "Op N: restored program is back in the catalog"
  );

  // Disabling the featured program is rejected
  const disableFeatured = catalogOf([miniProgram({ enabled: false, status: "disabled" })]);
  check(collectProgramErrors(disableFeatured).length > 0, "Op M/N: the featured current program cannot be disabled");

  // Copy: Start label change is config
  const tStart = clone(livePlatform);
  tStart.navigation.main.find((item) => item.id === "start").label = "Begin";
  tStart.copy.headerCta = "Begin Day 1";
  const navStart = vis.resolveNavItems(tStart, emptyCat(), "main");
  check(navStart.some((item) => item.id === "start" && item.label === "Begin"), "Start label is configuration");

  // Hide destinations
  const tHide = clone(livePlatform);
  tHide.homepage.sections.find((section) => section.id === "destinations").enabled = false;
  check(
    !vis.resolveHomepageSections(tHide, emptyCat()).sections.some((section) => section.type === "destinations"),
    "Hiding destinations is enabled: false"
  );

  // Hide a guide via content type
  const tGuides = clone(livePlatform);
  tGuides.contentTypes.find((ct) => ct.id === "guides").enabled = false;
  const navGuides = vis.resolveNavItems(tGuides, emptyCat(), "main");
  check(!navGuides.some((item) => item.id === "guides"), "Hiding Guides drops the nav item");

  // Featured program counts must not mix archive DevOps notes
  const lessonsDir = path.join(__dirname, "..", "content", "lessons");
  const publicLessons = fs
    .readdirSync(lessonsDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const raw = fs.readFileSync(path.join(lessonsDir, name), "utf8");
      const parsed = matter(raw);
      return {
        slug: name.replace(/\.md$/, ""),
        data: parsed.data || {},
        public: publish.isPublicLessonMarkdown(raw),
      };
    })
    .filter((item) => item.public);
  const masteryDays = publicLessons.filter(
    (item) => item.data.program === "devops-engineer-mastery" || /^day-\d+$/.test(item.slug)
  );
  const archiveDevops = publicLessons.filter((item) => item.data.course === "devops");
  check(masteryDays.length === 3, "Featured program has three published days (1–3)");
  check(
    masteryDays.every((item) => item.data.course === "devops-engineer-mastery"),
    "Published day-* lessons belong to devops-engineer-mastery, not the archive course"
  );
  check(
    archiveDevops.every((item) => item.slug.startsWith("devops-fundamentals")),
    "Archive devops notes stay on their own slugs"
  );
  check(
    !archiveDevops.some((item) => item.data.program === "devops-engineer-mastery"),
    "Archive devops notes are not in the Mastery program"
  );

  // Adjacent lesson nav stays inside one course
  function courseSequence(courseId) {
    return publicLessons
      .filter((item) => item.data.course === courseId)
      .slice()
      .sort((a, b) => Number(a.data.lesson || 0) - Number(b.data.lesson || 0))
      .map((item) => item.slug);
  }
  const masterySeq = courseSequence("devops-engineer-mastery");
  const archiveSeq = courseSequence("devops");
  check(masterySeq[0] === "day-01" && masterySeq[1] === "day-02", "Day 1 next is Day 2 inside Mastery");
  check(masterySeq[1] === "day-02" && masterySeq[0] === "day-01", "Day 2 previous is Day 1 inside Mastery");
  check(
    !masterySeq.includes("devops-fundamentals-01") && !masterySeq.includes("devops-fundamentals-02"),
    "Mastery adjacent nav never crosses into archive devops notes"
  );
  check(
    archiveSeq.includes("devops-fundamentals-01") &&
      archiveSeq.includes("devops-fundamentals-02") &&
      !archiveSeq.some((slug) => slug.startsWith("day-")),
    "Archive devops adjacent nav stays inside the archive course"
  );

  if (failures.length) {
    return { ok: false, failures };
  }
  return { ok: true, failures: [] };
}

module.exports = { runFutureOperationsTests };
