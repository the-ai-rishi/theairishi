"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { LessonSummary } from "@/lib/lessons";
import { useLessonProgress } from "./useLessonProgress";

interface ResumeLearningBannerProps {
  allLessons: LessonSummary[];
}

export default function ResumeLearningBanner({
  allLessons,
}: ResumeLearningBannerProps) {
  const { lastVisited, completedSlugs, hasHydrated } = useLessonProgress();

  if (!hasHydrated || allLessons.length === 0) {
    return null;
  }

  // If user hasn't visited and has no completed lessons, don't show the resume banner yet
  if (!lastVisited && completedSlugs.length === 0) {
    return null;
  }

  // Find the target lesson: last visited, or first uncompleted lesson, or first lesson
  let targetLesson = allLessons.find((l) => l.slug === lastVisited);

  if (!targetLesson) {
    targetLesson =
      allLessons.find((l) => !completedSlugs.includes(l.slug)) || allLessons[0];
  }

  const completedCount = completedSlugs.length;
  const totalCount = allLessons.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const courseName = targetLesson.metadata.courseTitle || "Course";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-violet-400/25 bg-gradient-to-r from-violet-950/40 via-black to-indigo-950/30 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-violet-300 font-medium">
              <Sparkles className="h-3 w-3" />
              Resume: {courseName}
            </div>

            <h3 className="text-xl font-semibold text-white">
              {targetLesson.metadata.title}
            </h3>

            <p className="text-xs text-white/50">
              {targetLesson.metadata.stage} · Lesson{" "}
              {String(targetLesson.metadata.lesson).padStart(2, "0")} · {completedCount} of {totalCount} total curriculum lessons completed ({progressPercent}%)
            </p>
          </div>

          <Link
            href={`/learn/${targetLesson.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-black transition hover:bg-white/90 shadow-md shrink-0 cursor-pointer"
          >
            <span>Continue reading</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
