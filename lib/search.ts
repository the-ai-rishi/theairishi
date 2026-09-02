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

export function searchSite(query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];
  const index = getSearchIndexInputs(loadPlatformConfig(), getLiveCatalog());

  for (const t of index.topics) {
    if (
      String(t.name || "").toLowerCase().includes(q) ||
      String(t.shortName || "").toLowerCase().includes(q) ||
      String(t.description || "").toLowerCase().includes(q) ||
      String(t.slug || "").toLowerCase().includes(q)
    ) {
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
  }

  for (const c of index.courses) {
    if (
      String(c.title || "").toLowerCase().includes(q) ||
      String(c.description || "").toLowerCase().includes(q) ||
      String(c.category || "").toLowerCase().includes(q)
    ) {
      results.push({
        id: `course-${String(c.id || "")}`,
        title: String(c.title || ""),
        description: String(c.description || ""),
        type: "Course",
        url: "/learn",
        category: c.category ? String(c.category) : undefined,
        badge: c.lessonCount ? `${c.lessonCount} lessons` : undefined,
      });
    }
  }

  for (const item of index.items) {
    if (
      String(item.title || "").toLowerCase().includes(q) ||
      String(item.description || "").toLowerCase().includes(q) ||
      String(item.category || "").toLowerCase().includes(q) ||
      (Array.isArray(item.tags) && item.tags.some((t: string) => String(t).toLowerCase().includes(q)))
    ) {
      results.push({
        id: String(item.id),
        title: String(item.title),
        description: String(item.description || ""),
        type: String(item.type || "content").toUpperCase(),
        url: String(item.url || "/"),
        category: item.category as string | undefined,
        badge: item.topicSlug as string | undefined,
      });
    }
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
