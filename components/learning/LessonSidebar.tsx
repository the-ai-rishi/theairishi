"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ListOrdered } from "lucide-react";
import type { HeadingItem, LessonStage, LessonSummary } from "@/lib/lessons";
import { useLessonProgress } from "./useLessonProgress";

interface LessonSidebarProps {
  courseTitle?: string;
  stage: string;
  lessons: LessonSummary[];
  currentSlug: string;
  headings?: HeadingItem[];
  courseStages?: LessonStage[];
}

export default function LessonSidebar({
  courseTitle,
  stage,
  lessons,
  currentSlug,
  headings = [],
  courseStages,
}: LessonSidebarProps) {
  const { isCompleted, hasHydrated } = useLessonProgress();

  // If multiple stages in the course are provided, render all stages in the course
  const stagesToRender: LessonStage[] =
    courseStages && courseStages.length > 0
      ? courseStages
      : [
          {
            name: stage,
            number: 1,
            stageOrder: 1,
            courseId: lessons[0]?.metadata.course || "course",
            courseTitle: courseTitle || "Course",
            lessons,
          },
        ];

  const allCourseLessons = stagesToRender.flatMap((s) => s.lessons);
  const totalCompletedInCourse = allCourseLessons.filter((l) =>
    hasHydrated ? isCompleted(l.slug) : false
  ).length;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 space-y-6">
        {/* Course Syllabus Card */}
        <div className="border border-hairline bg-field/40 p-5">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold/70 font-medium">
                Course Syllabus
              </p>
              {courseTitle && (
                <h3 className="mt-0.5 text-xs font-semibold text-cream/90">
                  {courseTitle}
                </h3>
              )}
            </div>
            <span className="text-[11px] text-gold font-mono">
              {totalCompletedInCourse}/{allCourseLessons.length} done
            </span>
          </div>

          <div className="mt-4 space-y-5">
            {stagesToRender.map((stg) => {
              const isStageActive = stg.name === stage;

              return (
                <div key={stg.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium tracking-wide">
                    <span
                      className={
                        isStageActive ? "text-cream" : "text-cream/40"
                      }
                    >
                      Stage {String(stg.number).padStart(2, "0")} · {stg.name}
                    </span>
                  </div>

                  <nav className="space-y-0.5 pl-1" aria-label={`${stg.name} lessons`}>
                    {stg.lessons.map((lesson) => {
                      const isCurrent = lesson.slug === currentSlug;
                      const completed = hasHydrated
                        ? isCompleted(lesson.slug)
                        : false;

                      return (
                        <Link
                          key={lesson.slug}
                          href={`/learn/${lesson.slug}`}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`group flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs leading-snug transition ${
                            isCurrent
                              ? "bg-cream/[0.06] text-cream font-medium"
                              : "text-cream/40 hover:bg-cream/[0.03] hover:text-cream/80"
                          }`}
                        >
                          <span
                            className={`mt-0.5 shrink-0 transition-colors ${
                              completed
                                ? "text-emerald-400"
                                : isCurrent
                                  ? "text-gold"
                                  : "text-cream/20 group-hover:text-cream/40"
                            }`}
                            aria-hidden="true"
                          >
                            {completed ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : isCurrent ? (
                              <span className="flex h-3.5 w-3.5 items-center justify-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                              </span>
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                          </span>

                          <span className="flex-1">
                            <span className="mr-1 text-cream/25 font-mono">
                              {String(lesson.metadata.lesson).padStart(2, "0")}.
                            </span>
                            {lesson.metadata.title}
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>
        </div>

        {/* On this page / Table of contents */}
        {headings.length > 0 && (
          <div className="border border-hairline p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-cream/30">
              <ListOrdered className="h-3.5 w-3.5 text-gold/60" />
              <span>On this page</span>
            </div>

            <nav className="mt-3 space-y-1.5" aria-label="Table of contents">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`block text-xs leading-relaxed transition hover:text-gold-bright ${
                    heading.level === 3
                      ? "pl-3 text-cream/30 hover:text-cream/60"
                      : "text-cream/45"
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
