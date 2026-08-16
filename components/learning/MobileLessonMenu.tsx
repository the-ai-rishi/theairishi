"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Menu, X } from "lucide-react";
import type { LessonStage, LessonSummary } from "@/lib/lessons";
import { useLessonProgress } from "./useLessonProgress";

interface MobileLessonMenuProps {
  courseTitle?: string;
  stage: string;
  lessons: LessonSummary[];
  currentSlug: string;
  courseStages?: LessonStage[];
}

export default function MobileLessonMenu({
  courseTitle,
  stage,
  lessons,
  currentSlug,
  courseStages,
}: MobileLessonMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isCompleted, hasHydrated } = useLessonProgress();

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

  const allLessons = stagesToRender.flatMap((s) => s.lessons);
  const currentLesson = allLessons.find((l) => l.slug === currentSlug);
  const completedCount = allLessons.filter((l) =>
    hasHydrated ? isCompleted(l.slug) : false
  ).length;

  return (
    <>
      {/* Fixed bottom floating bar for mobile */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden w-[calc(100%-2rem)] max-w-md">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between rounded-full border border-white/15 bg-[#0a0a0d]/90 px-5 py-3 shadow-2xl backdrop-blur-md text-white text-xs font-medium transition active:scale-95"
        >
          <div className="flex items-center gap-2.5 line-clamp-1">
            <Menu className="h-4 w-4 text-violet-300 shrink-0" />
            <span className="text-white/60">Syllabus:</span>
            <span className="text-white truncate">
              {currentLesson?.metadata.title || "Lessons"}
            </span>
          </div>

          <span className="ml-2 shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60 font-mono">
            {completedCount}/{allLessons.length}
          </span>
        </button>
      </div>

      {/* Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative z-10 max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border-t border-white/15 bg-[#0d0d12] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-medium">
                  {courseTitle || "Course Syllabus"}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-white">
                  Curriculum Overview
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-5 pb-6">
              {stagesToRender.map((stg) => (
                <div key={stg.name} className="space-y-1.5">
                  <div className="text-[11px] font-medium text-white/40 tracking-wide uppercase">
                    Stage {String(stg.number).padStart(2, "0")} · {stg.name}
                  </div>

                  <nav className="space-y-1" aria-label={`${stg.name} lessons`}>
                    {stg.lessons.map((lesson) => {
                      const isCurrent = lesson.slug === currentSlug;
                      const completed = hasHydrated
                        ? isCompleted(lesson.slug)
                        : false;

                      return (
                        <Link
                          key={lesson.slug}
                          href={`/learn/${lesson.slug}`}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-start gap-3 rounded-xl p-2.5 text-xs leading-snug transition ${
                            isCurrent
                              ? "bg-white/[0.08] text-white font-medium border border-violet-400/20"
                              : "text-white/50 hover:bg-white/[0.03] hover:text-white"
                          }`}
                        >
                          <span
                            className={`mt-0.5 shrink-0 ${
                              completed
                                ? "text-emerald-400"
                                : isCurrent
                                  ? "text-violet-300"
                                  : "text-white/20"
                            }`}
                          >
                            {completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </span>

                          <div>
                            <span className="mr-1.5 text-white/30 font-mono">
                              {String(lesson.metadata.lesson).padStart(2, "0")}.
                            </span>
                            {lesson.metadata.title}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
