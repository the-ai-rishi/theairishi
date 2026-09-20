"use strict";

/**
 * Map existing lesson H2 text onto semantic kinds.
 * Kinds and heading aliases live in content/config/lesson-rhythm.json
 * so a new daily lesson does not require a JS change.
 * wrapLessonSections only wraps headings that already have a kind —
 * archive lessons and guides are left as ordinary prose.
 */

const rhythmConfig = require("../content/config/lesson-rhythm.json");

const KINDS = rhythmConfig.kinds || {};
const NAV_ORDER = Array.isArray(rhythmConfig.navOrder) ? rhythmConfig.navOrder : [];
const HEADING_RULES = (Array.isArray(rhythmConfig.headingRules) ? rhythmConfig.headingRules : []).map((rule) => ({
  test: new RegExp(rule.match, rule.flags || "i"),
  kind: rule.kind,
}));

function kindForHeading(text) {
  const raw = String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^#+\s*/, "")
    .trim();
  if (!raw) return null;
  for (const rule of HEADING_RULES) {
    if (rule.test.test(raw) && KINDS[rule.kind]) return KINDS[rule.kind];
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
    const classMatch = existing.match(/\sclass="([^"]*)"/i);
    const otherAttrs = existing.replace(/\sclass="[^"]*"/i, "");
    const classes = (classMatch ? classMatch[1] + " " : "") + "lesson-h lesson-h-" + kind.id;
    const kicker =
      '<span class="lesson-kind-kicker" aria-hidden="true">' +
      String(index).padStart(2, "0") +
      " — " +
      kind.kicker +
      "</span>";
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

function hideFirstH1(html) {
  return String(html || "").replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/i, (full, attrs, inner) => {
    const existing = attrs || "";
    if (/lesson-page-title/i.test(existing)) return full;
    const classMatch = existing.match(/\sclass="([^"]*)"/i);
    const other = existing
      .replace(/\sclass="[^"]*"/i, "")
      .replace(/\saria-hidden="[^"]*"/i, "");
    const classes = (classMatch ? classMatch[1] + " " : "") + "lesson-page-title";
    return "<p" + other + ' class="' + classes.trim() + '" hidden>' + inner + "</p>";
  });
}

function wrapLessonSections(html) {
  const source = String(html || "");
  const re = /<h2\b[\s\S]*?<\/h2>/gi;
  const matches = [];
  let match;
  while ((match = re.exec(source))) {
    matches.push({ start: match.index, end: match.index + match[0].length, tag: match[0] });
  }
  if (!matches.length) return hideFirstH1(source);

  const hasKind = matches.some((item) => /data-lesson-kind="/i.test(item.tag));
  if (!hasKind) return hideFirstH1(source);

  let out = hideFirstH1(source.slice(0, matches[0].start));
  let index = 0;
  for (let i = 0; i < matches.length; i += 1) {
    const end = i + 1 < matches.length ? matches[i + 1].start : source.length;
    const chunk = source.slice(matches[i].start, end).trim();
    const kindMatch = matches[i].tag.match(/data-lesson-kind="([^"]+)"/i);
    const kind = kindMatch && KINDS[kindMatch[1]];
    if (!kind) {
      out += chunk;
      continue;
    }
    index += 1;
    const idMatch = matches[i].tag.match(/\sid="([^"]+)"/i);
    const headingId = idMatch ? idMatch[1] : null;
    const sectionId = headingId ? headingId + "-block" : "block-" + index;
    const num = String(index).padStart(2, "0");
    const labelled = headingId ? ' aria-labelledby="' + headingId + '"' : "";
    out +=
      '<section class="lesson-block lesson-block-' +
      kind.id +
      '" id="' +
      sectionId +
      '"' +
      labelled +
      ' data-lesson-kind="' +
      kind.id +
      '" data-lesson-nav="' +
      kind.nav +
      '">' +
      '<header class="lesson-block-head" aria-hidden="true">' +
      '<span class="lesson-block-index">' +
      num +
      "</span>" +
      '<span class="lesson-block-label">' +
      kind.label +
      "</span>" +
      "</header>" +
      '<div class="lesson-block-body">' +
      chunk +
      "</div></section>";
  }
  return out;
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
  wrapLessonSections,
  navFromHeadings,
  firstPracticeHeading,
  firstContentHeading,
};
