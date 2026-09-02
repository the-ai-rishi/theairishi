import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdownToHtml } from "./markdown";
import {
  getCourseConfig,
  getTopicSlugForCourse,
  getAllCourseConfigs,
  type CourseConfig,
} from "./config";

const contentRootDirectory = path.join(process.cwd(), "content");
const coursesDirectory = path.join(contentRootDirectory, "courses");
const lessonsDirectory = path.join(contentRootDirectory, "lessons");

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface LessonMetadata {
  title: string;
  description: string;
  course: string;
  courseTitle?: string;
  courseOrder?: number;
  topic?: string;
  stage: string;
  stageOrder?: number;
  lesson: number;
  tags?: string[];
  duration?: string;
  enabled?: boolean;
  status?: string;
}

export interface LessonSummary {
  slug: string;
  metadata: LessonMetadata;
}

export interface Lesson extends LessonSummary {
  content: string;
  readingTime: number;
  headings: HeadingItem[];
}

export interface LessonStage {
  name: string;
  number: number;
  stageOrder: number;
  courseId: string;
  courseTitle: string;
  lessons: LessonSummary[];
}

export interface CourseMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  badge?: string;
}

export interface Course extends CourseMetadata {
  stages: LessonStage[];
  totalLessons: number;
}

export interface LessonContext {
  current: LessonSummary;
  previous: LessonSummary | null;
  next: LessonSummary | null;
  stage: LessonStage;
  course: Course;
  lessonIndex: number;
  totalLessonsInStage: number;
  totalLessonsInCourse: number;
}

interface LessonSource extends LessonSummary {
  markdown: string;
}

function getString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getPositiveNumber(value: unknown): number | null {
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(num) && num > 0 ? num : null;
}

function getLessonMetadata(
  data: Record<string, unknown>,
  slug: string
): LessonMetadata | null {
  const title = getString(data.title);
  const stage = getString(data.stage);
  const lesson = getPositiveNumber(data.lesson);
  const description = getString(data.description) || "";

  if (!title || !stage || !lesson) {
    console.warn(
      `[lessons] Skipping "${slug}": title, stage, and lesson number are required.`
    );
    return null;
  }

  // Check enabled/status — skip disabled or draft/archived lessons
  const enabled = data.enabled !== false; // default true if not specified
  const status = getString(data.status) || "published";

  if (!enabled || status === "draft" || status === "archived") {
    return null;
  }

  // Resolve course ID from frontmatter only (no filename-prefix inference)
  const courseId = getString(data.course)?.toLowerCase() ?? "ai";

  // Get course metadata from config (config-driven, not hardcoded)
  const courseConfig = getCourseConfig(courseId);
  const courseTitle = getString(data.courseTitle) || courseConfig.title;
  const courseOrder = getPositiveNumber(data.courseOrder) || courseConfig.order || 99;

  // Resolve topic: frontmatter topic > course config topic > courseId
  const topic = getString(data.topic) || getTopicSlugForCourse(courseId);

  const stageOrder = getPositiveNumber(data.stageOrder) || 1;

  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : undefined;

  const duration = getString(data.duration) || undefined;

  return {
    title,
    description,
    course: courseId,
    courseTitle,
    courseOrder,
    topic,
    stage,
    stageOrder,
    lesson,
    tags,
    duration,
    enabled,
    status,
  };
}

function getMarkdownFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFilesRecursively(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getAllLessonFiles(): string[] {
  const files: string[] = [];
  if (fs.existsSync(coursesDirectory)) {
    files.push(...getMarkdownFilesRecursively(coursesDirectory));
  }
  if (fs.existsSync(lessonsDirectory)) {
    files.push(...getMarkdownFilesRecursively(lessonsDirectory));
  }
  return Array.from(new Set(files));
}

function getLessonSourceFromFile(filePath: string): LessonSource | null {
  const filename = path.basename(filePath);
  const slug = filename.replace(/\.md$/, "");
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const parsed = matter(fileContents);
    const metadata = getLessonMetadata(
      parsed.data as Record<string, unknown>,
      slug
    );
    if (!metadata) return null;
    return { slug, metadata, markdown: parsed.content };
  } catch (error) {
    console.warn(`[lessons] Skipping "${filePath}": unable to parse.`, error);
    return null;
  }
}

function compareLessons(first: LessonSummary, second: LessonSummary): number {
  const firstCourseOrder = first.metadata.courseOrder ?? 99;
  const secondCourseOrder = second.metadata.courseOrder ?? 99;
  if (firstCourseOrder !== secondCourseOrder) return firstCourseOrder - secondCourseOrder;

  const firstStageOrder = first.metadata.stageOrder ?? 99;
  const secondStageOrder = second.metadata.stageOrder ?? 99;
  if (firstStageOrder !== secondStageOrder) return firstStageOrder - secondStageOrder;

  const stageCompare = first.metadata.stage.localeCompare(second.metadata.stage, undefined, { sensitivity: "base" });
  if (stageCompare !== 0) return stageCompare;

  if (first.metadata.lesson !== second.metadata.lesson) return first.metadata.lesson - second.metadata.lesson;

  return first.slug.localeCompare(second.slug, undefined, { numeric: true, sensitivity: "base" });
}

let isValidated = false;

function getAllLessonSources(): LessonSource[] {
  const files = getAllLessonFiles();
  const mapBySlug = new Map<string, LessonSource>();

  for (const file of files) {
    const source = getLessonSourceFromFile(file);
    if (source && !mapBySlug.has(source.slug)) {
      mapBySlug.set(source.slug, source);
    }
  }

  const sorted = Array.from(mapBySlug.values()).sort(compareLessons);

  if (!isValidated && process.env.NODE_ENV !== "production") {
    isValidated = true;
    const errors = validateContent(sorted);
    if (errors.length > 0) {
      console.warn(`[content-validation] Found ${errors.length} content warning(s):`);
      for (const err of errors) {
        console.warn(`  - [${err.slug}] ${err.field}: ${err.message}`);
      }
    }
  }

  return sorted;
}

export function getAllLessonSummaries(): LessonSummary[] {
  return getAllLessonSources().map(({ slug, metadata }) => ({ slug, metadata }));
}

export function getAllLessonSlugs(): string[] {
  return getAllLessonSummaries().map((l) => l.slug);
}

export interface ContentValidationError {
  slug: string;
  field: string;
  message: string;
}

export function validateContent(
  sources: LessonSource[] = getAllLessonSources()
): ContentValidationError[] {
  const errors: ContentValidationError[] = [];
  const seenStageLessons = new Set<string>();

  for (const s of sources) {
    const { slug, metadata } = s;
    if (!metadata.title) errors.push({ slug, field: "title", message: "Missing title" });
    if (!metadata.stage) errors.push({ slug, field: "stage", message: "Missing stage" });
    if (!metadata.course) errors.push({ slug, field: "course", message: "Missing course" });
    if (typeof metadata.lesson !== "number" || metadata.lesson <= 0) {
      errors.push({ slug, field: "lesson", message: "Invalid or missing lesson number" });
    }
    const stageKey = `${metadata.course}::${metadata.stage}::${metadata.lesson}`;
    if (seenStageLessons.has(stageKey)) {
      errors.push({ slug, field: "lesson", message: `Duplicate lesson number ${metadata.lesson} in stage "${metadata.stage}" for course "${metadata.course}"` });
    } else {
      seenStageLessons.add(stageKey);
    }
  }

  return errors;
}

function extractHeadings(markdown: string): HeadingItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const cleanText = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "");
    const id = cleanText.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    headings.push({ id, text: cleanText, level });
  }
  return headings;
}

function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 180));
}

export async function getLesson(slug: string): Promise<Lesson | null> {
  const allSources = getAllLessonSources();
  const source = allSources.find((s) => s.slug === slug);
  if (!source) return null;

  const enhancedHtml = await renderMarkdownToHtml(source.markdown);
  const readingTime = calculateReadingTime(source.markdown);
  const headings = extractHeadings(source.markdown);

  return {
    slug: source.slug,
    metadata: source.metadata,
    content: enhancedHtml,
    readingTime,
    headings,
  };
}

export async function getAllLessons(): Promise<Lesson[]> {
  const sources = getAllLessonSources();
  return Promise.all(
    sources.map(async (source) => {
      const enhancedHtml = await renderMarkdownToHtml(source.markdown);
      const readingTime = calculateReadingTime(source.markdown);
      const headings = extractHeadings(source.markdown);
      return { slug: source.slug, metadata: source.metadata, content: enhancedHtml, readingTime, headings };
    })
  );
}

export function getLessonStages(courseId?: string): LessonStage[] {
  const allLessons = getAllLessonSummaries();
  const filtered = courseId
    ? allLessons.filter((l) => l.metadata.course === courseId)
    : allLessons;

  const stagesMap = new Map<string, { name: string; stageOrder: number; courseId: string; courseTitle: string; lessons: LessonSummary[] }>();

  for (const lesson of filtered) {
    const key = `${lesson.metadata.course}::${lesson.metadata.stage}`;
    const stageOrder = lesson.metadata.stageOrder ?? 99;
    const existing = stagesMap.get(key);
    if (existing) {
      existing.stageOrder = Math.min(existing.stageOrder, stageOrder);
      existing.lessons.push(lesson);
    } else {
      stagesMap.set(key, {
        name: lesson.metadata.stage,
        stageOrder,
        courseId: lesson.metadata.course,
        courseTitle: lesson.metadata.courseTitle || lesson.metadata.course,
        lessons: [lesson],
      });
    }
  }

  const grouped = Array.from(stagesMap.values()).sort((a, b) => {
    if (a.courseId !== b.courseId) {
      const orderA = getCourseConfig(a.courseId).order ?? 99;
      const orderB = getCourseConfig(b.courseId).order ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.courseId.localeCompare(b.courseId);
    }
    if (a.stageOrder !== b.stageOrder) return a.stageOrder - b.stageOrder;
    return a.name.localeCompare(b.name);
  });

  return grouped.map((stage, index) => ({
    name: stage.name,
    number: index + 1,
    stageOrder: stage.stageOrder,
    courseId: stage.courseId,
    courseTitle: stage.courseTitle,
    lessons: stage.lessons.sort(compareLessons),
  }));
}

export function getAllCourses(): Course[] {
  const allLessons = getAllLessonSummaries();
  const courseIds = Array.from(new Set(allLessons.map((l) => l.metadata.course)));

  const courses: Course[] = [];
  for (const id of courseIds) {
    const config = getCourseConfig(id);
    const stages = getLessonStages(id);
    const totalLessons = stages.reduce((acc, s) => acc + s.lessons.length, 0);
    courses.push({
      id: config.id,
      slug: config.slug,
      title: config.title,
      description: config.description,
      category: config.category,
      order: config.order,
      badge: config.badge,
      stages,
      totalLessons,
    });
  }

  return courses.sort((a, b) => a.order - b.order);
}

export function getCourse(courseId: string): Course | null {
  const courses = getAllCourses();
  return courses.find((c) => c.id === courseId || c.slug === courseId) || null;
}

export function getLessonsByStage(stage: string, courseId?: string): LessonSummary[] {
  const stages = getLessonStages(courseId);
  return stages.find((s) => s.name === stage)?.lessons ?? [];
}

export function getLessonContext(slug: string): LessonContext | null {
  const allLessons = getAllLessonSummaries();
  const current = allLessons.find((l) => l.slug === slug);
  if (!current) return null;

  const courseId = current.metadata.course;
  const course = getCourse(courseId);
  if (!course) return null;

  const courseLessons = course.stages.flatMap((s) => s.lessons);
  const lessonPositionInCourse = courseLessons.findIndex((l) => l.slug === slug);
  if (lessonPositionInCourse === -1) return null;

  const stage = course.stages.find((s) => s.name === current.metadata.stage);
  if (!stage) return null;

  const lessonIndexInStage = stage.lessons.findIndex((l) => l.slug === slug);

  return {
    current,
    previous: courseLessons[lessonPositionInCourse - 1] ?? null,
    next: courseLessons[lessonPositionInCourse + 1] ?? null,
    stage,
    course,
    lessonIndex: lessonIndexInStage,
    totalLessonsInStage: stage.lessons.length,
    totalLessonsInCourse: courseLessons.length,
  };
}

export function getAdjacentLessons(slug: string): Pick<LessonContext, "previous" | "next"> | null {
  const context = getLessonContext(slug);
  if (!context) return null;
  return { previous: context.previous, next: context.next };
}
