"use strict";

/**
 * Simulate the 14 future operations from the future-ready review.
 * These tests prove the operator can grow the site from JSON/markdown
 * without editing React, unless a genuinely new UI type is introduced.
 */

const fs = require("fs");
const path = require("path");
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

  // I. Replace Telegram placeholder with a real URL
  const telegram = (livePlatform.social || []).find((ch) => ch.id === "telegram");
  check(telegram && telegram.enabled === false && telegram.url === "", "Op I live: Telegram is disabled with empty url");
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
    social.collectSocialErrors(tIph.social).some((err) => /placeholder/i.test(err)),
    "Op I: a placeholder Telegram URL is rejected"
  );
  const tIok = clone(livePlatform);
  const tgOk = tIok.social.find((ch) => ch.id === "telegram");
  tgOk.enabled = true;
  tgOk.status = "active";
  tgOk.url = "https://t.me/theairishi";
  check(social.collectSocialErrors(tIok.social).length === 0, "Op I: a real Telegram URL enables the channel with no React edit");
  check(
    social.publicDestinations(tIok).some((ch) => ch.id === "telegram"),
    "Op I: enabled Telegram appears in destinations"
  );
  check(
    !social.publicDestinations(livePlatform).some((ch) => ch.id === "telegram"),
    "Op I live: Telegram does not appear while disabled"
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

  if (failures.length) {
    return { ok: false, failures };
  }
  return { ok: true, failures: [] };
}

module.exports = { runFutureOperationsTests };
