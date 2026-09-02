"use client";

import { useEffect } from "react";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { useLessonProgress } from "./useLessonProgress";

interface LessonCompletionButtonProps {
  slug: string;
  nextSlug: string | null;
}

export default function LessonCompletionButton({
  slug,
}: LessonCompletionButtonProps) {
  const { isCompleted, toggleComplete, setLastVisited, hasHydrated } =
    useLessonProgress();

  useEffect(() => {
    if (hasHydrated) {
      setLastVisited(slug);
    }
  }, [slug, hasHydrated, setLastVisited]);

  if (!hasHydrated) {
    return (
      <div className="border border-hairline bg-field/40 p-6 text-center">
        <div className="h-10 w-44 mx-auto bg-hairline" />
      </div>
    );
  }

  const completed = isCompleted(slug);

  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-300 ${
        completed
          ? "border-signal/30 bg-signal/5"
          : "border-hairline bg-field/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center border transition-colors ${
              completed
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-400"
                : "border-hairline text-cream/30"
            }`}
          >
            {completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-cream">
              {completed ? "Lesson Completed!" : "Finished reading?"}
            </div>
            <p className="text-xs text-cream/40 mt-0.5">
              {completed
                ? "Your progress has been recorded. Ready for the next topic."
                : "Mark this lesson as complete to track your curriculum progress."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleComplete(slug)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wide transition cursor-pointer ${
            completed
              ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
              : "border border-hairline bg-cream text-ink hover:bg-gold-bright"
          }`}
        >
          {completed ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" />
              Mark as complete
            </>
          )}
        </button>
      </div>
    </div>
  );
}
