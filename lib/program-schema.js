"use strict";

/**
 * Single schema for content/config/programs.json.
 * Used by the runtime parser (lib/programs.ts) and by scripts/validate.js.
 * Conceptual source of truth for titles is the private authoring
 * repository (operator-only). This file is the website's public copy
 * and must be complete. Do not put that repository URL in programs.json.
 *
 * Shape:
 * {
 *   featuredProgramId: "devops-engineer-mastery",
 *   programs: [ { id, title, phases, days, ... } ]
 * }
 *
 * A legacy single-program object is still accepted and treated as a
 * one-item catalog so older fixtures keep working.
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

function looksLikeProgram(raw) {
  return Boolean(raw && typeof raw === "object" && !Array.isArray(raw) && isNonEmptyString(raw.id));
}

function asProgramCatalog(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  if (Array.isArray(raw.programs)) {
    return {
      featuredProgramId: raw.featuredProgramId,
      programs: raw.programs,
    };
  }
  if (looksLikeProgram(raw) && (Array.isArray(raw.phases) || Array.isArray(raw.days))) {
    return {
      featuredProgramId: raw.id,
      programs: [raw],
    };
  }
  return null;
}

function featuredProgramFrom(catalog) {
  if (!catalog || !Array.isArray(catalog.programs) || catalog.programs.length === 0) return null;
  const byId = catalog.featuredProgramId
    ? catalog.programs.find((program) => program && program.id === catalog.featuredProgramId)
    : null;
  if (byId) return byId;
  const flagged = catalog.programs.find((program) => program && program.featured === true);
  if (flagged) return flagged;
  return catalog.programs[0];
}

function collectSingleProgramErrors(program, options) {
  const errors = [];
  const opts = options || {};
  const requireComplete = opts.requireComplete === true;
  const label = program && program.id ? '"' + program.id + '"' : "program";

  if (!program || typeof program !== "object" || Array.isArray(program)) {
    errors.push(operatorFix("A program entry is not an object.", "programs[]", "a program object with id and title"));
    return errors;
  }

  if (!isNonEmptyString(program.id) || !isNonEmptyString(program.title)) {
    errors.push(operatorFix("A program is missing id or title.", "programs[].id / title", "a unique id and a title"));
  }
  if (!isNonEmptyString(program.slug)) {
    errors.push(operatorFix("Program " + label + " is missing slug.", "programs[].slug", "a URL slug"));
  }

  const status = String(program.status || "").trim();
  if (!VALID_STATUS.has(status)) {
    errors.push(operatorFix("Program " + label + ' has an invalid status "' + status + '".', "programs[].status", "active"));
  }
  if (program.outcome != null && typeof program.outcome !== "string") {
    errors.push(operatorFix("Program " + label + " outcome must be a string when set.", "programs[].outcome", "a single sentence"));
  }

  const complete =
    requireComplete || (program.enabled !== false && status === "active");

  if (!complete) {
    return errors;
  }

  if (program.enabled === false) {
    errors.push(
      operatorFix(
        "Program " + label + " is the featured current program, so it cannot be disabled.",
        "programs[].enabled",
        "true"
      )
    );
  }
  if (!isNonEmptyString(program.durationLabel)) {
    errors.push(operatorFix("Program " + label + " is missing durationLabel.", "programs[].durationLabel", '"120 days · about 4 months"'));
  }
  if (!isNonEmptyString(program.description)) {
    errors.push(operatorFix("Program " + label + " is missing description.", "programs[].description", "a short program description"));
  }
  if (!isNonEmptyString(program.startHref)) {
    errors.push(operatorFix("Program " + label + " is missing startHref.", "programs[].startHref", "/learn/day-01"));
  }
  if (Object.prototype.hasOwnProperty.call(program, "repoUrl")) {
    errors.push(
      operatorFix(
        "Program " +
          label +
          " must not set repoUrl. The authoring repository is private and is not a public learner destination.",
        "programs[].repoUrl",
        "delete the field"
      )
    );
  }

  if (!Array.isArray(program.phases) || program.phases.length === 0) {
    errors.push(operatorFix("Program " + label + " has no phases.", "programs[].phases", "phase objects covering every day"));
  }
  if (!Array.isArray(program.days) || program.days.length === 0) {
    errors.push(operatorFix("Program " + label + " has no days.", "programs[].days", "one object per day, titles copied from the source of truth"));
  }

  const phases = Array.isArray(program.phases) ? program.phases : [];
  const days = Array.isArray(program.days) ? program.days : [];
  const maxDay = days.reduce((max, day) => {
    const n = day && typeof day.day === "number" ? day.day : 0;
    return n > max ? n : max;
  }, 0);

  const phaseIds = new Set();
  const phaseNumbers = new Set();
  const phaseById = new Map();
  for (const phase of phases) {
    if (!phase || !isNonEmptyString(phase.id) || !isNonEmptyString(phase.name)) {
      errors.push(
        operatorFix(
          "A phase in " + label + " is missing id or name.",
          "programs[].phases[].id / name",
          "a unique phase id such as phase-01"
        )
      );
      continue;
    }
    if (phaseIds.has(phase.id)) {
      errors.push(operatorFix('Duplicate phase id "' + phase.id + '" in ' + label + ".", "programs[].phases[].id", "a unique phase id"));
    }
    phaseIds.add(phase.id);
    if (typeof phase.number !== "number" || !Number.isInteger(phase.number) || phase.number < 1) {
      errors.push(
        operatorFix(
          'Phase "' + phase.id + '" is missing a positive integer number.',
          "programs[].phases[].number",
          "1, 2, 3, …"
        )
      );
    } else if (phaseNumbers.has(phase.number)) {
      errors.push(operatorFix("Duplicate phase number " + phase.number + " in " + label + ".", "programs[].phases[].number", "a unique number"));
    } else {
      phaseNumbers.add(phase.number);
    }
    if (typeof phase.startDay !== "number" || typeof phase.endDay !== "number") {
      errors.push(
        operatorFix(
          'Phase "' + phase.id + '" is missing startDay or endDay.',
          "programs[].phases[].startDay and endDay",
          "numbers covering the program days"
        )
      );
    } else if (phase.startDay > phase.endDay) {
      errors.push(
        operatorFix(
          'Phase "' + phase.id + '" has startDay after endDay.',
          "programs[].phases[].startDay / endDay",
          "startDay <= endDay"
        )
      );
    }
    if (!isNonEmptyString(phase.summary)) {
      errors.push(operatorFix('Phase "' + phase.id + '" is missing summary.', "programs[].phases[].summary", "a short phase summary"));
    }
    if (!isNonEmptyString(phase.daysLabel)) {
      errors.push(operatorFix('Phase "' + phase.id + '" is missing daysLabel.', "programs[].phases[].daysLabel", '"1–12"'));
    }
    phaseById.set(phase.id, phase);
  }

  if (!isNonEmptyString(program.currentPhaseId) || !phaseIds.has(program.currentPhaseId)) {
    errors.push(
      operatorFix(
        'currentPhaseId "' + (program.currentPhaseId || "") + '" does not exist in ' + label + ".",
        "programs[].currentPhaseId",
        "an existing phases[].id such as phase-01"
      )
    );
  }

  const covered = new Map();
  for (const phase of phases) {
    if (typeof phase.startDay !== "number" || typeof phase.endDay !== "number") continue;
    for (let n = phase.startDay; n <= phase.endDay; n += 1) {
      if (n < 1) {
        errors.push(
          operatorFix(
            'Phase "' + phase.id + '" covers day ' + n + ", which is below 1.",
            "programs[].phases[].startDay",
            "1 or higher"
          )
        );
        break;
      }
      if (covered.has(n)) {
        errors.push(
          operatorFix(
            "Day " + n + ' is claimed by both "' + covered.get(n) + '" and "' + phase.id + '".',
            "programs[].phases[].startDay / endDay",
            "non-overlapping phase ranges"
          )
        );
      } else {
        covered.set(n, phase.id);
      }
    }
  }

  if (maxDay > 0) {
    for (let n = 1; n <= maxDay; n += 1) {
      if (!covered.has(n)) {
        errors.push(
          operatorFix(
            "Day " + n + " is not covered by any phase range in " + label + ".",
            "programs[].phases[].startDay / endDay",
            "contiguous coverage of days 1–" + maxDay
          )
        );
        break;
      }
    }
  }

  const dayNumbers = new Set();
  const daySlugs = new Set();
  for (const day of days) {
    if (!day || typeof day.day !== "number" || !isNonEmptyString(day.slug) || !isNonEmptyString(day.title)) {
      errors.push(
        operatorFix(
          "A day in " + label + " is missing day, slug, or title.",
          "programs[].days[].day / slug / title",
          "a number, a slug like day-01, and the real title from the execution plan"
        )
      );
      continue;
    }
    if (!Number.isInteger(day.day) || day.day < 1) {
      errors.push(operatorFix("Day number " + day.day + " is invalid in " + label + ".", "programs[].days[].day", "a positive integer"));
    }
    if (dayNumbers.has(day.day)) {
      errors.push(operatorFix("Duplicate day number " + day.day + " in " + label + ".", "programs[].days[].day", "a unique number"));
    }
    dayNumbers.add(day.day);
    if (daySlugs.has(day.slug)) {
      errors.push(operatorFix('Duplicate day slug "' + day.slug + '" in ' + label + ".", "programs[].days[].slug", "a unique slug"));
    }
    daySlugs.add(day.slug);
    const width = day.day >= 100 ? 3 : 2;
    const slugMatch = String(day.slug).match(/^day-(\d{2,3})$/);
    if (!slugMatch || Number(slugMatch[1]) !== day.day) {
      errors.push(
        operatorFix(
          "Day " +
            day.day +
            ' has slug "' +
            day.slug +
            '". Display uses "Day ' +
            day.day +
            '"; the URL/filename convention is day-NN.',
          "programs[].days[].slug",
          "day-" + String(day.day).padStart(width, "0")
        )
      );
    }
    if (!isNonEmptyString(day.summary)) {
      errors.push(operatorFix("Day " + day.day + " is missing summary in " + label + ".", "programs[].days[].summary", "the summary from the execution plan"));
    }
    if (!day.phaseId || !phaseIds.has(day.phaseId)) {
      errors.push(
        operatorFix(
          "Day " + day.day + ' ("' + (day.slug || "") + '") references phase "' + (day.phaseId || "") + '".',
          "programs[].days[].phaseId",
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
            "programs[].days[].phaseId",
            "the phase whose startDay/endDay include this day"
          )
        );
      }
      if (covered.get(day.day) && covered.get(day.day) !== day.phaseId) {
        errors.push(
          operatorFix(
            "Day " + day.day + ' phaseId "' + day.phaseId + '" does not match the phase range owner "' + covered.get(day.day) + '".',
            "programs[].days[].phaseId",
            covered.get(day.day)
          )
        );
      }
    }
  }

  if (maxDay > 0 && days.length !== maxDay) {
    errors.push(
      operatorFix(
        "Program " + label + " has " + days.length + " day objects but the highest day number is " + maxDay + ".",
        "programs[].days",
        "contiguous day objects from 1 to " + maxDay
      )
    );
  }
  for (let n = 1; n <= maxDay; n += 1) {
    if (!dayNumbers.has(n)) {
      errors.push(operatorFix("Day " + n + " is missing from " + label + ".", "programs[].days", "a day object with day: " + n));
      break;
    }
  }

  return errors;
}

function collectProgramErrors(raw) {
  const catalog = asProgramCatalog(raw);
  if (!catalog) {
    return [
      operatorFix(
        "programs.json must be a program catalog with featuredProgramId and programs[].",
        "(root)",
        '{ "featuredProgramId": "devops-engineer-mastery", "programs": [ { ... } ] }'
      ),
    ];
  }

  const errors = [];
  if (!Array.isArray(catalog.programs) || catalog.programs.length === 0) {
    errors.push(operatorFix("programs.json has no programs.", "programs", "an array with at least the current program"));
    return errors;
  }

  const ids = new Set();
  const slugs = new Set();
  for (const program of catalog.programs) {
    if (program && isNonEmptyString(program.id)) {
      if (ids.has(program.id)) {
        errors.push(operatorFix('Duplicate program id "' + program.id + '".', "programs[].id", "a unique id"));
      }
      ids.add(program.id);
    }
    if (program && isNonEmptyString(program.slug)) {
      if (slugs.has(program.slug)) {
        errors.push(operatorFix('Duplicate program slug "' + program.slug + '".', "programs[].slug", "a unique slug"));
      }
      slugs.add(program.slug);
    }
  }

  const featured = featuredProgramFrom(catalog);
  if (!isNonEmptyString(catalog.featuredProgramId)) {
    errors.push(
      operatorFix(
        "featuredProgramId is missing.",
        "featuredProgramId",
        "the id of the program the homepage should highlight"
      )
    );
  } else if (!ids.has(catalog.featuredProgramId)) {
    errors.push(
      operatorFix(
        'featuredProgramId "' + catalog.featuredProgramId + '" does not match a program.',
        "featuredProgramId",
        "an existing programs[].id"
      )
    );
  }

  const featuredFlags = catalog.programs.filter((program) => program && program.featured === true);
  if (featuredFlags.length > 1) {
    errors.push(
      operatorFix(
        "More than one program has featured: true. The homepage can highlight one current program.",
        "programs[].featured",
        "true on the current program only"
      )
    );
  }
  if (featured && featured.featured === false) {
    errors.push(
      operatorFix(
        'The featured program "' + featured.id + '" has featured: false.',
        "programs[].featured",
        "true on the featured program"
      )
    );
  }

  for (const program of catalog.programs) {
    const isFeatured = featured && program && program.id === featured.id;
    errors.push(...collectSingleProgramErrors(program, { requireComplete: isFeatured }));
  }

  return errors;
}

function parseProgramCatalog(raw) {
  const errors = collectProgramErrors(raw);
  if (errors.length) {
    const err = new Error(errors[0]);
    err.errors = errors;
    throw err;
  }
  const catalog = asProgramCatalog(raw);
  return {
    featuredProgramId: catalog.featuredProgramId,
    programs: catalog.programs,
  };
}

function parseProgramConfig(raw) {
  const catalog = parseProgramCatalog(raw);
  const featured = featuredProgramFrom(catalog);
  if (!featured) {
    throw new Error("programs.json has no featured program");
  }
  return featured;
}

function collectProgramErrorsFor(raw, programId) {
  const catalog = asProgramCatalog(raw);
  if (!catalog) return collectProgramErrors(raw);
  const program = catalog.programs.find((item) => item && item.id === programId);
  if (!program) {
    return [operatorFix('Unknown program "' + programId + '".', "programs[].id", programId)];
  }
  return collectSingleProgramErrors(program, { requireComplete: true });
}

module.exports = {
  collectProgramErrors,
  collectSingleProgramErrors,
  collectProgramErrorsFor,
  parseProgramConfig,
  parseProgramCatalog,
  asProgramCatalog,
  featuredProgramFrom,
  VALID_STATUS,
};
