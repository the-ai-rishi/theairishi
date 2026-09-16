"use client";

import Link from "next/link";
import type { Course } from "@/lib/lessons";
import { useLessonProgress } from "@/components/learning/useLessonProgress";

export default function FeaturedPath({ course }: { course: Course }) {
  const { completedSlugs, hasHydrated } = useLessonProgress();
  const lessons = course.stages?.flatMap((s) => s.lessons) ?? [];
  const first = lessons[0];
  const next =
    lessons.find((l) => (hasHydrated ? !completedSlugs.includes(l.slug) : true)) || first;
  const completed = hasHydrated
    ? lessons.filter((l) => completedSlugs.includes(l.slug)).length
    : 0;
  const total = lessons.length || course.totalLessons || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const href = next ? `/learn/${next.slug}` : "/learn";
  const stageCount = course.stages?.length || 0;

  return (
    <article className="grid gap-8 border-b border-hairline py-10 lg:grid-cols-12 lg:py-14">
      <div className="lg:col-span-8">
        <p className="kicker text-gold/80">Featured path</p>
        <h3 className="mt-3 font-serif text-4xl leading-[1.05] tracking-[0.01em] text-cream sm:text-5xl lg:text-6xl">
          {course.title}
        </h3>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream/55 sm:text-lg">
          {course.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px] tracking-[0.08em] text-cream/45">
          <span>
            {total} {total === 1 ? "lesson" : "lessons"}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {stageCount} {stageCount === 1 ? "stage" : "stages"}
          </span>
          {course.badge ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{course.badge}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col justify-end gap-5 lg:col-span-4 lg:items-end">
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between font-mono text-[12px] text-cream/40">
            <span>Progress</span>
            <span className="tabular-nums">
              {completed}/{total}
            </span>
          </div>
          <div
            className="mt-2 h-px bg-hairline"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={completed}
            aria-label={`${completed} of ${total} lessons complete`}
          >
            <div className="h-px bg-gold" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Link href={href} className="btn-primary">
          {completed > 0 ? "Continue path" : "Begin path"}
        </Link>
      </div>
    </article>
  );
}
