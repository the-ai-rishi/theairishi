"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Layers,
  Sparkles,
} from "lucide-react";
import type { Course } from "@/lib/lessons";
import { useLessonProgress } from "./useLessonProgress";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isCompleted, hasHydrated } = useLessonProgress();

  const allCourseLessons = course.stages.flatMap((s) => s.lessons);
  const firstLesson = allCourseLessons[0];
  if (!firstLesson) return null;

  const completedCount = allCourseLessons.filter((l) =>
    hasHydrated ? isCompleted(l.slug) : false
  ).length;

  const progress =
    allCourseLessons.length > 0
      ? Math.round((completedCount / allCourseLessons.length) * 100)
      : 0;

  // Next uncompleted lesson in this course, or first lesson
  const nextLesson =
    allCourseLessons.find((l) => (hasHydrated ? !isCompleted(l.slug) : true)) ||
    firstLesson;

  const isCourseFinished =
    completedCount === allCourseLessons.length && allCourseLessons.length > 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 transition-all duration-300 hover:border-violet-400/25 hover:bg-white/[0.02]">
      {/* Background glow accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl group-hover:bg-violet-600/20 transition-all duration-500" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Header & Meta */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-violet-300 font-medium">
                <Sparkles className="h-3 w-3" />
                {course.category}
              </span>

              {course.badge && (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/40 font-mono">
                  {course.badge}
                </span>
              )}

              {isCourseFinished && (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300 font-medium">
                  Completed
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {course.title}
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-white/50 max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 pt-1">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-violet-300/60" />
                <span>
                  {course.stages.length} Stage
                  {course.stages.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-violet-300/60" />
                <span>
                  {allCourseLessons.length} Lesson
                  {allCourseLessons.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-white/60 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
            >
              <span>{isExpanded ? "Hide curriculum" : "Explore stages"}</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            <Link
              href={`/learn/${nextLesson.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90 shadow-md cursor-pointer"
            >
              <span>{completedCount > 0 ? "Continue learning" : "Start course"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between text-[11px] text-white/35">
            <span>Course completion</span>
            <span className="font-mono">
              {completedCount} of {allCourseLessons.length} completed ({progress}%)
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Expanded Stages & Lessons View */}
        {isExpanded && (
          <div className="mt-6 space-y-6 border-t border-white/[0.08] pt-6 animate-in fade-in duration-200">
            {course.stages.map((stage) => {
              const stageCompletedCount = stage.lessons.filter((l) =>
                hasHydrated ? isCompleted(l.slug) : false
              ).length;

              return (
                <div
                  key={stage.name}
                  className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-violet-300/70 font-mono">
                        Stage {String(stage.number).padStart(2, "0")}
                      </span>
                      <h4 className="text-sm font-medium text-white">
                        {stage.name}
                      </h4>
                    </div>

                    <span className="text-[11px] text-white/35 font-mono">
                      {stageCompletedCount}/{stage.lessons.length} done
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 pt-2">
                    {stage.lessons.map((lesson) => {
                      const completed = hasHydrated
                        ? isCompleted(lesson.slug)
                        : false;

                      return (
                        <Link
                          key={lesson.slug}
                          href={`/learn/${lesson.slug}`}
                          className="group/lesson flex items-center justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3 text-xs transition hover:border-violet-400/25 hover:bg-white/[0.04]"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span
                              className={`shrink-0 ${
                                completed
                                  ? "text-emerald-400"
                                  : "text-white/20"
                              }`}
                            >
                              {completed ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <Circle className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <span className="text-white/35 font-mono">
                              {String(lesson.metadata.lesson).padStart(2, "0")}.
                            </span>
                            <span className="text-white/80 group-hover/lesson:text-white truncate">
                              {lesson.metadata.title}
                            </span>
                          </div>

                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/15 group-hover/lesson:text-violet-300 transition-transform group-hover/lesson:translate-x-0.5" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
