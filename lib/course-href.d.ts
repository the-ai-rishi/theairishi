/**
 * Single course-href authority. Runtime catalog and scenario tests both use
 * lib/course-href.js. Do not add a second implementation.
 */
export function hrefForCourse(
  course: { id: string; slug?: string } | null | undefined,
  live:
    | {
        id: string;
        stages?: Array<{
          lessons?: Array<{ slug: string; metadata: { course: string } }>;
        }>;
      }
    | undefined,
  program: { id: string; slug?: string; startHref?: string } | null | undefined
): string;
