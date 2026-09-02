import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdownToHtml } from "./markdown";
import { getDefaultAuthorName } from "./config";

const guidesDirectory = path.join(process.cwd(), "content", "guides");

export interface GuideMetadata {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  tags?: string[];
  readTime?: number;
  author?: string;
  featured?: boolean;
  topic?: string;
  topicSlug?: string;
  status?: string;
  enabled?: boolean;
}

export interface GuideSummary {
  slug: string;
  metadata: GuideMetadata;
}

export interface Guide extends GuideSummary {
  content: string;
}

function getGuideFiles(): string[] {
  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(guidesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(guidesDirectory, f));
}

export function getAllGuideSummaries(): GuideSummary[] {
  const files = getGuideFiles();
  const guides: GuideSummary[] = [];

  for (const filePath of files) {
    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const parsed = matter(fileContents);
      const data = parsed.data as Record<string, unknown>;

      const slug =
        typeof data.slug === "string"
          ? data.slug
          : path.basename(filePath, ".md");

      const title = typeof data.title === "string" ? data.title : slug;
      const description =
        typeof data.description === "string" ? data.description : "";
      const date =
        typeof data.date === "string"
          ? data.date
          : new Date().toISOString().split("T")[0];
      const category =
        typeof data.category === "string" ? data.category : "General";

      const tags = Array.isArray(data.tags)
        ? data.tags.filter((t): t is string => typeof t === "string")
        : undefined;

      const readTime =
        typeof data.readTime === "number" ? data.readTime : 5;
      const author =
        typeof data.author === "string" ? data.author : getDefaultAuthorName();
      const featured = Boolean(data.featured);
      if (data.enabled === false) continue;
      const visibility = typeof data.status === "string" ? data.status : "published";
      if (["draft", "archived", "disabled"].includes(visibility)) continue;

      guides.push({
        slug,
        metadata: {
          title,
          description,
          slug,
          date,
          category,
          tags,
          readTime,
          author,
          featured,
          topic: typeof data.topic === "string" ? data.topic : undefined,
          topicSlug: typeof data.topicSlug === "string" ? data.topicSlug : undefined,
          status: visibility,
          enabled: data.enabled !== false,
        },
      });
    } catch (err) {
      console.warn(`[guides] Failed to parse ${filePath}:`, err);
    }
  }

  return guides.sort(
    (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}

export function getAllGuideSlugs(): string[] {
  return getAllGuideSummaries().map((g) => g.slug);
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const files = getGuideFiles();
  let targetFile: string | null = null;

  for (const file of files) {
    const filenameSlug = path.basename(file, ".md");
    if (filenameSlug === slug) {
      targetFile = file;
      break;
    }

    try {
      const content = fs.readFileSync(file, "utf8");
      const parsed = matter(content);
      if (parsed.data.slug === slug) {
        targetFile = file;
        break;
      }
    } catch {
      // Continue search
    }
  }

  if (!targetFile) {
    return null;
  }

  const fileContents = fs.readFileSync(/*turbopackIgnore: true*/ targetFile, "utf8");
  const parsed = matter(fileContents);
  const enhancedContent = await renderMarkdownToHtml(parsed.content);

  const summaries = getAllGuideSummaries();
  const summary = summaries.find((s) => s.slug === slug);

  if (!summary) return null;

  return {
    slug: summary.slug,
    metadata: summary.metadata,
    content: enhancedContent,
  };
}
