"use strict";

/**
 * Single schema for content/config/programs.json.
 * Used by the runtime parser (lib/programs.ts) and by scripts/validate.js.
 * Conceptual source of truth for titles is the mastery GitHub repo;
 * this file is the website's synchronized copy and must be complete.
 */

const VALID_STATUS = new Set([
  "planned",
  "coming-soon",
  "active",
  "paused",
  "disabled",
  "archived",
]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function operatorFix(issue, field, value) {
  return (
    "ERROR:\n" +
    issue +
    "\n\nFix:\nEdit content/config/programs.json. Set FIELD " +
    field +
    " to VALUE " +
    value +
    "."
  );
}

function collectProgramErrors(raw) {
  const errors = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    errors.push(
      operatorFix(
        "programs.json must be a single program object.",
        "(root)",
        "a JSON object with id, title, phases, and days"
      )
    );
    return errors;
  }

  const program = raw;
  if (!isNonEmptyString(program.id) || !isNonEmptyString(program.title)) {
    errors.push(
      operatorFix(
        "The program is missing id or title.",
        "id and title",
        '"devops-engineer-mastery" and "DevOps Engineer Mastery"'
      )
    );
  }
  if (!isNonEmptyString(program.slug)) {
    errors.push(operatorFix("The program is missing slug.", "slug", "devops-engineer-mastery"));
  }
  if (!isNonEmptyString(program.durationLabel)) {
    errors.push(
      operatorFix("The program is missing durationLabel.", "durationLabel", '"120 days · about 4 months"')
    );
  }
  if (!isNonEmptyString(program.description)) {
    errors.push(operatorFix("The program is missing description.", "description", "a short program description"));
  }
  if (!isNonEmptyString(program.startHref)) {
    errors.push(operatorFix("The program is missing startHref.", "startHref", "/learn/day-01"));
  }
  if (!isNonEmptyString(program.repoUrl) || !/^https:\/\//.test(String(program.repoUrl))) {
    errors.push(
      operatorFix(
        "The program is missing a real repoUrl.",
        "repoUrl",
        "https://github.com/the-ai-rishi/devops-engineer-mastery"
      )
    );
  }
  if (program.enabled !== true) {
    errors.push(operatorFix("The current program must be enabled.", "enabled", "true"));
  }
  const status = String(program.status || "").trim();
  if (!VALID_STATUS.has(status)) {
    errors.push(operatorFix('The program has an invalid status "' + status + '".', "status", "active"));
  }
  if (program.outcome != null && typeof program.outcome !== "string") {
    errors.push(operatorFix("outcome must be a string when set.", "outcome", "a single sentence"));
  }

  if (!Array.isArray(program.phases) || program.phases.length === 0) {
    errors.push(
      operatorFix("The program has no phases.", "phases", "the 11 phases from the mastery repo")
    );
  }
  if (!Array.isArray(program.days) || program.days.length === 0) {
    errors.push(
      operatorFix(
        "The program has no days.",
        "days",
        "exactly 120 day objects from the execution plan"
      )
    );
  }

  const phases = Array.isArray(program.phases) ? program.phases : [];
  const days = Array.isArray(program.days) ? program.days : [];

  const phaseIds = new Set();
  const phaseNumbers = new Set();
  const phaseById = new Map();
  for (const phase of phases) {
    if (!phase || !isNonEmptyString(phase.id) || !isNonEmptyString(phase.name)) {
      errors.push(
        operatorFix(
          "A program phase is missing id or name.",
          "phases[].id / phases[].name",
          "a unique phase id such as phase-01"
        )
      );
      continue;
    }
    if (phaseIds.has(phase.id)) {
      errors.push(operatorFix('Duplicate phase id "' + phase.id + '".', "phases[].id", "a unique phase id"));
    }
    phaseIds.add(phase.id);
    if (typeof phase.number !== "number" || !Number.isInteger(phase.number) || phase.number < 1) {
      errors.push(
        operatorFix(
          'Phase "' + phase.id + '" is missing a positive integer number.',
          "phases[].number",
          "1 through 11"
        )
      );
    } else if (phaseNumbers.has(phase.number)) {
      errors.push(
        operatorFix(
          "Duplicate phase number " + phase.number + ".",
          "phases[].number",
          "a unique number"
        )
      );
    } else {
      phaseNumbers.add(phase.number);
    }
    if (typeof phase.startDay !== "number" || typeof phase.endDay !== "number") {
      errors.push(
        operatorFix(
          'Phase "' + phase.id + '" is missing startDay or endDay.',
          "phases[].startDay and phases[].endDay",
          "numbers from the 120-day plan"
        )
      );
    } else if (phase.startDay > phase.endDay) {
      errors.push(
        operatorFix(
          'Phase "' + phase.id + '" has startDay after endDay.',
          "phases[].startDay / endDay",
          "startDay <= endDay"
        )
      );
    }
    if (!isNonEmptyString(phase.summary)) {
      errors.push(
        operatorFix('Phase "' + phase.id + '" is missing summary.', "phases[].summary", "a short phase summary")
      );
    }
    if (!isNonEmptyString(phase.daysLabel)) {
      errors.push(
        operatorFix('Phase "' + phase.id + '" is missing daysLabel.', "phases[].daysLabel", '"1–12"')
      );
    }
    phaseById.set(phase.id, phase);
  }

  if (!isNonEmptyString(program.currentPhaseId) || !phaseIds.has(program.currentPhaseId)) {
    errors.push(
      operatorFix(
        'currentPhaseId "' + (program.currentPhaseId || "") + '" does not exist.',
        "currentPhaseId",
        "an existing phases[].id such as phase-01"
      )
    );
  }

  if (phases.length !== 11) {
    errors.push(
      operatorFix(
        "The program has " + phases.length + " phases. The locked plan has 11.",
        "phases",
        "exactly 11 phase objects"
      )
    );
  }

  const covered = new Array(121).fill(null);
  for (const phase of phases) {
    if (typeof phase.startDay !== "number" || typeof phase.endDay !== "number") continue;
    for (let n = phase.startDay; n <= phase.endDay; n += 1) {
      if (n < 1 || n > 120) {
        errors.push(
          operatorFix(
            'Phase "' + phase.id + '" covers day ' + n + ", which is outside 1–120.",
            "phases[].startDay / endDay",
            "a range inside 1–120"
          )
        );
        break;
      }
      if (covered[n]) {
        errors.push(
          operatorFix(
            "Day " + n + ' is claimed by both "' + covered[n] + '" and "' + phase.id + '".',
            "phases[].startDay / endDay",
            "non-overlapping phase ranges"
          )
        );
      } else {
        covered[n] = phase.id;
      }
    }
  }
  for (let n = 1; n <= 120; n += 1) {
    if (!covered[n]) {
      errors.push(
        operatorFix(
          "Day " + n + " is not covered by any phase range.",
          "phases[].startDay / endDay",
          "contiguous coverage of days 1–120"
        )
      );
      break;
    }
  }

  const dayNumbers = new Set();
  const daySlugs = new Set();
  const dayByNumber = new Map();
  for (const day of days) {
    if (!day || typeof day.day !== "number" || !isNonEmptyString(day.slug) || !isNonEmptyString(day.title)) {
      errors.push(
        operatorFix(
          "A program day is missing day, slug, or title.",
          "days[].day / days[].slug / days[].title",
          "a number, a slug like day-01, and the real title from the execution plan"
        )
      );
      continue;
    }
    if (!Number.isInteger(day.day) || day.day < 1 || day.day > 120) {
      errors.push(
        operatorFix(
          "Day number " + day.day + " is outside 1–120.",
          "days[].day",
          "an integer from 1 to 120"
        )
      );
    }
    if (dayNumbers.has(day.day)) {
      errors.push(
        operatorFix("Duplicate day number " + day.day + ".", "days[].day", "a unique number from 1 to 120")
      );
    }
    dayNumbers.add(day.day);
    dayByNumber.set(day.day, day);
    if (daySlugs.has(day.slug)) {
      errors.push(operatorFix('Duplicate day slug "' + day.slug + '".', "days[].slug", "a unique slug"));
    }
    daySlugs.add(day.slug);
    const slugMatch = String(day.slug).match(/^day-(\d{2,3})$/);
    if (!slugMatch || Number(slugMatch[1]) !== day.day) {
      errors.push(
        operatorFix(
          'Day ' + day.day + ' has slug "' + day.slug + '". Display uses "Day ' + day.day + '"; the URL/filename convention is day-NN.',
          "days[].slug",
          "day-" + String(day.day).padStart(2, "0")
        )
      );
    }
    if (!isNonEmptyString(day.summary)) {
      errors.push(
        operatorFix("Day " + day.day + " is missing summary.", "days[].summary", "the summary from the execution plan")
      );
    }
    if (!day.phaseId || !phaseIds.has(day.phaseId)) {
      errors.push(
        operatorFix(
          "Day " + day.day + ' ("' + (day.slug || "") + '") references phase "' + (day.phaseId || "") + '".',
          "days[].phaseId",
          "an existing phase id from phases[]"
        )
      );
    } else {
      const phase = phaseById.get(day.phaseId);
      if (
        phase &&
        typeof phase.startDay === "number" &&
        typeof phase.endDay === "number" &&
        (day.day < phase.startDay || day.day > phase.endDay)
      ) {
        errors.push(
          operatorFix(
            "Day " +
              day.day +
              ' is listed under phase "' +
              day.phaseId +
              '" which only covers days ' +
              phase.startDay +
              "–" +
              phase.endDay +
              ".",
            "days[].phaseId",
            "the phase whose startDay/endDay include this day"
          )
        );
      }
      if (covered[day.day] && covered[day.day] !== day.phaseId) {
        errors.push(
          operatorFix(
            "Day " + day.day + ' phaseId "' + day.phaseId + '" does not match the phase range owner "' + covered[day.day] + '".',
            "days[].phaseId",
            covered[day.day]
          )
        );
      }
    }
  }

  if (days.length !== 120) {
    errors.push(
      operatorFix(
        "The program has " + days.length + " days. The locked execution plan is 120 days.",
        "days",
        "exactly 120 day objects, titles copied from the mastery repo, not invented"
      )
    );
  }
  for (let n = 1; n <= 120; n += 1) {
    if (!dayNumbers.has(n)) {
      errors.push(
        operatorFix("Day " + n + " is missing from the 120-day map.", "days", "a day object with day: " + n)
      );
      break;
    }
  }

  return errors;
}

function parseProgramConfig(raw) {
  const errors = collectProgramErrors(raw);
  if (errors.length) {
    const err = new Error(errors[0]);
    err.errors = errors;
    throw err;
  }
  return raw;
}

module.exports = {
  collectProgramErrors,
  parseProgramConfig,
  VALID_STATUS,
};
