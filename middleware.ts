import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PUBLISHED_LESSON_SLUG_SET,
  STATIC_LEARN_SEGMENT_SET,
} from "./lib/published-lesson-slugs.generated";

/**
 * Unpublished /learn/[slug] 404s at the edge.
 *
 * Why middleware, not `dynamicParams = false`:
 * OpenNext Workers 404'd *published* prerendered days when that flag was set.
 * Why not `app/learn/[slug]/not-found.tsx`:
 * unknown slugs on Workers streamed the root Loading UI with HTTP 200.
 *
 * Allow-list is generated before every Next compile:
 * - published slugs: content/lessons/*.md via lib/lesson-publish.js
 *   (gray-matter + the same lifecycle rule as the runtime catalog)
 * - static segments: app/learn/<name>/page.* only (today: ai-fundamentals)
 * Markdown under content/courses/ is never a /learn route.
 */
export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/learn\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const slug = match[1];
  if (PUBLISHED_LESSON_SLUG_SET.has(slug) || STATIC_LEARN_SEGMENT_SET.has(slug)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/missing-lesson";
  return NextResponse.rewrite(url, {
    status: 404,
    headers: {
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "private, no-store",
    },
  });
}

export const config = {
  matcher: ["/learn/:slug"],
};
