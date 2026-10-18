"use strict";

/**
 * Programme-agnostic journey.
 * The curriculum is whatever the active programme source provides.
 * experience adds explanations and explicit day relationships.
 * Publish state stays on the learner catalog.
 * A skill's phases group it. Its days list is the only day filter.
 */

function phasesOf(item) {
  if (item && Array.isArray(item.phases) && item.phases.length) return item.phases.slice();
  return [];
}

function dayList(item) {
  if (!item || !Array.isArray(item.days)) return [];
  return item.days.filter((day) => Number.isInteger(day));
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
        kind: item.kind === "tool" ? "tool" : "skill",
        phases: phasesOf(item),
        days: dayList(item),
        focusDay: Number.isInteger(item.focusDay) ? item.focusDay : null,
      });
    });
  });
  return skills;
}

function maxDayOf(source) {
  const days = Array.isArray(source.days) ? source.days : [];
  const numbers = days.map((day) => day && day.day).filter((day) => Number.isInteger(day));
  return numbers.length ? Math.max.apply(null, numbers) : 0;
}

function totalDaysOf(source) {
  if (Number.isInteger(source.totalDays) && source.totalDays > 0) return source.totalDays;
  return maxDayOf(source);
}

function listOfStrings(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item) : [];
}

function listOfDays(value) {
  return Array.isArray(value) ? value.filter((item) => Number.isInteger(item)) : [];
}

function collectJourneyErrors(forge, experience) {
  const errors = [];
  const source = forge && typeof forge === "object" ? forge : {};
  const phases = Array.isArray(source.phases) ? source.phases : [];
  const days = Array.isArray(source.days) ? source.days : [];
  const total = totalDaysOf(source);
  const maxDay = maxDayOf(source);
  const seenDays = new Set();
  const present = new Set();

  if (!total) errors.push("journey: curriculum has no days");
  if (Number.isInteger(source.totalDays) && source.totalDays !== maxDay) {
    errors.push("journey: totalDays does not match the last day");
  }

  days.forEach((day) => {
    if (!day || !Number.isInteger(day.day)) {
      errors.push("journey: a day is missing its numeric day");
      return;
    }
    if (seenDays.has(day.day)) errors.push("journey: duplicate day " + day.day);
    seenDays.add(day.day);
    present.add(day.day);
  });

  const covered = new Map();
  phases.forEach((phase, index) => {
    const start = Number(phase && phase.startDay);
    const end = Number(phase && phase.endDay);
    if (!phase || !phase.id || !Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > total || end < start) {
      errors.push("journey: phase range is invalid: " + (phase && phase.id));
      return;
    }
    if (index > 0 && start !== Number(phases[index - 1].endDay) + 1) {
      errors.push("journey: " + phase.id + " does not continue the previous phase");
    }
    for (let day = start; day <= end; day += 1) {
      if (covered.has(day)) errors.push("journey: day " + day + " is in more than one phase");
      covered.set(day, phase.id);
    }
  });

  for (let day = 1; day <= total; day += 1) {
    if (!covered.has(day)) errors.push("journey: day " + day + " is not in a phase");
    if (!present.has(day)) errors.push("journey: missing day " + day);
    const record = days.find((item) => item && item.day === day);
    if (record && covered.has(day) && record.phaseId !== covered.get(day)) {
      errors.push("journey: day " + day + " phase does not match its range");
    }
  }

  const seenGateIds = new Set();
  const seenGateDays = new Set();
  (source.gates || []).forEach((gate) => {
    if (!gate || !gate.id || !gate.evidence) {
      errors.push("journey: a gate needs id and evidence");
      return;
    }
    if (seenGateIds.has(gate.id)) errors.push("journey: duplicate gate " + gate.id);
    seenGateIds.add(gate.id);
    if (!Number.isInteger(gate.day)) {
      errors.push("journey: gate " + gate.id + " needs an explicit numeric day");
      return;
    }
    if (seenGateDays.has(gate.day)) errors.push("journey: duplicate gate day " + gate.day);
    seenGateDays.add(gate.day);
    if (!present.has(gate.day)) errors.push("journey: gate " + gate.id + " references a missing day");
    const label = /^D(\d+)$/.exec(String(gate.around || ""));
    if (label && Number(label[1]) !== gate.day) {
      errors.push("journey: gate " + gate.id + " around label does not match its day");
    }
  });

  const phaseIds = new Set(phases.map((phase) => phase.id));
  const dayByNumber = new Map(days.filter((day) => day && Number.isInteger(day.day)).map((day) => [day.day, day]));
  flattenSkills(experience).forEach((skill) => {
    if (!skill.phases.length && !skill.days.length) {
      errors.push("journey: skill " + skill.id + " needs a phase or an explicit day");
    }
    skill.phases.forEach((id) => {
      if (!phaseIds.has(id)) errors.push("journey: skill " + skill.id + " references missing phase " + id);
    });
    skill.days.forEach((day) => {
      const record = dayByNumber.get(day);
      if (!record) errors.push("journey: skill " + skill.id + " lists missing day " + day);
      else if (skill.phases.length && !skill.phases.includes(record.phaseId)) {
        errors.push("journey: skill " + skill.id + " day " + day + " is outside its phases");
      }
    });
    if (skill.focusDay != null && (skill.focusDay < 1 || skill.focusDay > total)) {
      errors.push("journey: skill " + skill.id + " focus day is outside 1–" + total);
    }
    if (skill.focusDay != null && skill.days.length && !skill.days.includes(skill.focusDay)) {
      errors.push("journey: skill " + skill.id + " focus day is not one of its days");
    }
  });

  const spans = experience && Array.isArray(experience.spans) ? experience.spans : [];
  if (spans.length && total) {
    let cursor = 1;
    spans.forEach((span) => {
      if (!span || !Number.isInteger(span.from) || !Number.isInteger(span.to) || span.from !== cursor || span.to < span.from || span.to > total) {
        errors.push("journey: span " + (span && span.id) + " must continue the path without a gap or overlap");
      }
      cursor = Number(span && span.to) + 1;
    });
    if (cursor !== total + 1) errors.push("journey: spans must cover every day from 1 to " + total);
  }

  return errors;
}

function normalizeJourney(forge, experience) {
  const source = forge && typeof forge === "object" ? forge : {};
  const skills = flattenSkills(experience);
  const present = new Set((source.days || []).map((day) => day && day.day).filter((day) => Number.isInteger(day)));
  const gates = (source.gates || []).map((gate) => ({
    id: gate.id,
    name: gate.name,
    around: gate.around || (Number.isInteger(gate.day) ? "D" + gate.day : ""),
    day: Number.isInteger(gate.day) ? gate.day : null,
    evidence: gate.evidence,
  }));
  const gateByDay = new Map(gates.filter((gate) => gate.day).map((gate) => [gate.day, gate]));
  const days = (source.days || []).map((day) => {
    const gate = gateByDay.get(day.day) || null;
    const attached = skills.filter((skill) => skill.days.includes(day.day));
    return {
      day: day.day,
      id: day.slug || "day-" + String(day.day).padStart(2, "0"),
      title: day.title,
      goal: day.goal || "",
      concepts: Array.isArray(day.concepts) ? day.concepts : [],
      phaseId: day.phaseId,
      capstoneConnection: day.capstoneConnection || "",
      previousDay: present.has(day.day - 1) ? day.day - 1 : null,
      nextDay: present.has(day.day + 1) ? day.day + 1 : null,
      gateId: gate ? gate.id : null,
      skillIds: attached.filter((skill) => skill.kind !== "tool").map((skill) => skill.id),
      toolIds: attached.filter((skill) => skill.kind === "tool").map((skill) => skill.id),
      relatedProjects: listOfStrings(day.relatedProjects),
      relatedGuides: listOfStrings(day.relatedGuides),
      relatedDays: listOfDays(day.relatedDays).filter((item) => present.has(item)),
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
    totalDays: totalDaysOf(source),
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
 * phaseId, skillId, toolId, gateId, concept, from, to, day.
 */
function queryDays(journey, query) {
  const ask = query && typeof query === "object" ? query : {};
  const days = journey && Array.isArray(journey.days) ? journey.days : [];
  return days.filter((day) => {
    if (ask.phaseId && day.phaseId !== ask.phaseId) return false;
    if (ask.skillId) {
      const ids = (day.skillIds || []).concat(day.toolIds || []);
      if (!ids.includes(ask.skillId)) return false;
    }
    if (ask.toolId && !(day.toolIds || []).includes(ask.toolId)) return false;
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
