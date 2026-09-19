"use strict";

/**
 * Map existing lesson H2 text onto semantic kinds.
 * Never invents a section the markdown does not already have.
 */

const KINDS = {
  why: { id: "why", label: "Why this matters", nav: "Overview", kicker: "Why" },
  learn: { id: "learn", label: "Learn", nav: "Learn", kicker: "Learn" },
  predict: { id: "predict", label: "Predict", nav: "Learn", kicker: "Predict" },
  try: { id: "try", label: "Try it yourself", nav: "Practice", kicker: "Try" },
  break: { id: "break", label: "Break it safely", nav: "Practice", kicker: "Break" },
  evidence: { id: "evidence", label: "Capture evidence", nav: "Evidence", kicker: "Evidence" },
  fix: { id: "fix", label: "Fix it", nav: "Practice", kicker: "Fix" },
  verify: { id: "verify", label: "Verify", nav: "Evidence", kicker: "Verify" },
  "ai-review": { id: "ai-review", label: "AI review", nav: "Review", kicker: "AI review" },
  interview: { id: "interview", label: "Interview", nav: "Review", kicker: "Interview" },
  gate: { id: "gate", label: "Day gate", nav: "Gate", kicker: "Gate" },
};

const NAV_ORDER = ["Overview", "Learn", "Practice", "Evidence", "Review", "Gate"];

const HEADING_RULES = [
  { test: /what today is for/i, kind: "why" },
  { test: /happy path/i, kind: "learn" },
  { test: /three different undos/i, kind: "learn" },
  { test: /^words\b/i, kind: "learn" },
  { test: /predict/i, kind: "predict" },
  { test: /locked practice/i, kind: "try" },
  { test: /practise|practice/i, kind: "try" },
  { test: /\bbreak\b/i, kind: "break" },
  { test: /evidence/i, kind: "evidence" },
  { test: /\bfix\b/i, kind: "fix" },
  { test: /production/i, kind: "verify" },
  { test: /ai review/i, kind: "ai-review" },
  { test: /interview/i, kind: "interview" },
  { test: /definition of done/i, kind: "gate" },
];

function kindForHeading(text) {
  const raw = String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#+\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!raw) return null;
  for (const rule of HEADING_RULES) {
    if (rule.test.test(raw)) return KINDS[rule.kind];
  }
  return null;
}

function decorateHeadings(html) {
  const source = String(html || "");
  let index = 0;
  return source.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    const kind = kindForHeading(inner);
    const existing = attrs || "";
    if (!kind) {
      return "<h2" + existing + ">" + inner + "</h2>";
    }
    index += 1;
    const num = String(index).padStart(2, "0");
    const classMatch = existing.match(/\sclass="([^"]*)"/i);
    const otherAttrs = existing.replace(/\sclass="[^"]*"/i, "");
    const classes = (classMatch ? classMatch[1] + " " : "") + "lesson-h lesson-h-" + kind.id;
    const kicker =
      '<span class="lesson-kind-kicker">' + num + " — " + kind.kicker + "</span>";
    return (
      "<h2" +
      otherAttrs +
      ' class="' +
      classes.trim() +
      '" data-lesson-kind="' +
      kind.id +
      '" data-lesson-nav="' +
      kind.nav +
      '">' +
      kicker +
      inner +
      "</h2>"
    );
  });
}

function navFromHeadings(headings) {
  const list = Array.isArray(headings) ? headings : [];
  const seen = new Set();
  const items = [];
  for (const heading of list) {
    if (!heading || heading.level !== 2) continue;
    const kind = kindForHeading(heading.text);
    if (!kind || seen.has(kind.nav)) continue;
    seen.add(kind.nav);
    items.push({
      nav: kind.nav,
      kind: kind.id,
      href: "#" + heading.id,
      label: kind.nav,
    });
  }
  items.sort((a, b) => NAV_ORDER.indexOf(a.nav) - NAV_ORDER.indexOf(b.nav));
  return items;
}

function firstPracticeHeading(headings) {
  const list = Array.isArray(headings) ? headings : [];
  for (const heading of list) {
    if (!heading || heading.level !== 2) continue;
    const kind = kindForHeading(heading.text);
    if (kind && (kind.id === "try" || kind.id === "predict" || kind.id === "break")) {
      return heading;
    }
  }
  return null;
}

function firstContentHeading(headings) {
  const list = Array.isArray(headings) ? headings : [];
  return list.find((heading) => heading && heading.level === 2) || null;
}

module.exports = {
  KINDS,
  NAV_ORDER,
  kindForHeading,
  decorateHeadings,
  navFromHeadings,
  firstPracticeHeading,
  firstContentHeading,
};
