"use strict";

/**
 * Progress, continue-learning, and lesson-rhythm tests.
 * Invoked from scripts/validate.js. Pure Node — no browser.
 */

const progress = require("../lib/learner-progress");
const { resolveContinue, phaseProgress } = require("../lib/continue-learning");
const rhythm = require("../lib/lesson-rhythm");

function catalogFixture() {
  return {
    programId: "devops-engineer-mastery",
    totalDays: 120,
    startHref: "/learn/day-01",
    days: [
      {
        day: 1,
        slug: "day-01",
        title: "Shell from zero",
        summary: "PATH",
        published: true,
        href: "/learn/day-01",
        phaseId: "phase-01",
        phaseName: "Foundations",
        phaseNumber: 1,
      },
      {
        day: 2,
        slug: "day-02",
        title: "Git recovery",
        summary: "reset",
        published: true,
        href: "/learn/day-02",
        phaseId: "phase-01",
        phaseName: "Foundations",
        phaseNumber: 1,
      },
      {
        day: 3,
        slug: "day-03",
        title: "Merge vs rebase",
        summary: "conflict",
        published: true,
        href: "/learn/day-03",
        phaseId: "phase-01",
        phaseName: "Foundations",
        phaseNumber: 1,
      },
      {
        day: 4,
        slug: "day-04",
        title: "Permissions as an incident",
        summary: "chmod",
        published: false,
        href: null,
        phaseId: "phase-01",
        phaseName: "Foundations",
        phaseNumber: 1,
      },
    ],
    phases: [
      {
        id: "phase-01",
        number: 1,
        name: "Foundations",
        daysLabel: "1–12",
        startDay: 1,
        endDay: 12,
        summary: "Shell",
        current: true,
        publishedCount: 3,
        totalDays: 12,
      },
    ],
  };
}

function runLearnerProgressTests() {
  const errors = [];
  function check(condition, message) {
    if (!condition) errors.push(message);
  }

  // parse / migrate
  check(progress.parseProgress(null).v === 1, "empty parse is v1");
  check(progress.parseProgress("not-json").completed.length === 0, "corrupt JSON becomes empty");
  check(progress.parseProgress("{").completed.length === 0, "truncated JSON becomes empty");
  check(progress.parseProgress([]).completed.length === 0, "legacy empty array migrates");

  const migrated = progress.migrateFromLegacy(JSON.stringify(["day-01"]), "day-02");
  check(migrated.completed.includes("day-01"), "legacy completed migrates");
  check(migrated.lastVisited === "day-02", "legacy lastVisited migrates");
  check(migrated.started.includes("day-02"), "lastVisited is started");

  const dupes = progress.parseProgress({
    v: 1,
    completed: ["day-01", "day-01", 3, ""],
    started: ["day-01"],
    lastVisited: " day-01 ",
    completedAt: { "day-01": "2026-01-01T00:00:00.000Z", "nope": "x" },
  });
  check(dupes.completed.length === 1, "duplicate completed slugs collapse");
  check(dupes.lastVisited === "day-01", "lastVisited is trimmed");
  check(dupes.completedAt.nope === undefined, "completedAt drops unknown slugs");

  // mutations do not auto-complete on visit
  const started = progress.markStarted(progress.emptyState(), "day-01");
  check(started.started.includes("day-01"), "visit starts a day");
  check(started.completed.length === 0, "visit does not complete a day");
  check(started.lastVisited === "day-01", "visit records lastVisited");

  const done = progress.markCompleted(started, "day-01");
  check(done.completed.includes("day-01"), "explicit complete");
  check(typeof done.completedAt["day-01"] === "string", "completedAt stamped");

  const undone = progress.unmarkCompleted(done, "day-01");
  check(!undone.completed.includes("day-01"), "uncomplete works");

  check(progress.countCompleted(done, ["day-01", "day-02"]) === 1, "count intersects catalog");
  check(progress.countCompleted(done, ["ai-fundamentals-01"]) === 0, "archive slugs do not count against program");

  // continue-learning
  const cat = catalogFixture();

  const firstVisit = resolveContinue(progress.emptyState(), cat);
  check(firstVisit.kind === "start", "no progress → start");
  check(firstVisit.slug === "day-01", "no progress → Day 1");
  check(firstVisit.ctaLabel === "Start Day 1", "start CTA names Day 1");
  check(firstVisit.completedCount === 0, "first visit count is 0");
  check(firstVisit.totalDays === 120, "denominator is program length 120, not published count");

  const afterDay1 = resolveContinue(progress.markCompleted(progress.emptyState(), "day-01"), cat);
  check(afterDay1.kind === "continue", "after Day 1 → continue");
  check(afterDay1.slug === "day-02", "after Day 1 complete → Day 2");
  check(afterDay1.ctaLabel === "Continue Day 2", "CTA names Day 2");
  check(afterDay1.completedCount === 1, "1 / 120 after Day 1");

  const halfwayDay3 = resolveContinue(
    progress.setLastVisited(progress.emptyState(), "day-03"),
    cat
  );
  check(halfwayDay3.slug === "day-03", "stopped halfway Day 3 → continue Day 3");
  check(halfwayDay3.completedCount === 0, "halfway is not a completion");

  const laterFirst = resolveContinue(progress.markCompleted(progress.emptyState(), "day-03"), cat);
  check(laterFirst.slug === "day-01", "completing later before earlier still continues first incomplete");

  const invalidLast = resolveContinue(
    progress.parseProgress({ v: 1, completed: [], started: [], lastVisited: "day-99" }),
    cat
  );
  check(invalidLast.slug === "day-01", "invalid lastVisited is ignored");

  const unpublishedLast = resolveContinue(
    progress.parseProgress({ v: 1, completed: ["day-01", "day-02", "day-03"], started: [], lastVisited: "day-04" }),
    cat
  );
  check(unpublishedLast.kind === "wait", "unpublished lastVisited does not become a href");
  check(unpublishedLast.href === "/learn", "wait links to the command center, not a missing page");
  check(unpublishedLast.waitDay === 4, "wait names the next planned day");
  check(unpublishedLast.waitTitle && unpublishedLast.waitTitle.includes("Permissions"), "wait uses the planned title");

  const allPublishedDone = resolveContinue(
    progress.parseProgress({
      v: 1,
      completed: ["day-01", "day-02", "day-03"],
      started: ["day-01", "day-02", "day-03"],
      lastVisited: "day-03",
    }),
    cat
  );
  check(allPublishedDone.kind === "wait", "all published complete → wait");
  check(allPublishedDone.href !== "/learn/day-04", "does not link an unpublished day");

  const cleared = resolveContinue(progress.parseProgress("!!!"), cat);
  check(cleared.kind === "start" && cleared.slug === "day-01", "cleared/corrupt storage → start Day 1");

  const disabledCatalog = {
    ...cat,
    days: cat.days.map((day) =>
      day.slug === "day-02" ? { ...day, published: false, href: null } : day
    ),
  };
  const skipDisabled = resolveContinue(progress.markCompleted(progress.emptyState(), "day-01"), disabledCatalog);
  check(skipDisabled.slug === "day-03", "disabled/unpublished next day is skipped");

  const missingLesson = resolveContinue(
    progress.parseProgress({ v: 1, completed: ["day-gone"], lastVisited: "day-gone" }),
    cat
  );
  check(missingLesson.slug === "day-01", "removed lesson slug is ignored");

  const phases = phaseProgress(cat, { completed: ["day-01", "day-02"] });
  check(phases[0].completedCount === 2, "phase completed count");
  check(phases[0].totalDays === 12, "phase denominator is the phase length, not published count");

  // rhythm mapping
  check(rhythm.kindForHeading("What today is for").id === "why", "why maps");
  check(rhythm.kindForHeading("Words").id === "learn", "words → learn");
  check(
    rhythm.kindForHeading('<a href="#words" class="anchor-link">#</a><span>Words</span>').id === "learn",
    "anchor # prefix does not hide Words"
  );
  check(rhythm.kindForHeading("Happy path first").id === "learn", "happy path → learn");
  check(rhythm.kindForHeading("Three different undos").id === "learn", "undos → learn");
  check(rhythm.kindForHeading("Practise").id === "try", "practise → try");
  check(rhythm.kindForHeading("Locked practice").id === "try", "locked practice → try");
  check(rhythm.kindForHeading("Production constraint").id === "verify", "production → verify");
  check(rhythm.kindForHeading("AI review (reject this)").id === "ai-review", "ai review maps");
  check(rhythm.kindForHeading("Interview kill").id === "interview", "interview maps");
  check(rhythm.kindForHeading("Definition of done").id === "gate", "gate maps");
  check(rhythm.kindForHeading("A random aside") === null, "unknown headings are not invented");

  const decorated = rhythm.decorateHeadings("<h2>Practise</h2>");
  check(decorated.includes('data-lesson-kind="try"'), "decorate adds kind");
  check(decorated.includes("lesson-kind-kicker"), "decorate adds kicker");

  const nav = rhythm.navFromHeadings([
    { id: "what-today-is-for", text: "What today is for", level: 2 },
    { id: "words", text: "Words", level: 2 },
    { id: "practise", text: "Practise", level: 2 },
    { id: "definition-of-done", text: "Definition of done", level: 2 },
  ]);
  check(nav[0].nav === "Overview", "nav starts with Overview when why exists");
  check(nav.some((item) => item.nav === "Practice"), "nav includes Practice");
  check(nav.some((item) => item.nav === "Gate"), "nav includes Gate");

  const practice = rhythm.firstPracticeHeading([
    { id: "words", text: "Words", level: 2 },
    { id: "practise", text: "Practise", level: 2 },
  ]);
  check(practice && practice.id === "practise", "skip-to-practice finds Practise");

  const wrapped = rhythm.wrapLessonSections(
    rhythm.decorateHeadings("<h1>Day 1</h1><p>Lead.</p><h2 id=\"practise\">Practise</h2><p>Do it.</p>")
  );
  check(wrapped.includes('class="lesson-block lesson-block-try"'), "wrap creates a practice block");
  check(wrapped.includes("lesson-block-label"), "wrap adds a kind label");
  check(wrapped.includes('aria-hidden="true"'), "program-day first h1 is hidden from AT");
  check(wrapped.includes("<p>Lead.</p>"), "leading copy before the first H2 is kept");

  const archive = rhythm.wrapLessonSections("<h1>Tokens</h1><h2>What is a Token?</h2><p>Body</p>");
  check(!archive.includes("lesson-block"), "archive lessons without rhythm kinds stay unwrapped");

  const mixed = rhythm.wrapLessonSections(
    rhythm.decorateHeadings("<h2>Words</h2><p>A</p><h2>A random aside</h2><p>B</p><h2>Practise</h2><p>C</p>")
  );
  check(mixed.includes("lesson-block-learn"), "known learn heading wraps");
  check(mixed.includes("<h2>A random aside</h2>"), "unknown headings are not forced into a kind panel");

  const fs = require("fs");
  const path = require("path");
  const leakNeedle = "the-ai-rishi/devops-engineer-mastery";
  for (const rel of [
    "lib/learner-progress.js",
    "lib/continue-learning.js",
    "lib/lesson-rhythm.js",
    "components/learning/ProgramCommandCenter.tsx",
    "components/learning/SmartCta.tsx",
    "components/learning/DayCompletion.tsx",
    "components/learning/LessonStickyNav.tsx",
    "components/learning/LessonWorkspaceChrome.tsx",
    "components/learning/DayRail.tsx",
    "components/product/ProductHome.tsx",
    "components/product/ProductHero.tsx",
    "components/product/CurrentWorkCard.tsx",
    "components/product/JourneyMap.tsx",
    "docs/PRODUCT/LEARNER-EXPERIENCE.md",
    "docs/PRODUCT/LEARNING-PLATFORM-UX-RESEARCH.md",
    "docs/PRODUCT/UX-DESIGN-DECISIONS.md",
  ]) {
    const text = fs.readFileSync(path.join(__dirname, "..", rel), "utf8");
    check(!text.toLowerCase().includes(leakNeedle), rel + " must not mention the private mastery repository");
  }

  if (errors.length) {
    console.error("Learner progress tests failed:");
    for (const err of errors) console.error("  - " + err);
    return false;
  }
  console.log("Learner progress tests passed (continue, last-visited, counts, unpublished, invalid, rhythm, wrap).");
  return true;
}

module.exports = { runLearnerProgressTests };

if (require.main === module) {
  if (!runLearnerProgressTests()) process.exit(1);
}
