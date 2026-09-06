"use strict";

const fs = require("node:fs");
const path = require("node:path");

const OLD_CONFIG_ERROR = "Platform config not found";
const DEFAULT_BRAND_CONFIG = path.join("content", "config", "platform.json");

function collectWorkerArtifacts(rootDir) {
  const openNextDir = path.join(rootDir, ".open-next");
  const candidates = [
    path.join(openNextDir, "worker.js"),
    path.join(openNextDir, "server-functions", "default", "handler.mjs"),
    path.join(openNextDir, "server-functions", "default", "index.mjs"),
  ];
  const serverFunctionsDir = path.join(openNextDir, "server-functions");
  function addMjsFiles(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) addMjsFiles(fullPath);
      else if (entry.isFile() && entry.name.endsWith(".mjs")) candidates.push(fullPath);
    }
  }
  addMjsFiles(serverFunctionsDir);
  return [...new Set(candidates)].filter((filePath) => fs.existsSync(filePath));
}

function checkWorkerBundle({ rootDir = path.join(__dirname, ".."), allowMissing = false, logger = console } = {}) {
  const artifacts = collectWorkerArtifacts(rootDir);
  const log = (method, message) => {
    if (logger && typeof logger[method] === "function") logger[method](message);
  };
  if (artifacts.length === 0) {
    if (allowMissing) return { ok: true, skipped: true, artifacts, errors: [] };
    return { ok: false, skipped: false, artifacts, errors: ["OpenNext output missing: expected .open-next/worker.js or server-functions/*.mjs"] };
  }

  const source = artifacts.map((filePath) => fs.readFileSync(filePath, "utf8")).join("\n");
  const errors = [];
  let platform = null;
  const platformPath = path.join(rootDir, DEFAULT_BRAND_CONFIG);
  if (!fs.existsSync(platformPath)) {
    errors.push("Brand source missing: content/config/platform.json");
  } else {
    try { platform = JSON.parse(fs.readFileSync(platformPath, "utf8")); }
    catch (error) { errors.push(`Brand source is invalid JSON: ${error.message}`); }
  }
  if (source.includes(OLD_CONFIG_ERROR)) errors.push(`Worker bundle contains obsolete error text: ${OLD_CONFIG_ERROR}`);

  const brandName = platform && platform.brand && platform.brand.name;
  if (!brandName || !source.includes(brandName)) errors.push(`Worker bundle is missing inlined brand marker: ${brandName || "platform.brand.name"}`);

  const contentMarkers = ["EMBEDDED_CONTENT", "content/lessons/", "content/courses/", "content/guides/", "content/projects/"];
  const embeddedMarker = contentMarkers.find((marker) => source.includes(marker));
  if (!embeddedMarker || !(source.includes("content/lessons/") || source.includes("content/courses/"))) {
    errors.push("Worker bundle is missing embedded content evidence (expected EMBEDDED_CONTENT or a lesson path such as content/lessons/)");
  }
  if (errors.length > 0) {
    for (const error of errors) log("error", `FAIL: ${error}`);
    return { ok: false, skipped: false, artifacts, errors };
  }
  log("log", `PASS: Worker bundle contains inlined brand marker "${brandName}".`);
  log("log", `PASS: Worker bundle contains embedded lesson content (${embeddedMarker}).`);
  log("log", `PASS: Checked ${artifacts.length} OpenNext worker artifact(s).`);
  return { ok: true, skipped: false, artifacts, errors: [] };
}

if (require.main === module) {
  const result = checkWorkerBundle();
  if (result.skipped) {
    console.log("PASS: Worker bundle check skipped because SKIP_WORKER_BUNDLE_CHECK=1.");
    process.exit(0);
  }
  if (!result.ok && result.errors.length === 1 && result.errors[0].startsWith("OpenNext output missing")) console.error(`FAIL: ${result.errors[0]}`);
  process.exit(result.ok ? 0 : 1);
}

module.exports = { checkWorkerBundle, collectWorkerArtifacts };
