/**
 * Canonical public-lesson predicate. Runtime, generator, and validate
 * all use lib/lesson-publish.js. Do not add another checker.
 */
export function isPublicLessonFrontmatter(data: unknown): boolean;
export function isPublicLessonMarkdown(body: string): boolean;
export function isLessonSourcePath(filePath: string): boolean;
export function collectPublishedLessonSlugs(embedded: Record<string, string>): string[];
