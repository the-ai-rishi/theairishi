import matter from "gray-matter";
import { renderMarkdownToHtml } from "./markdown";
import { listContentFiles, readContentFile } from "./content-runtime";
import { getAllLessonSummaries } from "./lessons";
import { getAllGuideSummaries } from "./guides";
import { getAllProjectSummaries } from "./projects";
import { getChannelItems } from "./media";
import {
  getTopicSlugForCourse,
  getTopicRecord,
  getConfiguredTopics,
  getPlatformConfig,
  getDefaultTopicSlug,
  getDefaultAuthorName,
  getTopicBySlug,
} from "./config";
import * as vis from "./visibility-core";

export type ContentType = string;

export type ContentStatus =
  | "published"
  | "draft"
  | "coming-soon"
  | "archived"
  | "active"
  | "disabled"
  | "planned"
  | "paused";

export interface UniversalContentItem {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  topicSlug: string;
  publishedAt: string;
  author?: string;
  featured?: boolean;
  readTime?: number;
  url: string;
  tags?: string[];
  markdown?: string;
  contentHtml?: string;
  metadata?: Record<string, unknown>;
  status?: ContentStatus;
  enabled?: boolean;
  series?: string;
  relatedContent?: string[];
}

function resolveTopicSlug(opts: {
  topicSlug?: string;
  topic?: string;
  course?: string;
  tags?: string[];
}): string {
  const candidates = [opts.topicSlug, opts.topic, opts.course, ...(opts.tags ?? [])];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const topic = getTopicRecord(candidate);
    if (topic) return topic.slug;
  }
  if (opts.course) {
    const fromCourse = getTopicSlugForCourse(opts.course);
    if (fromCourse && getTopicRecord(fromCourse)) return fromCourse;
  }
  const authoringDefault = getDefaultTopicSlug();
  return authoringDefault || "";
}

function isPublished(data: Record<string, unknown>): boolean {
  if (data.enabled === false) return false;
  const status = vis.normalizeStatus((data.status as string) || "published");
  return status === "active";
}

function isPublicUniversalItem(item: UniversalContentItem): boolean {
  if (item.enabled === false) return false;
  const status = vis.normalizeStatus(item.status || "published");
  if (status !== "active") return false;
  if (item.topicSlug) {
    const topic = getTopicRecord(item.topicSlug);
    if (topic) {
      const ts = vis.normalizeStatus(topic.status);
      if (topic.enabled === false) return false;
      if (["planned", "paused", "disabled", "archived"].includes(ts)) return false;
    }
  }
  return true;
}

function loadMarkdownItemsFromDir(
  subDir: string,
  defaultType: ContentType
): UniversalContentItem[] {
  try {
    const files = listContentFiles(`content/${subDir}`, ".md");
    const items: UniversalContentItem[] = [];

    for (const file of files) {
      const raw = readContentFile(file);
      if (raw === null) continue;
      const { data, content } = matter(raw);

      if (!isPublished(data)) continue;

      const filename = file.split("/").pop() || file;
      const slug = (data.slug as string) || filename.replace(/\.md$/, "");
      const category = (data.category as string) || "Technology";
      const topicSlug = resolveTopicSlug({
        topicSlug: data.topicSlug as string,
        topic: data.topic as string,
        course: data.course as string,
        tags: data.tags as string[] | undefined,
      });

      items.push({
        id: `${defaultType}-${slug}`,
        slug,
        type: (data.type as ContentType) || defaultType,
        title: (data.title as string) || slug,
        description: (data.description as string) || "",
        category,
        topicSlug,
        publishedAt: (data.publishedAt as string) || (data.date as string) || "",
        author: (data.author as string) || getDefaultAuthorName(),
        featured: Boolean(data.featured),
        readTime:
          (data.readTime as number) ||
          Math.max(1, Math.ceil(content.split(/\s+/).length / 180)),
        url: `/${subDir}/${slug}`,
        tags: (data.tags as string[]) || [],
        markdown: content,
        status: ((data.status as string) || "published") as ContentStatus,
        enabled: data.enabled !== false,
      });
    }

    return items;
  } catch (err) {
    console.warn(`[content] Error reading directory "${subDir}":`, err);
    return [];
  }
}
export function getAllUniversalContent(): UniversalContentItem[] {
  const items: UniversalContentItem[] = [];

  const lessons = getAllLessonSummaries();
  for (const l of lessons) {
    const topicSlug =
      l.metadata.topic ||
      getTopicSlugForCourse(l.metadata.course) ||
      getDefaultTopicSlug() ||
      "";
    items.push({
      id: `lesson-${l.slug}`,
      slug: l.slug,
      type: "lesson",
      title: l.metadata.title,
      description: l.metadata.description,
      category: l.metadata.courseTitle || l.metadata.stage || "Learning",
      topicSlug,
      publishedAt: "",
      author: getDefaultAuthorName(),
      featured: l.metadata.lesson === 1,
      readTime: 8,
      url: `/learn/${l.slug}`,
      tags: l.metadata.tags || [l.metadata.course, l.metadata.stage],
      status: (l.metadata.status as ContentStatus) || "published",
      enabled: l.metadata.enabled !== false,
    });
  }

  const guides = getAllGuideSummaries();
  for (const g of guides) {
    const meta = g.metadata as GuideMeta;
    items.push({
      id: `guide-${g.slug}`,
      slug: g.slug,
      type: "guide",
      title: g.metadata.title,
      description: g.metadata.description,
      category: g.metadata.category || "Guides",
      topicSlug: resolveTopicSlug({
        topic: meta.topic,
        topicSlug: meta.topicSlug,
        tags: g.metadata.tags,
      }),
      publishedAt: g.metadata.date || "",
      author: g.metadata.author || getDefaultAuthorName(),
      featured: Boolean(g.metadata.featured),
      readTime: g.metadata.readTime || 6,
      url: `/guides/${g.slug}`,
      tags: g.metadata.tags || [],
      status: (meta.status as ContentStatus) || "published",
      enabled: meta.enabled !== false,
    });
  }

  const projects = getAllProjectSummaries();
  for (const p of projects) {
    const meta = p.metadata as ProjectMeta;
    items.push({
      id: `project-${p.slug}`,
      slug: p.slug,
      type: "project",
      title: p.metadata.title,
      description: p.metadata.description,
      category: p.metadata.category || "Projects",
      topicSlug: resolveTopicSlug({
        topic: meta.topic,
        topicSlug: meta.topicSlug,
        tags: p.metadata.technologies,
      }),
      publishedAt: p.metadata.date || "",
      author: getDefaultAuthorName(),
      featured: Boolean(p.metadata.featured),
      readTime: 10,
      url: `/projects/${p.slug}`,
      tags: p.metadata.technologies || [],
      status: (meta.visibilityStatus as ContentStatus) || "published",
      enabled: meta.enabled !== false,
    });
  }

  items.push(...loadMarkdownItemsFromDir("articles", "article"));

  const loadedDirs = new Set([
    "articles",
    "lessons",
    "courses",
    "guides",
    "projects",
    "media",
    "config",
  ]);
  for (const topic of getConfiguredTopics()) {
    const dirs = [topic.slug, topic.id];
    for (const dir of dirs) {
      if (loadedDirs.has(dir)) continue;
      loadedDirs.add(dir);
      items.push(...loadMarkdownItemsFromDir(dir, topic.slug));
    }
  }

  for (const platform of getPlatformConfig().social || []) {
    if (vis.normalizeStatus(platform.status) !== "active") continue;
    const channelItems = getChannelItems(platform.id);
    for (const entry of channelItems) {
      items.push({
        id: `${platform.id}-${entry.id}`,
        slug: entry.id,
        type: platform.id,
        title: entry.title,
        description: entry.description || entry.caption || "",
        category: platform.label,
        topicSlug: getDefaultTopicSlug() || "",
        publishedAt: entry.publishedAt,
        author: getDefaultAuthorName(),
        featured: Boolean(entry.featured),
        url: platform.href || `/${platform.id}`,
        tags: entry.tags || [platform.id],
        status: "published",
        enabled: true,
      });
    }
  }

  return items;
}

type GuideMeta = {
  topic?: string;
  topicSlug?: string;
  status?: string;
  enabled?: boolean;
};

type ProjectMeta = {
  topic?: string;
  topicSlug?: string;
  visibilityStatus?: string;
  enabled?: boolean;
};

export function getPublishedContent(): UniversalContentItem[] {
  return getAllUniversalContent().filter(isPublicUniversalItem);
}

export function getContentByTopic(topicSlug: string): UniversalContentItem[] {
  const topic = getTopicRecord(topicSlug);
  if (!topic) return [];
  if (!getTopicBySlug(topicSlug)) return [];
  return getPublishedContent().filter(
    (item) =>
      item.topicSlug === topic.slug ||
      item.topicSlug === topic.id ||
      item.tags?.some(
        (t) => t.toLowerCase() === topic.slug || t.toLowerCase() === topic.id
      )
  );
}

export function getContentForTopic(topicId?: string): UniversalContentItem[] {
  if (!topicId) return [];
  return getContentByTopic(topicId);
}

export function getFeaturedContent(): UniversalContentItem[] {
  return getPublishedContent().filter((i) => i.featured);
}

export function getRecentContent(limit: number = 8): UniversalContentItem[] {
  return [...getPublishedContent()]
    .sort((a, b) => Date.parse(b.publishedAt || "0") - Date.parse(a.publishedAt || "0"))
    .slice(0, limit);
}

export async function getSingleContentBySlug(
  subDir: string,
  slug: string
): Promise<UniversalContentItem | null> {
  const filePath = `content/${subDir}/${slug}.md`;
  const raw = readContentFile(filePath);
  if (raw === null) return null;

  try {
    const { data, content } = matter(raw);
    if (!isPublished(data)) return null;
    const contentHtml = await renderMarkdownToHtml(content);
    const category = (data.category as string) || "Technology";

    return {
      id: `${subDir}-${slug}`,
      slug,
      type: ((data.type as string) || subDir) as ContentType,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      category,
      topicSlug: resolveTopicSlug({
        topicSlug: data.topicSlug as string,
        topic: data.topic as string,
        course: data.course as string,
      }),
      publishedAt: (data.publishedAt as string) || (data.date as string) || "",
      author: (data.author as string) || getDefaultAuthorName(),
      featured: Boolean(data.featured),
      readTime:
        (data.readTime as number) ||
        Math.max(1, Math.ceil(content.split(/\s+/).length / 180)),
      url: `/${subDir}/${slug}`,
      tags: (data.tags as string[]) || [],
      markdown: content,
      contentHtml,
      status: ((data.status as string) || "published") as ContentStatus,
      enabled: data.enabled !== false,
      series: data.series as string | undefined,
    };
  } catch (err) {
    console.warn(`[content] Failed to load content "${subDir}/${slug}":`, err);
    return null;
  }
}
export function getRelatedContent(
  targetItem: UniversalContentItem,
  limit: number = 4
): UniversalContentItem[] {
  const published = getPublishedContent().filter((item) => item.id !== targetItem.id);

  return published
    .map((item) => {
      let score = 0;
      if (targetItem.series && item.series === targetItem.series) score += 10;
      if (item.topicSlug && item.topicSlug === targetItem.topicSlug) score += 5;
      if (targetItem.tags && item.tags) {
        const sharedTags = item.tags.filter((t) =>
          targetItem.tags?.some((targetTag) => targetTag.toLowerCase() === t.toLowerCase())
        );
        score += sharedTags.length * 2;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, limit);
}
