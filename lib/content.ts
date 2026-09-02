import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdownToHtml } from "./markdown";
import { getAllLessonSummaries } from "./lessons";
import { getAllGuideSummaries } from "./guides";
import { getAllProjectSummaries } from "./projects";
import { getYoutubeVideos, getInstagramPosts } from "./media";
import {
  getTopicSlugForCourse,
  getTopicBySlug,
  getSocialPlatform,
  getDefaultTopicSlug,
  getDefaultAuthorName,
} from "./config";

export type ContentType =
  | "lesson"
  | "guide"
  | "project"
  | "article"
  | "update"
  | "interview"
  | "career"
  | "youtube"
  | "instagram";

export type ContentStatus = "published" | "draft" | "coming-soon" | "archived";

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

const contentRootDir = path.join(process.cwd(), "content");

/**
 * Resolve the topic slug for a content item.
 * Priority: explicit topicSlug frontmatter > explicit topic frontmatter > course config lookup > fallback
 */
function resolveTopicSlug(opts: {
  topicSlug?: string;
  topic?: string;
  course?: string;
  tags?: string[];
}): string {
  // 1. Explicit topicSlug field wins
  if (opts.topicSlug) return opts.topicSlug;
  // 2. Explicit topic field
  if (opts.topic) return opts.topic;
  // 3. Derive from course ID via config
  if (opts.course) return getTopicSlugForCourse(opts.course);
  // 4. Check tags for known topic slugs
  if (opts.tags) {
    for (const tag of opts.tags) {
      if (getTopicBySlug(tag.toLowerCase())) return tag.toLowerCase();
    }
  }
  return getDefaultTopicSlug();
}

function isPublished(data: Record<string, unknown>): boolean {
  if (data.enabled === false) return false;
  const status = data.status as string | undefined;
  if (status && status !== "published" && status !== "active") return false;
  return true;
}

function loadMarkdownItemsFromDir(
  subDir: string,
  defaultType: ContentType
): UniversalContentItem[] {
  const dirPath = path.join(contentRootDir, subDir);
  if (!fs.existsSync(dirPath)) return [];

  try {
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
    const items: UniversalContentItem[] = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);

      // Respect enabled/status
      if (!isPublished(data)) continue;

      const slug = (data.slug as string) || file.replace(/\.md$/, "");
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
        publishedAt: (data.publishedAt as string) || (data.date as string) || "2026-08-16",
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

  // 1. Lessons
  const lessons = getAllLessonSummaries();
  for (const l of lessons) {
    items.push({
      id: `lesson-${l.slug}`,
      slug: l.slug,
      type: "lesson",
      title: l.metadata.title,
      description: l.metadata.description,
      category: l.metadata.courseTitle || l.metadata.stage || "Learning",
      topicSlug: l.metadata.topic || getTopicSlugForCourse(l.metadata.course),
      publishedAt: "2026-08-16",
      author: getDefaultAuthorName(),
      featured: l.metadata.lesson === 1,
      readTime: 8,
      url: `/learn/${l.slug}`,
      tags: l.metadata.tags || [l.metadata.course, l.metadata.stage],
      status: (l.metadata.status as ContentStatus) || "published",
      enabled: l.metadata.enabled !== false,
    });
  }

  // 2. Guides
  const guides = getAllGuideSummaries();
  for (const g of guides) {
    items.push({
      id: `guide-${g.slug}`,
      slug: g.slug,
      type: "guide",
      title: g.metadata.title,
      description: g.metadata.description,
      category: g.metadata.category || "Guides",
      topicSlug: resolveTopicSlug({ topic: g.metadata.category }),
      publishedAt: g.metadata.date || "2026-08-16",
      author: g.metadata.author || getDefaultAuthorName(),
      featured: Boolean(g.metadata.featured),
      readTime: g.metadata.readTime || 6,
      url: `/guides/${g.slug}`,
      tags: g.metadata.tags || [],
      status: "published",
      enabled: true,
    });
  }

  // 3. Projects
  const projects = getAllProjectSummaries();
  for (const p of projects) {
    items.push({
      id: `project-${p.slug}`,
      slug: p.slug,
      type: "project",
      title: p.metadata.title,
      description: p.metadata.description,
      category: p.metadata.category || "Projects",
      topicSlug: resolveTopicSlug({ topic: p.metadata.category }),
      publishedAt: p.metadata.date || "2026-08-16",
      author: getDefaultAuthorName(),
      featured: Boolean(p.metadata.featured),
      readTime: 10,
      url: `/projects/${p.slug}`,
      tags: p.metadata.technologies || [],
      status: "published",
      enabled: true,
    });
  }

  // 4. Articles
  items.push(...loadMarkdownItemsFromDir("articles", "article"));

  // 5. Updates
  items.push(...loadMarkdownItemsFromDir("updates", "update"));

  // 6. Interviews
  items.push(...loadMarkdownItemsFromDir("interviews", "interview"));

  // 7. Career
  items.push(...loadMarkdownItemsFromDir("career", "career"));

  // 8. YouTube — only if platform status is active
  const ytPlatform = getSocialPlatform("youtube");
  if (ytPlatform?.status === "active") {
    const yt = getYoutubeVideos();
    for (const v of yt) {
      items.push({
        id: `youtube-${v.id}`,
        slug: v.id,
        type: "youtube",
        title: v.title,
        description: v.description,
        category: "YouTube Video",
        topicSlug: getDefaultTopicSlug(),
        publishedAt: v.publishedAt,
        author: getDefaultAuthorName(),
        featured: Boolean(v.featured),
        url: "/youtube",
        tags: v.tags || [],
        status: "published",
        enabled: true,
      });
    }
  }

  // 9. Instagram — only if platform status is active
  const igPlatform = getSocialPlatform("instagram");
  if (igPlatform?.status === "active") {
    const ig = getInstagramPosts();
    for (const i of ig) {
      items.push({
        id: `instagram-${i.id}`,
        slug: i.id,
        type: "instagram",
        title: i.title,
        description: i.caption,
        category: "Visual Guide",
        topicSlug: resolveTopicSlug({ tags: ["instagram"] }),
        publishedAt: i.publishedAt,
        author: getDefaultAuthorName(),
        featured: Boolean(i.featured),
        url: "/instagram",
        tags: ["Instagram", i.type],
        status: "published",
        enabled: true,
      });
    }
  }

  return items;
}

export function getPublishedContent(): UniversalContentItem[] {
  return getAllUniversalContent().filter(
    (i) => i.enabled !== false && i.status === "published"
  );
}

export function getContentByTopic(topicSlug: string): UniversalContentItem[] {
  return getPublishedContent().filter(
    (item) =>
      item.topicSlug === topicSlug ||
      item.category.toLowerCase().includes(topicSlug.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase() === topicSlug.toLowerCase())
  );
}

export function getFeaturedContent(): UniversalContentItem[] {
  return getPublishedContent().filter((i) => i.featured);
}

export function getRecentContent(limit: number = 8): UniversalContentItem[] {
  return getPublishedContent().slice(0, limit);
}

export function getTechnologyUpdates(): UniversalContentItem[] {
  return getPublishedContent().filter(
    (i) => i.type === "update" || i.category.toLowerCase().includes("update")
  );
}

export function getInterviewContent(): UniversalContentItem[] {
  return getPublishedContent().filter(
    (i) => i.type === "interview" || i.category.toLowerCase().includes("interview")
  );
}

export async function getSingleContentBySlug(
  subDir: string,
  slug: string
): Promise<UniversalContentItem | null> {
  const filePath = path.join(contentRootDir, subDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
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
      publishedAt: (data.publishedAt as string) || (data.date as string) || "2026-08-16",
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

      // Match explicit series
      if (targetItem.series && item.series === targetItem.series) {
        score += 10;
      }

      // Match topic
      if (item.topicSlug === targetItem.topicSlug) {
        score += 5;
      }

      // Match tags
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

