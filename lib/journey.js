"use strict";

/**
 * Normalized FORGE path.
 * forge-120.json stays the curriculum. experience.json adds explanations,
 * skills and the three teaching spans. Publish state stays on the learner catalog.
 * Filters are data queries so a new dimension does not require a new page.
 */

function phasesOf(item) {
  if (item && Array.isArray(item.phases) && item.phases.length) return item.phases.slice();
  const match = /phase-\d{2}/.exec((item && item.href) || "");
  return match ? [match[0]] : [];
}

function gateDay(gate) {
  const match = /d(\d+)/i.exec(String((gate && gate.around) || ""));
  return match ? Number(match[1]) : null;
}

function flattenSkills(experience) {
  const groups = experience && Array.isArray(experience.skills) ? experience.skills : [];
  const skills = [];
  groups.forEach((group) => {
    (group.items || []).forEach((item) => {
      if (!item || !item.id) return;
      skills.push({
        id: item.id,
        name: item.name,
        plain: item.plain,
        icon: item.icon || "",
        href: item.href || "",
        group: group.id,
        phases: phasesOf(item),
        focusDay: Number.isInteger(item.focusDay) ? item.focusDay : null,
      });
    });
  });
  return skills;
}

function collectJourneyErrors(forge, experience) {
  const errors = [];
  const source = forge && typeof forge === "object" ? forge : {};
  const phases = Array.isArray(source.phases) ? source.phases : [];
  const days = Array.isArray(source.days) ? source.days : [];
  const covered = new Array(121).fill(null);

  if (days.length !== 120) errors.push("journey: curriculum must list 120 days");

  phases.forEach((phase, index) => {
    const start = Number(phase && phase.startDay);
    const end = Number(phase && phase.endDay);
    if (!phase || !phase.id || !Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > 120 || end < start) {
      errors.push("journey: phase range is invalid: " + (phase && phase.id));
      return;
    }
    if (index > 0 && start !== Number(phases[index - 1].endDay) + 1) {
      errors.push("journey: " + phase.id + " does not continue the previous phase");
    }
    for (let day = start; day <= end; day += 1) {
      if (covered[day]) errors.push("journey: day " + day + " is in more than one phase");
      covered[day] = phase.id;
    }
  });

  for (let day = 1; day <= 120; day += 1) {
    if (!covered[day]) errors.push("journey: day " + day + " is not in a phase");
    const record = days.find((item) => item && item.day === day);
    if (!record) errors.push("journey: missing day " + day);
    else if (record.phaseId !== covered[day]) errors.push("journey: day " + day + " phase does not match its range");
  }

  const knownDays = new Set(days.map((item) => item && item.day));
  (source.gates || []).forEach((gate) => {
    const day = gateDay(gate);
    if (!gate || !gate.id || !gate.evidence) errors.push("journey: a gate needs id and evidence");
    if (!knownDays.has(day)) errors.push("journey: gate " + (gate && gate.id) + " references a missing day");
  });

  const phaseIds = new Set(phases.map((phase) => phase.id));
  flattenSkills(experience).forEach((skill) => {
    if (!skill.phases.length) errors.push("journey: skill " + skill.id + " is not tied to a phase");
    skill.phases.forEach((id) => {
      if (!phaseIds.has(id)) errors.push("journey: skill " + skill.id + " references missing phase " + id);
    });
    if (skill.focusDay != null && (skill.focusDay < 1 || skill.focusDay > 120)) {
      errors.push("journey: skill " + skill.id + " focus day is outside 1–120");
    }
  });

  return errors;
}

function normalizeJourney(forge, experience) {
  const source = forge && typeof forge === "object" ? forge : {};
  const skills = flattenSkills(experience);
  const gates = (source.gates || []).map((gate) => ({
    id: gate.id,
    name: gate.name,
    around: gate.around,
    day: gateDay(gate),
    evidence: gate.evidence,
  }));
  const gateByDay = new Map(gates.filter((gate) => gate.day).map((gate) => [gate.day, gate]));
  const days = (source.days || []).map((day) => {
    const gate = gateByDay.get(day.day) || null;
    return {
      day: day.day,
      id: day.slug || "day-" + String(day.day).padStart(2, "0"),
      title: day.title,
      goal: day.goal || "",
      concepts: Array.isArray(day.concepts) ? day.concepts : [],
      phaseId: day.phaseId,
      capstoneConnection: day.capstoneConnection || "",
      previousDay: day.day > 1 ? day.day - 1 : null,
      nextDay: day.day < 120 ? day.day + 1 : null,
      gateId: gate ? gate.id : null,
      skillIds: skills.filter((skill) => skill.phases.includes(day.phaseId)).map((skill) => skill.id),
    };
  });
  const phases = (source.phases || []).map((phase) => {
    const gate = gates.find((item) => item.day === phase.endDay) || null;
    const note = experience && experience.phases ? experience.phases[phase.id] : null;
    return {
      id: phase.id,
      number: phase.number,
      name: phase.name,
      daysLabel: phase.daysLabel,
      startDay: phase.startDay,
      endDay: phase.endDay,
      summary: phase.summary || "",
      plain: (note && note.plain) || phase.summary || "",
      icon: (note && note.icon) || "",
      accent: (note && note.accent) || "ink",
      gateId: gate ? gate.id : null,
      skillIds: skills.filter((skill) => skill.phases.includes(phase.id)).map((skill) => skill.id),
    };
  });
  return {
    hours: source.hours || "",
    days,
    phases,
    gates,
    skills,
    spans: experience && Array.isArray(experience.spans) ? experience.spans : [],
    errors: collectJourneyErrors(source, experience),
  };
}

/**
 * Query dimensions are optional. A later filter adds a key here, not a new page.
 * phaseId, skillId, gateId, concept, from, to, day.
 */
function queryDays(journey, query) {
  const ask = query && typeof query === "object" ? query : {};
  const days = journey && Array.isArray(journey.days) ? journey.days : [];
  return days.filter((day) => {
    if (ask.phaseId && day.phaseId !== ask.phaseId) return false;
    if (ask.skillId && !(day.skillIds || []).includes(ask.skillId)) return false;
    if (ask.gateId && day.gateId !== ask.gateId) return false;
    if (ask.day && day.day !== ask.day) return false;
    if (Number.isInteger(ask.from) && day.day < ask.from) return false;
    if (Number.isInteger(ask.to) && day.day > ask.to) return false;
    if (ask.concept) {
      const needle = String(ask.concept).toLowerCase();
      const blob = [day.title, day.goal].concat(day.concepts || []).join(" ").toLowerCase();
      if (!blob.includes(needle)) return false;
    }
    return true;
  });
}

module.exports = {
  collectJourneyErrors,
  normalizeJourney,
  queryDays,
  phasesOf,
};
