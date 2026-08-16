import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

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
  stage: string;
  stageOrder?: number;
  lesson: number;
  tags?: string[];
  duration?: string;
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

// Known course fallback metadata
const DEFAULT_COURSES: Record<string, CourseMetadata> = {
  ai: {
    id: "ai",
    slug: "ai",
    title: "Artificial Intelligence & LLMs",
    description:
      "A first-principles curriculum covering AI fundamentals, machine learning models, transformers, large language models, RAG, and autonomous agents.",
    category: "Artificial Intelligence",
    order: 1,
    badge: "Core Path",
  },
  devops: {
    id: "devops",
    slug: "devops",
    title: "DevOps & Cloud Engineering",
    description:
      "Master modern infrastructure automation, CI/CD pipelines, containerization, Kubernetes, infrastructure-as-code, and cloud deployment.",
    category: "Infrastructure & DevOps",
    order: 2,
    badge: "Engineering",
  },
  cloud: {
    id: "cloud",
    slug: "cloud",
    title: "Cloud Architecture & Platforms",
    description:
      "Deep dive into multi-cloud architecture, Azure, AWS, Google Cloud, distributed systems, and scalable backend infrastructure.",
    category: "Cloud Computing",
    order: 3,
    badge: "Architecture",
  },
  programming: {
    id: "programming",
    slug: "programming",
    title: "Software Engineering & Languages",
    description:
      "High-performance programming in Python, TypeScript, Rust, database design with SQL, and modern system architectures.",
    category: "Software Development",
    order: 4,
    badge: "Development",
  },
};

function getString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
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

  // Derive course from frontmatter or slug prefix
  let courseId = getString(data.course)?.toLowerCase();
  if (!courseId) {
    if (slug.startsWith("devops-")) {
      courseId = "devops";
    } else if (slug.startsWith("cloud-") || slug.startsWith("azure-") || slug.startsWith("aws-")) {
      courseId = "cloud";
    } else {
      courseId = "ai";
    }
  }

  const defaultCourse = DEFAULT_COURSES[courseId];
  const courseTitle =
    getString(data.courseTitle) ||
    defaultCourse?.title ||
    courseId.toUpperCase();
  const courseOrder =
    getPositiveNumber(data.courseOrder) ||
    defaultCourse?.order ||
    99;

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
    stage,
    stageOrder,
    lesson,
    tags,
    duration,
  };
}

// Recursively find all markdown files under a directory
function getMarkdownFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

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

  // Remove duplicates based on path
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

    if (!metadata) {
      return null;
    }

    return {
      slug,
      metadata,
      markdown: parsed.content,
    };
  } catch (error) {
    console.warn(`[lessons] Skipping "${filePath}": unable to parse.`, error);
    return null;
  }
}

function compareLessons(first: LessonSummary, second: LessonSummary): number {
  // 1. Sort by Course Order
  const firstCourseOrder = first.metadata.courseOrder ?? 99;
  const secondCourseOrder = second.metadata.courseOrder ?? 99;
  if (firstCourseOrder !== secondCourseOrder) {
    return firstCourseOrder - secondCourseOrder;
  }

  // 2. Sort by Stage Order
  const firstStageOrder = first.metadata.stageOrder ?? 99;
  const secondStageOrder = second.metadata.stageOrder ?? 99;
  if (firstStageOrder !== secondStageOrder) {
    return firstStageOrder - secondStageOrder;
  }

  // 3. Sort by Stage Name
  const stageCompare = first.metadata.stage.localeCompare(
    second.metadata.stage,
    undefined,
    { sensitivity: "base" }
  );
  if (stageCompare !== 0) {
    return stageCompare;
  }

  // 4. Sort by Lesson Number within Stage
  if (first.metadata.lesson !== second.metadata.lesson) {
    return first.metadata.lesson - second.metadata.lesson;
  }

  // 5. Tie-break with slug
  return first.slug.localeCompare(second.slug, undefined, {
    numeric: true,
    sensitivity: "base",
  });
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
  return getAllLessonSources().map(({ slug, metadata }) => ({
    slug,
    metadata,
  }));
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

    if (!metadata.title) {
      errors.push({ slug, field: "title", message: "Missing title" });
    }
    if (!metadata.stage) {
      errors.push({ slug, field: "stage", message: "Missing stage" });
    }
    if (!metadata.course) {
      errors.push({ slug, field: "course", message: "Missing course" });
    }
    if (typeof metadata.lesson !== "number" || metadata.lesson <= 0) {
      errors.push({
        slug,
        field: "lesson",
        message: "Invalid or missing lesson number",
      });
    }

    const stageKey = `${metadata.course}::${metadata.stage}::${metadata.lesson}`;
    if (seenStageLessons.has(stageKey)) {
      errors.push({
        slug,
        field: "lesson",
        message: `Duplicate lesson number ${metadata.lesson} in stage "${metadata.stage}" for course "${metadata.course}"`,
      });
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
    const cleanText = rawText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "");

    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ id, text: cleanText, level });
  }

  return headings;
}

function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 180));
}

function enhanceHtmlContent(rawHtml: string): string {
  // Transform GitHub alert callouts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
  let enhanced = rawHtml.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type: string, content: string) => {
      const alertType = type.toLowerCase();
      return `<div class="callout callout-${alertType}" role="note"><div class="callout-header"><span class="callout-badge">${type}</span></div><div class="callout-content"><p>${content.trim()}</p></div></div>`;
    }
  );

  // Transform Key Idea callouts
  enhanced = enhanced.replace(
    /<blockquote>\s*<p>\s*(?:<strong>)?Key\s+idea:?(?:<\/strong>)?\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, content: string) => {
      return `<div class="callout callout-key-idea"><div class="callout-header"><span class="callout-badge">KEY TAKEAWAY</span></div><div class="callout-content"><p>${content.trim()}</p></div></div>`;
    }
  );

  // Add anchor IDs to h2 and h3
  enhanced = enhanced.replace(
    /<h([23])>(.*?)<\/h\1>/gi,
    (_, level: string, text: string) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h${level} id="${id}" class="group scroll-mt-24"><a href="#${id}" class="anchor-link" aria-hidden="true">#</a><span>${text}</span></h${level}>`;
    }
  );

  // Wrap tables in responsive scroll wrapper
  enhanced = enhanced.replace(
    /(<table>[\s\S]*?<\/table>)/gi,
    '<div class="table-container my-8 overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.015] p-1">$1</div>'
  );

  return enhanced;
}

export async function getLesson(slug: string): Promise<Lesson | null> {
  const allSources = getAllLessonSources();
  const source = allSources.find((s) => s.slug === slug);

  if (!source) {
    return null;
  }

  const processedContent = await remark().use(html).process(source.markdown);
  const rawHtml = processedContent.toString();
  const enhancedHtml = enhanceHtmlContent(rawHtml);
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
      const processedContent = await remark()
        .use(html)
        .process(source.markdown);
      const rawHtml = processedContent.toString();
      const enhancedHtml = enhanceHtmlContent(rawHtml);
      const readingTime = calculateReadingTime(source.markdown);
      const headings = extractHeadings(source.markdown);

      return {
        slug: source.slug,
        metadata: source.metadata,
        content: enhancedHtml,
        readingTime,
        headings,
      };
    })
  );
}

export function getLessonStages(courseId?: string): LessonStage[] {
  const allLessons = getAllLessonSummaries();
  const filtered = courseId
    ? allLessons.filter((l) => l.metadata.course === courseId)
    : allLessons;

  // Group by "courseId::stageName" to prevent collisions between courses with similar stage names
  const stagesMap = new Map<
    string,
    {
      name: string;
      stageOrder: number;
      courseId: string;
      courseTitle: string;
      lessons: LessonSummary[];
    }
  >();

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
      const orderA = DEFAULT_COURSES[a.courseId]?.order ?? 99;
      const orderB = DEFAULT_COURSES[b.courseId]?.order ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.courseId.localeCompare(b.courseId);
    }
    if (a.stageOrder !== b.stageOrder) {
      return a.stageOrder - b.stageOrder;
    }
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
  const courseIds = Array.from(
    new Set(allLessons.map((l) => l.metadata.course))
  );

  const courses: Course[] = [];

  for (const id of courseIds) {
    const defaultMeta = DEFAULT_COURSES[id] || {
      id,
      slug: id,
      title: id.toUpperCase(),
      description: `Comprehensive learning curriculum for ${id}.`,
      category: "Technology",
      order: 99,
    };

    const stages = getLessonStages(id);
    const totalLessons = stages.reduce(
      (acc, s) => acc + s.lessons.length,
      0
    );

    courses.push({
      ...defaultMeta,
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

export function getLessonsByStage(
  stage: string,
  courseId?: string
): LessonSummary[] {
  const stages = getLessonStages(courseId);
  return stages.find((s) => s.name === stage)?.lessons ?? [];
}

export function getLessonContext(slug: string): LessonContext | null {
  const allLessons = getAllLessonSummaries();
  const current = allLessons.find((l) => l.slug === slug);

  if (!current) {
    return null;
  }

  const courseId = current.metadata.course;
  const course = getCourse(courseId);
  if (!course) {
    return null;
  }

  // All lessons within THIS COURSE in sequential order
  const courseLessons = course.stages.flatMap((s) => s.lessons);
  const lessonPositionInCourse = courseLessons.findIndex(
    (l) => l.slug === slug
  );

  if (lessonPositionInCourse === -1) {
    return null;
  }

  const stage = course.stages.find(
    (s) => s.name === current.metadata.stage
  );

  if (!stage) {
    return null;
  }

  const lessonIndexInStage = stage.lessons.findIndex(
    (l) => l.slug === slug
  );

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

export function getAdjacentLessons(slug: string): Pick<
  LessonContext,
  "previous" | "next"
> | null {
  const context = getLessonContext(slug);
  if (!context) return null;
  return {
    previous: context.previous,
    next: context.next,
  };
}
