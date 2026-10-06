import { getSearchIndexInputs } from "./visibility-core";
import { loadPlatformConfig, getTopicRecord } from "./config";
import { getLiveCatalog } from "./catalog";
import { getLearnerCatalog } from "./programs";
import curriculum from "../data/curriculum/forge-120.json";
import experience from "../content/config/experience.json";

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  category?: string;
  badge?: string;
}

const SEARCH_TYPE_LABELS: Record<string, string> = {
  lesson: "Lesson",
  skill: "Skill",
  guide: "Guide",
  project: "Project",
  article: "Article",
  update: "Update",
  interview: "Interview",
  career: "Career",
  youtube: "Video",
  instagram: "Video",
  topic: "Topic",
  course: "Course",
};

function labelForSearchType(raw: unknown): string {
  const key = String(raw || "").trim().toLowerCase();
  if (SEARCH_TYPE_LABELS[key]) return SEARCH_TYPE_LABELS[key];
  if (!key) return "Content";
  return key
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function normalizeHay(value: unknown): string {
  return String(value || "")
    .toLowerCase()
    .replace(/\bday[\s-]*0*(\d+)\b/g, "day $1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function blobOf(parts: unknown[]): string {
  return normalizeHay(parts.filter(Boolean).join(" "));
}

function matchesQuery(query: string, blob: string): boolean {
  const tokens = normalizeHay(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return false;
  const hay = ` ${blob} `;
  return tokens.every((token) => hay.includes(` ${token} `));
}

function badgeForTopic(topicSlug: unknown): string | undefined {
  if (!topicSlug) return undefined;
  const topic = getTopicRecord(String(topicSlug));
  return topic?.searchBadge || topic?.shortName || undefined;
}

export function searchSite(query: string): SearchResultItem[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResultItem[] = [];
  const platform = loadPlatformConfig();
  const index = getSearchIndexInputs(platform, getLiveCatalog());

  for (const t of index.topics) {
    const blob = blobOf([t.name, t.shortName, t.description, t.slug, t.badge, t.category]);
    if (!matchesQuery(q, blob)) continue;
    const record = getTopicRecord(String(t.id || t.slug || ""));
    results.push({
      id: `topic-${String(t.id || "")}`,
      title: String(t.name || ""),
      description: String(t.description || ""),
      type: "Topic",
      url: `/topics/${String(t.slug || "")}`,
      category: t.category ? String(t.category) : undefined,
      badge: record?.searchBadge || (t.badge ? String(t.badge) : undefined),
    });
  }

  for (const c of index.courses) {
    const blob = blobOf([c.title, c.description, c.category, c.slug, c.id]);
    if (!matchesQuery(q, blob)) continue;
    results.push({
      id: `course-${String(c.id || "")}`,
      title: String(c.title || ""),
      description: String(c.description || ""),
      type: "Course",
      url: String(c.href || "/learn"),
      category: c.category ? String(c.category) : undefined,
      badge: c.lessonCount ? `${c.lessonCount} lessons` : undefined,
    });
  }

  for (const item of index.items) {
    const blob = blobOf([
      item.title,
      item.description,
      item.category,
      item.type,
      item.url,
      item.topicSlug,
      ...(Array.isArray(item.tags) ? item.tags : []),
      item.day,
      item.phase,
      item.program,
      item.metadata && typeof item.metadata === "object"
        ? Object.values(item.metadata as Record<string, unknown>)
            .flat()
            .join(" ")
        : "",
    ]);
    if (!matchesQuery(q, blob)) continue;
    const dayNumber =
      item.day != null
        ? Number(item.day)
        : item.metadata && typeof item.metadata === "object" && "day" in item.metadata
          ? Number((item.metadata as { day?: unknown }).day)
          : NaN;
    const typeLabel = Number.isFinite(dayNumber)
      ? `Day ${dayNumber}`
      : labelForSearchType(item.type);
    results.push({
      id: String(item.id),
      title: String(item.title),
      description: String(item.description || ""),
      type: typeLabel,
      url: String(item.url || "/"),
      category: item.category as string | undefined,
      badge: badgeForTopic(item.topicSlug) || (item.topicSlug as string | undefined),
    });
  }

  const concepts = new Map(curriculum.days.map((day) => [day.day, day.concepts.join(" ")]));
  const catalog = getLearnerCatalog();
  const seenUrls = new Set(results.map((item) => item.url));
  for (const group of experience.skills) {
    for (const item of group.items) {
      const blob = blobOf([item.name, item.plain, group.title, "skill", "tool"]);
      if (!matchesQuery(q, blob)) continue;
      results.push({
        id: `skill-${item.id}`,
        title: item.name,
        description: item.plain,
        type: "skill",
        url: item.href || "/learn",
        category: group.title,
      });
    }
  }

  for (const day of catalog.days) {
    const phase = catalog.phases.find((item) => item.id === day.phaseId);
    const blob = blobOf([
      `day ${day.day}`,
      day.title,
      day.summary,
      phase?.name,
      concepts.get(day.day),
      "forge-120",
    ]);
    if (!matchesQuery(q, blob)) continue;
    const url = day.href || `/learn#${day.phaseId}`;
    if (seenUrls.has(url) && day.published) continue;
    seenUrls.add(url);
    results.push({
      id: `plan-${day.slug}`,
      title: `Day ${day.day} — ${day.title}`,
      description: day.summary,
      type: day.published ? `Day ${day.day}` : "Planned",
      url,
      category: phase?.name,
    });
  }

  const map = new Map<string, SearchResultItem>();
  const phaseHits: SearchResultItem[] = [];
  for (const phase of curriculum.phases) {
    const blob = blobOf([
      phase.name,
      phase.summary,
      phase.daysLabel,
      `phase ${phase.number}`,
      "forge-120",
    ]);
    if (!matchesQuery(q, blob)) continue;
    phaseHits.push({
      id: `phase-${phase.id}`,
      title: phase.name,
      description: `Days ${phase.daysLabel}. ${phase.summary}`,
      type: "Phase",
      url: `/learn#${phase.id}`,
      category: curriculum.programme,
      badge: phase.daysLabel,
    });
  }

  const conceptHits: SearchResultItem[] = [];
  for (const day of curriculum.days) {
    day.concepts.forEach((concept, index) => {
      if (conceptHits.length >= 6) return;
      if (!matchesQuery(q, blobOf([concept]))) return;
      const learner = catalog.days.find((item) => item.day === day.day);
      conceptHits.push({
        id: `concept-${day.day}-${index}`,
        title: concept,
        description: `Day ${day.day}. ${day.title}. ${day.phase}.`,
        type: "Concept",
        url: learner?.href || `/learn#${day.phaseId}`,
        category: learner?.published ? "Open" : "Planned",
        badge: `Day ${day.day}`,
      });
    });
  }

  for (const item of [...phaseHits, ...conceptHits, ...results]) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return Array.from(map.values()).slice(0, 16);
}

export function searchAll(query: string): SearchResultItem[] {
  return searchSite(query);
}

export function getSearchIndex() {
  return getSearchIndexInputs(loadPlatformConfig(), getLiveCatalog());
}
