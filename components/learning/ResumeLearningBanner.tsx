"use client";

import Link from "next/link";
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

  if (!lastVisited && completedSlugs.length === 0) {
    return null;
  }

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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-10">
      <div className="flex flex-col gap-4 border-y border-hairline py-4 sm:flex-row sm:items-center">
        <span className="kicker shrink-0 text-signal/80">Resume</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl text-cream">{targetLesson.metadata.title}</h3>
          <p className="mt-1 font-mono text-[12px] text-cream/40">
            {courseName} · {completedCount}/{totalCount} ({progressPercent}%)
          </p>
        </div>
        <Link
          href={`/learn/${targetLesson.slug}`}
          className="link-editorial shrink-0 font-mono text-[13px] text-gold"
        >
          Continue reading →
        </Link>
      </div>
    </div>
  );
}
