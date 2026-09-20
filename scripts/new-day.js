#!/usr/bin/env node
"use strict";

/**
 * Scaffold tomorrow's program day from programs.json + the lesson template.
 * Does not invent titles, summaries, or curriculum. Does not overwrite.
 *
 * Usage: node scripts/new-day.js 4
 *    or: npm run new-day -- 4
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PROGRAMS = require("../content/config/programs.json");
const TEMPLATE = path.join(ROOT, "templates/lesson-template.md");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function padDay(n) {
  return String(n).padStart(2, "0");
}

function slugish(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "foundations"
  );
}

function yamlList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "  - first concrete ability this day actually trains\n  - second ability, observable in a terminal\n  - third ability, including the production constraint";
  }
  return items.map((item) => "  - " + String(item)).join("\n");
}

function main() {
  const raw = process.argv[2];
  const dayNumber = Number(raw);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 120) {
    fail("Usage: npm run new-day -- <1-120>\nExample: npm run new-day -- 4");
  }

  const program =
    (PROGRAMS.programs || []).find((item) => item && item.id === PROGRAMS.featuredProgramId) ||
    (PROGRAMS.programs || [])[0];
  if (!program) fail("No featured program in content/config/programs.json");

  const day = (program.days || []).find((item) => item && item.day === dayNumber);
  if (!day) {
    fail(
      "Day " +
        dayNumber +
        " is not in programs.json. Add the title/summary there from the private plan first. Do not invent a day."
    );
  }

  const phase = (program.phases || []).find((item) => item && item.id === day.phaseId);
  if (!phase) fail("Day " + dayNumber + " phaseId " + day.phaseId + " is missing from programs.json phases.");

  const slug = day.slug || "day-" + padDay(dayNumber);
  const dest = path.join(ROOT, "content/lessons", slug + ".md");
  if (fs.existsSync(dest)) {
    fail(path.relative(ROOT, dest) + " already exists. Edit that file; this command will not overwrite.");
  }

  const template = fs.readFileSync(TEMPLATE, "utf8");
  const bodyMatch = template.match(/\n# [^\n]+\n([\s\S]*)$/);
  const body = bodyMatch ? bodyMatch[1].trim() : "";

  const title = "Day " + dayNumber + " - " + day.title;
  const description = day.summary || "";
  const file =
    "---\n" +
    'title: "' +
    title.replace(/"/g, '\\"') +
    '"\n' +
    'description: "' +
    description.replace(/"/g, '\\"') +
    '"\n' +
    'course: "' +
    program.id +
    '"\n' +
    'courseTitle: "' +
    program.title +
    '"\n' +
    "courseOrder: 1\n" +
    'stage: "' +
    phase.name +
    '"\n' +
    "stageOrder: " +
    phase.number +
    "\n" +
    "lesson: " +
    dayNumber +
    "\n" +
    "day: " +
    dayNumber +
    "\n" +
    'phase: "' +
    phase.id +
    '"\n' +
    'program: "' +
    program.id +
    '"\n' +
    'topic: "devops"\n' +
    'status: "draft"\n' +
    "estimatedMinutes: 45\n" +
    "outcomes:\n" +
    yamlList(null) +
    "\n" +
    'tags: ["' +
    slugish(phase.name) +
    '", "day-' +
    padDay(dayNumber) +
    '"]\n' +
    "---\n\n" +
    "# " +
    title +
    "\n\n" +
    body.replace(/Copy the real title[\s\S]*?Do not link GitHub\.\n*/, "") +
    "\n";

  fs.writeFileSync(dest, file);
  console.log("Drafted " + path.relative(ROOT, dest));
  console.log("Title/summary copied from programs.json. Status is draft until you publish.");
  console.log("Next: write the lesson body, set status: published, then npm run validate.");
}

main();
