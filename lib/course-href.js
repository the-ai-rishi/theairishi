"use strict";

/**
 * Course card href. Shared by the live catalog and scenario tests.
 *
 * The current program course always uses program.startHref so a featured
 * "DevOps Engineer Mastery" card cannot send someone to another course's
 * first lesson. Other courses may link their own first lesson only when
 * that lesson's metadata.course matches.
 */

function hrefForCourse(course, live, program) {
  if (!course) return "/learn";
  if (program && (course.id === program.id || (course.slug && course.slug === program.slug))) {
    return program.startHref || "/learn";
  }
  if (!live || live.id !== course.id) return "/learn";
  const first = live.stages && live.stages[0] && live.stages[0].lessons && live.stages[0].lessons[0];
  const courseKeys = new Set([course.id, course.slug].filter(Boolean));
  if (!first || !first.slug || !first.metadata || !courseKeys.has(first.metadata.course)) {
    return "/learn";
  }
  return "/learn/" + first.slug;
}

module.exports = { hrefForCourse };
