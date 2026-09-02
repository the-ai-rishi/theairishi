"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 via-black to-indigo-950/40 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs uppercase font-mono tracking-wider text-violet-300">
                  {hasProgress ? "Continue Learning" : "Start Your Learning Journey"}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                {activeCourse?.title || "Start learning"}
              </h3>

              <p className="text-xs sm:text-sm text-white/50 max-w-xl leading-relaxed">
                {hasProgress
                  ? `You have completed ${totalCompletedInCourse} of ${totalLessonsInCourse} lessons in this course.`
                  : `Begin with ${activeCourse?.title || "the first course"}.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              {hasProgress && (
                <div className="w-full sm:w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-violet-400 h-full transition-all duration-500"
                    style={{ width: `${Math.max(5, progressPercent)}%` }}
                  />
                </div>
              )}

              <Link
                href={targetHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-black transition hover:bg-white/90"
              >
                <span>{hasProgress ? "Continue Lesson" : "Start First Lesson"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
