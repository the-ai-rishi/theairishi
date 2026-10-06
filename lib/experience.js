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

function normalizeExperience(raw, allowedIcons) {
  const icons = new Set(allowedIcons || iconKeys);
  const errors = [];
  const experience = raw && typeof raw === "object" ? raw : {};
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
    });
  });

  const phases = experience.phases && typeof experience.phases === "object" ? experience.phases : {};
  Object.keys(phases).forEach((id) => {
    const note = phases[id] || {};
    if (!note.plain) errors.push(id + " needs a plain explanation");
    checkIcon(note.icon, id);
    if (!["ochre", "cobalt", "teal", "plum", "ink"].includes(note.accent)) {
      errors.push(id + " has unknown accent: " + note.accent);
    }
  });

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

  return { experience, errors };
}

module.exports = { loadExperience, normalizeExperience, iconKeys };
