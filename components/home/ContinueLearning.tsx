"use client";

import Link from "next/link";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import { Course } from "@/lib/lessons";

export default function ContinueLearning({ courses }: { courses: Course[] }) {
  const { completedSlugs } = useLessonProgress();

  if (!courses.length) return null;

  const hasProgress = completedSlugs.length > 0;

  const lessonSlugsFor = (course: Course) =>
    course.stages?.flatMap((s) => s.lessons.map((l) => l.slug)) ?? [];

  const activeCourse =
    courses.find((c) =>
      lessonSlugsFor(c).some((slug) => completedSlugs.includes(slug))
    ) || courses[0];

  const activeLessonSlugs = activeCourse ? lessonSlugsFor(activeCourse) : [];
  const totalCompletedInCourse = activeLessonSlugs.filter((slug) =>
    completedSlugs.includes(slug)
  ).length;

  const totalLessonsInCourse = activeCourse?.totalLessons || 1;
  const progressPercent = Math.round(
    (totalCompletedInCourse / totalLessonsInCourse) * 100
  );

  const allActiveCourseLessons = activeCourse?.stages?.flatMap((s) => s.lessons) || [];
  const firstUncompletedLesson = allActiveCourseLessons.find(
    (l) => !completedSlugs.includes(l.slug)
  );
  const targetLessonSlug = firstUncompletedLesson?.slug || allActiveCourseLessons[0]?.slug;
  const targetHref = targetLessonSlug ? `/learn/${targetLessonSlug}` : "/learn";

  return (
    <section id="continue" className="py-2 sm:py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-y border-hairline py-4 sm:flex-row sm:items-center sm:gap-6">
          <span className="kicker shrink-0 text-signal/80">
            {hasProgress ? "Continue" : "Begin"}
          </span>
          <h3 className="min-w-0 flex-1 font-serif text-xl tracking-[0.01em] text-cream sm:text-2xl">
            {activeCourse?.title || "Start learning"}
          </h3>
          {hasProgress ? (
            <div className="flex items-center gap-3 sm:w-40">
              <div className="h-px flex-1 bg-hairline">
                <div
                  className="h-px bg-gold"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>
              <span className="font-mono text-[12px] text-cream/40">
                {progressPercent}%
              </span>
            </div>
          ) : null}
          <Link
            href={targetHref}
            className="link-editorial shrink-0 font-mono text-[13px] tracking-[0.12em] text-cream/70 hover:text-gold"
          >
            {hasProgress ? "Resume →" : "Open path →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
