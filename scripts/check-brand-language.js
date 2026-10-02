"use strict";

const fs = require("fs");
const path = require("path");

const KEY_DAYS = {
  1: "Contract, repo, honesty",
  12: "M1 mock + LLM sampler",
  59: "First LLM helper read-only",
  97: "RAG terms and chunking",
  98: "Retrieve, cite, poison test",
  99: "Review-only agent loop",
  100: "Deterministic policy checks",
  101: "MCP protocol and tool boundary",
  102: "Golden eval harness",
  103: "Injection lab",
  104: "Pin, kill switch and AI telemetry",
  105: "AI infrastructure awareness",
  120: "Final reconstruction and defence",
};

const GATE_AROUNDS = ["D12", "D26", "D36", "D60", "D74", "D88", "D96", "D105", "D120"];

const SCAN_DIRS = ["components", "app", "content/lessons", "content/guides", "content/projects", "content/config"];

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js|md|json)$/.test(entry.name)) out.push(full);
  }
}

function checkBrandLanguage(rootDir) {
  const errors = [];
  const brandPath = path.join(rootDir, "content/config/brand-language.json");
  const platformPath = path.join(rootDir, "content/config/platform.json");
  const programsPath = path.join(rootDir, "content/config/programs.json");
  const forgePath = path.join(rootDir, "data/curriculum/forge-120.json");

  const brand = JSON.parse(fs.readFileSync(brandPath, "utf8"));
  const platform = JSON.parse(fs.readFileSync(platformPath, "utf8"));
  const programs = JSON.parse(fs.readFileSync(programsPath, "utf8"));
  const forge = JSON.parse(fs.readFileSync(forgePath, "utf8"));

  if (brand.displayName !== "THE AI RISHI") {
    errors.push("brand-language.json displayName must be THE AI RISHI");
  }
  if (brand.tagline !== "ANCIENT WISDOM · MODERN INTELLIGENCE") {
    errors.push("brand-language.json tagline must be the official line, including the middle dot");
  }
  if (platform.brand?.tagline !== brand.tagline) {
    errors.push("platform.json brand.tagline must match brand-language.json tagline exactly");
  }
  if (platform.copy?.heroDescription !== brand.programmeDescription) {
    errors.push("platform.json copy.heroDescription must match brand-language.json programmeDescription");
  }
  if (brand.programmeName !== "FORGE-120") {
    errors.push("brand-language.json programmeName must be FORGE-120");
  }

  const featured = (programs.programs || []).find((item) => item.id === programs.featuredProgramId);
  if (!featured) {
    errors.push("programs.json featured program is missing");
  } else {
    if (featured.title !== brand.programmeName) {
      errors.push("programs.json title must match brand-language.json programmeName");
    }
    if (!Array.isArray(featured.phases) || featured.phases.length !== 10) {
      errors.push("programs.json must have 10 phases");
    }
    featured.phases?.forEach((phase, index) => {
      if (phase.name !== brand.phases[index]) {
        errors.push(`programs.json phase ${index + 1} name must be "${brand.phases[index]}"`);
      }
    });
    const byDay = new Map((featured.days || []).map((day) => [day.day, day.title]));
    if (byDay.size !== 120) errors.push("programs.json must list 120 days");
    forge.days.forEach((day) => {
      if (byDay.get(day.day) !== day.title) {
        errors.push(`programs.json day ${day.day} title does not match forge-120.json`);
      }
    });
  }

  if (!Array.isArray(forge.phases) || forge.phases.length !== 10) {
    errors.push("forge-120.json must have 10 phases");
  }
  forge.phases?.forEach((phase, index) => {
    if (phase.name !== brand.phases[index]) {
      errors.push(`forge-120.json phase ${index + 1} must be "${brand.phases[index]}"`);
    }
  });
  if (!Array.isArray(forge.days) || forge.days.length !== 120) {
    errors.push("forge-120.json must have 120 days");
  }
  const numbers = (forge.days || []).map((day) => day.day);
  for (let n = 1; n <= 120; n += 1) {
    if (numbers[n - 1] !== n) {
      errors.push(`forge-120.json day sequence breaks at ${n}`);
      break;
    }
  }
  Object.entries(KEY_DAYS).forEach(([day, title]) => {
    const found = (forge.days || []).find((item) => item.day === Number(day));
    if (!found || found.title !== title) {
      errors.push(`forge-120.json day ${day} must be "${title}"`);
    }
  });
  if (forge.capstone?.name !== "forge-api") {
    errors.push("forge-120.json capstone must be forge-api");
  }
  const arounds = (forge.gates || []).map((gate) => gate.around);
  if (arounds.join(",") !== GATE_AROUNDS.join(",")) {
    errors.push("forge-120.json gates must stay D12, D26, D36, D60, D74, D88, D96, D105, D120");
  }
  if (!forge.post120?.rule) errors.push("forge-120.json post-120 rule is missing");

  const files = [];
  SCAN_DIRS.forEach((dir) => walk(path.join(rootDir, dir), files));
  files.push(forgePath);
  const avoid = Array.isArray(brand.avoid) ? brand.avoid : [];
  files.forEach((file) => {
    if (path.resolve(file) === path.resolve(brandPath)) return;
    const text = fs.readFileSync(file, "utf8");
    avoid.forEach((phrase) => {
      if (!phrase) return;
      if (text.toLowerCase().includes(String(phrase).toLowerCase())) {
        errors.push(`${path.relative(rootDir, file)} contains forbidden phrase: ${phrase}`);
      }
    });
    if (text.includes("Ancient wisdom meets")) {
      errors.push(`${path.relative(rootDir, file)} replaces the official tagline`);
    }
  });

  return errors;
}

module.exports = { checkBrandLanguage };

if (require.main === module) {
  const errors = checkBrandLanguage(path.join(__dirname, ".."));
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exit(1);
  }
  console.log("Brand language checks passed");
}
