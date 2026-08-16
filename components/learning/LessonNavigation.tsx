"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookCheck } from "lucide-react";
import type { LessonSummary } from "@/lib/lessons";

interface LessonNavigationProps {
  previous: LessonSummary | null;
  next: LessonSummary | null;
  currentStage: string;
}

export default function LessonNavigation({
  previous,
  next,
  currentStage,
}: LessonNavigationProps) {
  const router = useRouter();

  // Keyboard navigation shortcuts: [ for prev, ] for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === "[" && previous) {
        router.push(`/learn/${previous.slug}`);
      } else if (e.key === "]" && next) {
        router.push(`/learn/${next.slug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previous, next, router]);

  const nextLabel =
    next && next.metadata.stage !== currentStage
      ? "Continue to next stage"
      : "Next lesson";

  return (
    <nav
      className="mt-8 grid gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-2 sm:items-center"
      aria-label="Lesson navigation"
    >
      {previous ? (
        <Link
          href={`/learn/${previous.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/40 transition group-hover:border-white/20 group-hover:text-white">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-white/30">
              Previous · [
            </span>
            <span className="mt-0.5 block text-sm font-medium text-white/80 group-hover:text-white line-clamp-1">
              {previous.metadata.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/learn/${next.slug}`}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-violet-400/20 bg-violet-950/20 p-4 text-right transition hover:border-violet-400/40 hover:bg-violet-900/25 sm:justify-self-end w-full"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] uppercase tracking-[0.16em] text-violet-300/60">
              {nextLabel} · ]
            </span>
            <span className="mt-0.5 block text-sm font-medium text-white group-hover:text-violet-100 line-clamp-1">
              {next.metadata.title}
            </span>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/20 text-violet-200 transition group-hover:bg-violet-500/30">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ) : (
        <Link
          href="/learn"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4 text-right transition hover:border-emerald-400/40 hover:bg-emerald-900/25 sm:justify-self-end w-full"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] uppercase tracking-[0.16em] text-emerald-300/60">
              Course Completed!
            </span>
            <span className="mt-0.5 block text-sm font-medium text-white">
              Return to Learning Hub
            </span>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/20 text-emerald-200">
            <BookCheck className="h-4 w-4" />
          </div>
        </Link>
      )}
    </nav>
  );
}
