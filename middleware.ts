import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLISHED_LESSON_SLUG_SET } from "./lib/published-lesson-slugs.generated";

const STATIC_LEARN_SEGMENTS = new Set(["ai-fundamentals"]);

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/learn\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const slug = match[1];
  if (STATIC_LEARN_SEGMENTS.has(slug) || PUBLISHED_LESSON_SLUG_SET.has(slug)) {
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
