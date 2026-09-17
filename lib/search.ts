import { getSearchIndexInputs } from "./visibility-core";
import { loadPlatformConfig } from "./config";
import { getLiveCatalog } from "./catalog";

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

export function searchSite(query: string): SearchResultItem[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResultItem[] = [];
  const index = getSearchIndexInputs(loadPlatformConfig(), getLiveCatalog());

  for (const t of index.topics) {
    const blob = blobOf([t.name, t.shortName, t.description, t.slug, t.badge, t.category]);
    if (!matchesQuery(q, blob)) continue;
    results.push({
      id: `topic-${String(t.id || "")}`,
      title: String(t.name || ""),
      description: String(t.description || ""),
      type: "Topic",
      url: `/topics/${String(t.slug || "")}`,
      category: t.category ? String(t.category) : undefined,
      badge: t.badge ? String(t.badge) : undefined,
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
        ? Object.values(item.metadata as Record<string, unknown>).join(" ")
        : "",
    ]);
    if (!matchesQuery(q, blob)) continue;
    results.push({
      id: String(item.id),
      title: String(item.title),
      description: String(item.description || ""),
      type: labelForSearchType(item.type),
      url: String(item.url || "/"),
      category: item.category as string | undefined,
      badge: item.topicSlug as string | undefined,
    });
  }

  const map = new Map<string, SearchResultItem>();
  for (const r of results) {
    if (!map.has(r.id)) map.set(r.id, r);
  }
  return Array.from(map.values()).slice(0, 12);
}

export function searchAll(query: string): SearchResultItem[] {
  return searchSite(query);
}

export function getSearchIndex() {
  return getSearchIndexInputs(loadPlatformConfig(), getLiveCatalog());
}
