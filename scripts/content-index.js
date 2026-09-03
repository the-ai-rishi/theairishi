"use strict";

const fs = require("fs");
const path = require("path");
const rootDir = path.join(__dirname, "..");

const GROUPS = [
  { name: "config", dir: "content/config", exts: [".json"] },
  { name: "lessons", dir: "content/lessons", exts: [".md"] },
  { name: "courses", dir: "content/courses", exts: [".md"] },
  { name: "guides", dir: "content/guides", exts: [".md"] },
  { name: "projects", dir: "content/projects", exts: [".md"] },
  { name: "media", dir: "content/media", exts: [".json"] },
  { name: "docs", dir: "docs", exts: [".md"] },
];

const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", "coverage"]);

function walk(dir, exts, acc) {
  if (!fs.existsSync(dir)) return acc;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, exts, acc);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      acc.push(path.relative(rootDir, full));
    }
  }
  return acc;
}

function main() {
  console.log("# Content index\n");
  for (const group of GROUPS) {
    const abs = path.join(rootDir, group.dir);
    const files = walk(abs, group.exts, []).sort();
    console.log("## " + group.name);
    console.log("dir: " + group.dir);
    if (!fs.existsSync(abs)) { console.log("(missing)\n"); continue; }
    if (files.length === 0) { console.log("(empty)\n"); continue; }
    for (const file of files) { console.log("- " + file); }
    console.log("(" + files.length + " files)\n");
  }
}
if (require.main === module) { main(); }
module.exports = { walk, GROUPS };
