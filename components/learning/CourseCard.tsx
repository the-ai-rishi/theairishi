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
    <div className="group relative border-y border-hairline py-8 sm:py-10">

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Header & Meta */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-gold">
                {course.category}
              </span>

              {course.badge && (
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40">
                  {course.badge}
                </span>
              )}

              {isCourseFinished && (
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                  Completed
                </span>
              )}
            </div>

            <h3 className="font-serif text-3xl tracking-[0.01em] text-cream sm:text-4xl">
              {course.title}
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-cream/50 max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-cream/40 pt-1">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-gold/60" />
                <span>
                  {course.stages.length} Stage
                  {course.stages.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-gold/60" />
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
              className="inline-flex items-center gap-1.5 border border-hairline px-4 py-2.5 font-mono text-[12px] text-cream/60 hover:text-cream transition cursor-pointer"
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
              className="inline-flex items-center gap-2 bg-cream px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-ink transition hover:bg-gold-bright cursor-pointer"
            >
              <span>{completedCount > 0 ? "Continue learning" : "Start course"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 border-t border-hairline pt-4">
          <div className="flex items-center justify-between text-[11px] text-cream/35">
            <span>Course completion</span>
            <span className="font-mono">
              {completedCount} of {allCourseLessons.length} completed ({progress}%)
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden bg-hairline">
            <div
              className="h-full bg-gradient-to-r from-gold to-circuit transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Expanded Stages & Lessons View */}
        {isExpanded && (
          <div className="mt-6 space-y-6 border-t border-hairline pt-6 animate-in fade-in duration-200">
            {course.stages.map((stage) => {
              const stageCompletedCount = stage.lessons.filter((l) =>
                hasHydrated ? isCompleted(l.slug) : false
              ).length;

              return (
                <div
                  key={stage.name}
                  className="border border-hairline p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70 font-mono">
                        Stage {String(stage.number).padStart(2, "0")}
                      </span>
                      <h4 className="text-sm font-medium text-white">
                        {stage.name}
                      </h4>
                    </div>

                    <span className="text-[11px] text-cream/35 font-mono">
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
                          className="group/lesson flex items-center justify-between gap-3 border border-hairline p-3 text-xs transition hover:border-gold/30"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span
                              className={`shrink-0 ${
                                completed
                                  ? "text-emerald-400"
                                  : "text-cream/20"
                              }`}
                            >
                              {completed ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <Circle className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <span className="text-cream/35 font-mono">
                              {String(lesson.metadata.lesson).padStart(2, "0")}.
                            </span>
                            <span className="text-cream/80 group-hover/lesson:text-cream truncate">
                              {lesson.metadata.title}
                            </span>
                          </div>

                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cream/20 group-hover/lesson:text-gold transition-transform group-hover/lesson:translate-x-0.5" />
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
