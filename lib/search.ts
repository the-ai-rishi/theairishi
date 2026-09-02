import { getPublishedContent, UniversalContentItem } from "./content";
import { getAllCourses } from "./lessons";
import { getAllTopics, getAllSeriesConfigs } from "./config";

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

  // 1. Search Active Topics
  const topics = getAllTopics();
  for (const t of topics) {
    if (
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q)
    ) {
      results.push({
        id: `topic-${t.id}`,
        title: t.name,
        description: t.description,
        type: "Topic",
        url: `/topics/${t.slug}`,
        category: t.category,
        badge: t.badge,
      });
    }
  }

  // 2. Search Active Series
  const seriesList = getAllSeriesConfigs();
  for (const s of seriesList) {
    if (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `series-${s.id}`,
        title: s.title,
        description: s.description,
        type: "Series",
        url: `/topics/${s.topic}`,
        category: s.category,
        badge: s.badge || "Series",
      });
    }
  }

  // 3. Search Courses (only enabled courses)
  const courses = getAllCourses();
  for (const c of courses) {
    if (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `course-${c.id}`,
        title: c.title,
        description: c.description,
        type: "Course",
        url: `/learn`,
        category: c.category,
        badge: `${c.totalLessons} lessons`,
      });
    }
  }

  // 4. Search published content only (respects status + enabled)
  const publishedItems = getPublishedContent();
  for (const item of publishedItems) {
    if (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type.toUpperCase(),
        url: item.url,
        category: item.category,
        badge: item.topicSlug,
      });
    }
  }

  // De-duplicate
  const map = new Map<string, SearchResultItem>();
  for (const r of results) {
    if (!map.has(r.id)) map.set(r.id, r);
  }

  return Array.from(map.values()).slice(0, 12);
}

export function searchAll(query: string): SearchResultItem[] {
  return searchSite(query);
}
