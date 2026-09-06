"use strict";

const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const candidates = [
  path.join(rootDir, ".open-next", "server-functions", "default", "index.mjs"),
  path.join(rootDir, ".open-next", "server-functions", "default", "handler.mjs"),
];
const existing = candidates.filter((filePath) => fs.existsSync(filePath));
if (existing.length === 0) {
  console.log("Worker bundle not present; run the adapter build first.");
  process.exit(0);
}
const source = existing.map((filePath) => fs.readFileSync(filePath, "utf8")).join("\n");
const required = [
  ["content/config/platform.json", "platform config"],
  ["content/config/courses.json", "courses config"],
  ["content/lessons/", "lesson markdown"],
  ["content/guides/", "guide markdown"],
  ["content/projects/", "project markdown"],
];
const missing = required.filter(([marker]) => !source.includes(marker));
if (missing.length > 0) {
  console.error(`Worker bundle is missing: ${missing.map(([, label]) => label).join(", ")}`);
  process.exit(1);
}
console.log(`Worker bundle contains embedded ${required.length} content markers.`);
