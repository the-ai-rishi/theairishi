"use strict";

/* eslint-disable @typescript-eslint/no-require-imports -- CJS shared with Node validate. */

const fs = require("fs");
const path = require("path");
const iconKeys = require("./icon-keys");

function loadExperience(rootDir) {
  const root = rootDir || path.join(__dirname, "..");
  const file = path.join(root, "content/config/experience.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normalizeExperience(raw, allowedIcons, bounds) {
  const icons = new Set(allowedIcons || iconKeys);
  const errors = [];
  const experience = raw && typeof raw === "object" ? raw : {};
  const totalDays = bounds && Number.isInteger(bounds.totalDays) ? bounds.totalDays : null;
  const phaseIds = bounds && Array.isArray(bounds.phaseIds) ? new Set(bounds.phaseIds) : null;
  const skills = Array.isArray(experience.skills) ? experience.skills : [];
  const seen = new Set();

  function checkIcon(icon, where) {
    if (!icon || !icons.has(icon)) errors.push(where + " has unknown icon: " + icon);
  }

  skills.forEach((group) => {
    if (!group || !group.id) {
      errors.push("skill group missing id");
      return;
    }
    if (seen.has(group.id)) errors.push("duplicate skill group id: " + group.id);
    seen.add(group.id);
    (group.items || []).forEach((item) => {
      if (!item || !item.id) {
        errors.push("skill missing id in " + group.id);
        return;
      }
      if (seen.has(item.id)) errors.push("duplicate skill id: " + item.id);
      seen.add(item.id);
      checkIcon(item.icon, "skill " + item.id);
      if (!item.name || !item.plain) errors.push("skill " + item.id + " needs name and plain");
      if (item.phases != null) {
        if (!Array.isArray(item.phases) || item.phases.length === 0) {
          errors.push("skill " + item.id + " phases must be a non-empty list");
        } else {
          item.phases.forEach((id) => {
            if (typeof id !== "string" || !id.trim() || /\s/.test(id)) {
              errors.push("skill " + item.id + " has a bad phase id: " + id);
            }
          });
        }
      }
      if (item.days != null) {
        if (!Array.isArray(item.days)) errors.push("skill " + item.id + " days must be a list");
        else {
          item.days.forEach((day) => {
            if (!Number.isInteger(day) || day < 1 || (totalDays && day > totalDays)) {
              errors.push("skill " + item.id + " lists a day outside the programme: " + day);
            }
          });
        }
      }
      if (item.kind != null && item.kind !== "skill" && item.kind !== "tool") {
        errors.push("skill " + item.id + " kind must be skill or tool");
      }
      if (item.focusDay != null && (!Number.isInteger(item.focusDay) || item.focusDay < 1 || (totalDays && item.focusDay > totalDays))) {
        errors.push("skill " + item.id + " focusDay is outside the programme");
      }
    });
  });

  const phases = experience.phases && typeof experience.phases === "object" ? experience.phases : {};
  Object.keys(phases).forEach((id) => {
    if (phaseIds && !phaseIds.has(id)) errors.push(id + " is not a phase of this programme");
    const note = phases[id] || {};
    if (!note.plain) errors.push(id + " needs a plain explanation");
    checkIcon(note.icon, id);
    if (!["ochre", "cobalt", "teal", "plum", "ink"].includes(note.accent)) {
      errors.push(id + " has unknown accent: " + note.accent);
    }
  });
  if (phaseIds) {
    phaseIds.forEach((id) => {
      if (!phases[id]) errors.push("programme phase " + id + " has no experience note");
    });
  }

  ["order", "days", "retrieval", "control"].forEach((key) => {
    const list = Array.isArray(experience[key]) ? experience[key] : [];
    if (!list.length) errors.push(key + " must be a non-empty list");
    list.forEach((item) => {
      if (!item || !item.id || !item.name || !item.plain) errors.push(key + " item needs id, name, and plain");
      if (item && seen.has(key + ":" + item.id)) errors.push("duplicate " + key + " id: " + item.id);
      if (item) seen.add(key + ":" + item.id);
      if (item && item.icon) checkIcon(item.icon, key + " " + item.id);
    });
  });

  const hero = experience.hero || {};
  ["lead", "detail", "because"].forEach((key) => {
    if (!hero[key]) errors.push("hero." + key + " is required");
  });

  const spans = Array.isArray(experience.spans) ? experience.spans : [];
  if (spans.length) {
    let cursor = 1;
    spans.forEach((span) => {
      if (!span || !span.id || !span.name || !span.plain) {
        errors.push("a span needs id, name, and plain");
        return;
      }
      if (seen.has("span:" + span.id)) errors.push("duplicate span id: " + span.id);
      seen.add("span:" + span.id);
      const limit = totalDays || span.to;
      if (!Number.isInteger(span.from) || !Number.isInteger(span.to) || span.from !== cursor || span.to < span.from || span.to > limit) {
        errors.push("span " + span.id + " must continue the path without a gap or overlap");
      }
      cursor = Number(span.to) + 1;
    });
    if (totalDays && cursor !== totalDays + 1) errors.push("spans must cover every day from 1 to " + totalDays);
  }

  return { experience, errors };
}

module.exports = { loadExperience, normalizeExperience, iconKeys };
