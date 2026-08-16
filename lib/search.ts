import { getAllCourses, getAllLessonSummaries } from "./lessons";
import { getAllGuideSummaries } from "./guides";
import { getAllProjectSummaries } from "./projects";
import { getInstagramPosts, getYoutubeVideos } from "./media";

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: "Course" | "Lesson" | "Guide" | "Project" | "YouTube" | "Instagram";
  url: string;
  category?: string;
  badge?: string;
}

export function searchSite(query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  // Search Courses
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

  // Search Lessons
  const lessons = getAllLessonSummaries();
  for (const l of lessons) {
    if (
      l.metadata.title.toLowerCase().includes(q) ||
      l.metadata.description.toLowerCase().includes(q) ||
      l.metadata.stage.toLowerCase().includes(q) ||
      (l.metadata.courseTitle && l.metadata.courseTitle.toLowerCase().includes(q))
    ) {
      results.push({
        id: `lesson-${l.slug}`,
        title: l.metadata.title,
        description: l.metadata.description,
        type: "Lesson",
        url: `/learn/${l.slug}`,
        category: l.metadata.stage,
        badge: l.metadata.courseTitle || "Lesson",
      });
    }
  }

  // Search Guides
  const guides = getAllGuideSummaries();
  for (const g of guides) {
    if (
      g.metadata.title.toLowerCase().includes(q) ||
      g.metadata.description.toLowerCase().includes(q) ||
      g.metadata.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `guide-${g.slug}`,
        title: g.metadata.title,
        description: g.metadata.description,
        type: "Guide",
        url: `/guides/${g.slug}`,
        category: g.metadata.category,
        badge: "Guide",
      });
    }
  }

  // Search Projects
  const projects = getAllProjectSummaries();
  for (const p of projects) {
    if (
      p.metadata.title.toLowerCase().includes(q) ||
      p.metadata.description.toLowerCase().includes(q) ||
      p.metadata.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `project-${p.slug}`,
        title: p.metadata.title,
        description: p.metadata.description,
        type: "Project",
        url: `/projects/${p.slug}`,
        category: p.metadata.category,
        badge: p.metadata.status,
      });
    }
  }

  // Search YouTube
  const youtube = getYoutubeVideos();
  for (const y of youtube) {
    if (
      y.title.toLowerCase().includes(q) ||
      y.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: `yt-${y.id}`,
        title: y.title,
        description: y.description,
        type: "YouTube",
        url: `/youtube`,
        category: "Video",
        badge: y.duration,
      });
    }
  }

  // Search Instagram
  const instagram = getInstagramPosts();
  for (const i of instagram) {
    if (
      i.title.toLowerCase().includes(q) ||
      i.caption.toLowerCase().includes(q)
    ) {
      results.push({
        id: `ig-${i.id}`,
        title: i.title,
        description: i.caption,
        type: "Instagram",
        url: `/instagram`,
        category: "Visual Note",
        badge: i.type,
      });
    }
  }

  return results.slice(0, 10);
}
