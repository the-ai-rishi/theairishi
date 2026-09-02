import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdownToHtml } from "./markdown";

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export interface ProjectMetadata {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  technologies: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  githubUrl?: string;
  demoUrl?: string;
  status: "Completed" | "In Progress" | "Planned";
  featured?: boolean;
  topic?: string;
  topicSlug?: string;
  enabled?: boolean;
  visibilityStatus?: string;
}

export interface ProjectSummary {
  slug: string;
  metadata: ProjectMetadata;
}

export interface Project extends ProjectSummary {
  content: string;
}


function isUsableExternalUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "") || "";
    if (!path && ["github.com", "theairishi.com", "instagram.com", "youtube.com"].includes(host)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getProjectFiles(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(projectsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(projectsDirectory, f));
}

export function getAllProjectSummaries(): ProjectSummary[] {
  const files = getProjectFiles();
  const projects: ProjectSummary[] = [];

  for (const filePath of files) {
    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const parsed = matter(fileContents);
      const data = parsed.data as Record<string, unknown>;

      if (data.enabled === false) continue;
      const visibility = typeof data.status === "string" ? data.status.toLowerCase() : "";
      if (["draft", "archived", "disabled"].includes(visibility)) continue;

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

      const technologies = Array.isArray(data.technologies)
        ? data.technologies.filter((t): t is string => typeof t === "string")
        : ["TypeScript"];

      const difficulty =
        data.difficulty === "Beginner" ||
        data.difficulty === "Intermediate" ||
        data.difficulty === "Advanced"
          ? data.difficulty
          : "Intermediate";

      const status =
        data.status === "Completed" ||
        data.status === "In Progress" ||
        data.status === "Planned"
          ? data.status
          : "In Progress";

      const githubUrl = isUsableExternalUrl(data.githubUrl) ? data.githubUrl.trim() : undefined;
      const demoUrl = isUsableExternalUrl(data.demoUrl) ? data.demoUrl.trim() : undefined;
      const featured = Boolean(data.featured);

      projects.push({
        slug,
        metadata: {
          title,
          description,
          slug,
          date,
          category,
          technologies,
          difficulty,
          githubUrl,
          demoUrl,
          status,
          featured,
          topic: typeof data.topic === "string" ? data.topic : undefined,
          topicSlug: typeof data.topicSlug === "string" ? data.topicSlug : undefined,
          enabled: data.enabled !== false,
          visibilityStatus: visibility || undefined,
        },
      });
    } catch (err) {
      console.warn(`[projects] Failed to parse ${filePath}:`, err);
    }
  }

  return projects.sort(
    (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}

export function getAllProjectSlugs(): string[] {
  return getAllProjectSummaries().map((p) => p.slug);
}

export async function getProject(slug: string): Promise<Project | null> {
  const files = getProjectFiles();
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

  const summaries = getAllProjectSummaries();
  const summary = summaries.find((s) => s.slug === slug);

  if (!summary) return null;

  return {
    slug: summary.slug,
    metadata: summary.metadata,
    content: enhancedContent,
  };
}
