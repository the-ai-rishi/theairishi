"use strict";

/* eslint-disable @typescript-eslint/no-require-imports -- CJS shared with Node validate. */

const programsFile = require("../content/config/programs.json");
const forgeCurriculum = require("../data/curriculum/forge-120.json");
const forgeExperience = require("../content/config/experience.json");
const { normalizeJourney } = require("./journey");

/**
 * Programme sources. Components ask for the active programme.
 * They do not import a curriculum file themselves.
 * A future programme adds a source here, or renders from its program record alone.
 */
const SOURCES = {
  "forge-120": {
    curriculum: forgeCurriculum,
    experience: forgeExperience,
  },
};

function programRecord(programId) {
  const programs = Array.isArray(programsFile.programs) ? programsFile.programs : [];
  const id = programId || programsFile.featuredProgramId;
  return programs.find((program) => program && (program.id === id || program.slug === id)) || null;
}

function curriculumFromProgram(program) {
  const days = Array.isArray(program.days) ? program.days : [];
  return {
    totalDays: days.reduce((max, day) => (day && day.day > max ? day.day : max), 0),
    phases: program.phases || [],
    days: days.map((day) => ({
      day: day.day,
      slug: day.slug,
      title: day.title,
      phaseId: day.phaseId,
      goal: day.summary || "",
      concepts: [],
      relatedProjects: [],
      relatedGuides: [],
      relatedDays: [],
    })),
    gates: [],
  };
}

function emptyExperience() {
  return { hero: { lead: "", detail: "", because: "" }, phases: {}, skills: [], spans: [], order: [], days: [], retrieval: [], control: [] };
}

function getProgramModel(programId) {
  const program = programRecord(programId);
  if (!program) {
    const experience = emptyExperience();
    return { program: null, experience, journey: normalizeJourney({}, experience), curriculum: null, sourceId: null };
  }
  const sourceId = typeof program.source === "string" ? program.source : null;
  const source = sourceId ? SOURCES[sourceId] : null;
  if (!source) {
    const experience = emptyExperience();
    const curriculum = curriculumFromProgram(program);
    return { program, experience, journey: normalizeJourney(curriculum, experience), curriculum, sourceId: null };
  }
  return {
    program,
    experience: source.experience,
    journey: normalizeJourney(source.curriculum, source.experience),
    curriculum: source.curriculum,
    sourceId,
  };
}

function collectAlignmentErrors(program, curriculum, experience) {
  const errors = [];
  if (!program || !curriculum) {
    errors.push("alignment: programme and curriculum are both required");
    return errors;
  }
  const programDays = Array.isArray(program.days) ? program.days : [];
  const curriculumDays = Array.isArray(curriculum.days) ? curriculum.days : [];
  if (programDays.length !== curriculumDays.length) {
    errors.push("alignment: programme day count does not match its curriculum");
  }
  const byDay = new Map(curriculumDays.map((day) => [day.day, day]));
  programDays.forEach((day) => {
    const other = byDay.get(day.day);
    if (!other) errors.push("alignment: programme day " + day.day + " is missing from the curriculum");
    else if (other.title !== day.title) errors.push("alignment: day " + day.day + " title drifted");
    else if (other.phaseId !== day.phaseId) errors.push("alignment: day " + day.day + " phase drifted");
  });
  const programPhases = Array.isArray(program.phases) ? program.phases : [];
  const curriculumPhases = Array.isArray(curriculum.phases) ? curriculum.phases : [];
  if (programPhases.length !== curriculumPhases.length) errors.push("alignment: phase count drifted");
  const byPhase = new Map(curriculumPhases.map((phase) => [phase.id, phase]));
  programPhases.forEach((phase) => {
    const other = byPhase.get(phase.id);
    if (!other) errors.push("alignment: phase " + phase.id + " is missing from the curriculum");
    else if (other.name !== phase.name || other.startDay !== phase.startDay || other.endDay !== phase.endDay) {
      errors.push("alignment: phase " + phase.id + " name or range drifted");
    }
  });
  const notes = experience && experience.phases ? experience.phases : {};
  programPhases.forEach((phase) => {
    if (!notes[phase.id] || !notes[phase.id].plain) {
      errors.push("alignment: phase " + phase.id + " has no experience note");
    }
  });
  Object.keys(notes).forEach((id) => {
    if (!byPhase.has(id)) errors.push("alignment: experience note " + id + " is not a programme phase");
  });
  return errors;
}

module.exports = {
  SOURCES,
  getProgramModel,
  collectAlignmentErrors,
  curriculumFromProgram,
};
