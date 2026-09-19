"use strict";

/**
 * Continue-learning resolver.
 *
 * Pure. The UI passes a serialized program catalog plus a progress snapshot.
 * Never guesses unpublished slugs into hrefs.
 */

function emptyContinue(catalog) {
  const totalDays = Number(catalog && catalog.totalDays) || 0;
  return {
    kind: "start",
    href: null,
    slug: null,
    day: null,
    title: null,
    phaseName: null,
    phaseNumber: null,
    ctaLabel: "Start Day 1",
    completedCount: 0,
    startedCount: 0,
    totalDays,
    waitTitle: null,
    waitDay: null,
  };
}

function formatDayLabel(day) {
  return Number.isFinite(day) ? "Day " + day : "Day 1";
}

function publishedDays(catalog) {
  const days = catalog && Array.isArray(catalog.days) ? catalog.days : [];
  return days.filter((day) => day && day.published && day.slug && day.href);
}

function plannedDays(catalog) {
  const days = catalog && Array.isArray(catalog.days) ? catalog.days : [];
  return days.filter((day) => day && !day.published);
}

function programSlugs(catalog) {
  const days = catalog && Array.isArray(catalog.days) ? catalog.days : [];
  return days.map((day) => day && day.slug).filter(Boolean);
}

function completedSet(progress) {
  const list = progress && Array.isArray(progress.completed) ? progress.completed : [];
  return new Set(list.filter((slug) => typeof slug === "string" && slug.trim()));
}

function startedSet(progress) {
  const list = progress && Array.isArray(progress.started) ? progress.started : [];
  return new Set(list.filter((slug) => typeof slug === "string" && slug.trim()));
}

function countInCatalog(slugs, catalog) {
  const allowed = new Set(programSlugs(catalog));
  let count = 0;
  for (const slug of slugs) {
    if (allowed.has(slug)) count += 1;
  }
  return count;
}

function targetFromDay(day, kind, catalog, progress) {
  const completed = completedSet(progress);
  const started = startedSet(progress);
  const totalDays = Number(catalog && catalog.totalDays) || (catalog && catalog.days ? catalog.days.length : 0);
  const label =
    kind === "start"
      ? "Start " + formatDayLabel(day.day)
      : "Continue " + formatDayLabel(day.day);
  return {
    kind,
    href: day.href,
    slug: day.slug,
    day: day.day,
    title: day.title || null,
    phaseName: day.phaseName || null,
    phaseNumber: Number.isFinite(day.phaseNumber) ? day.phaseNumber : null,
    ctaLabel: label,
    completedCount: countInCatalog(completed, catalog),
    startedCount: countInCatalog(started, catalog),
    totalDays,
    waitTitle: null,
    waitDay: null,
  };
}

function waitState(catalog, progress) {
  const planned = plannedDays(catalog)[0] || null;
  const completed = completedSet(progress);
  const started = startedSet(progress);
  const totalDays = Number(catalog && catalog.totalDays) || (catalog && catalog.days ? catalog.days.length : 0);
  return {
    kind: "wait",
    href: "/learn",
    slug: null,
    day: planned ? planned.day : null,
    title: planned ? planned.title : null,
    phaseName: planned ? planned.phaseName || null : null,
    phaseNumber: planned && Number.isFinite(planned.phaseNumber) ? planned.phaseNumber : null,
    ctaLabel: planned ? formatDayLabel(planned.day) + " is next" : "See the plan",
    completedCount: countInCatalog(completed, catalog),
    startedCount: countInCatalog(started, catalog),
    totalDays,
    waitTitle: planned ? planned.title : null,
    waitDay: planned ? planned.day : null,
  };
}

/**
 * @param {object} progress  parseProgress() snapshot
 * @param {object} catalog   getLearnerCatalog() snapshot
 */
function resolveContinue(progress, catalog) {
  if (!catalog || !Array.isArray(catalog.days) || catalog.days.length === 0) {
    return emptyContinue(catalog || {});
  }

  const published = publishedDays(catalog);
  const completed = completedSet(progress);
  const started = startedSet(progress);
  const lastVisited =
    progress && typeof progress.lastVisited === "string" && progress.lastVisited.trim()
      ? progress.lastVisited.trim()
      : null;

  const publishedBySlug = new Map(published.map((day) => [day.slug, day]));
  const hasProgress = completed.size > 0 || started.size > 0 || Boolean(lastVisited);

  if (lastVisited && publishedBySlug.has(lastVisited) && !completed.has(lastVisited)) {
    return targetFromDay(publishedBySlug.get(lastVisited), hasProgress ? "continue" : "start", catalog, progress);
  }

  const firstIncomplete = published.find((day) => !completed.has(day.slug));
  if (firstIncomplete) {
    const kind = completed.size > 0 || started.has(firstIncomplete.slug) ? "continue" : "start";
    return targetFromDay(firstIncomplete, kind, catalog, progress);
  }

  if (published.length > 0) {
    return waitState(catalog, progress);
  }

  return emptyContinue(catalog);
}

function phaseProgress(catalog, progress) {
  const phases = catalog && Array.isArray(catalog.phases) ? catalog.phases : [];
  const days = catalog && Array.isArray(catalog.days) ? catalog.days : [];
  const completed = completedSet(progress);
  return phases.map((phase) => {
    const phaseDays = days.filter((day) => day && day.phaseId === phase.id);
    const completedCount = phaseDays.filter((day) => completed.has(day.slug)).length;
    return {
      id: phase.id,
      number: phase.number,
      name: phase.name,
      daysLabel: phase.daysLabel,
      summary: phase.summary,
      current: Boolean(phase.current),
      publishedCount: phase.publishedCount || phaseDays.filter((day) => day.published).length,
      totalDays: phase.totalDays || phaseDays.length,
      completedCount,
    };
  });
}

module.exports = {
  resolveContinue,
  phaseProgress,
  publishedDays,
  formatDayLabel,
};
