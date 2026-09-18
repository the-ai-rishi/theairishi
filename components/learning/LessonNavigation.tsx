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
      className="mt-8 grid gap-4 border-t border-hairline pt-8 sm:grid-cols-2 sm:items-center"
      aria-label="Lesson navigation"
    >
      {previous ? (
        <Link
          href={`/learn/${previous.slug}`}
          className="group flex items-center gap-3 border border-hairline p-4 text-left transition hover:border-gold/30"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-cream/40 transition group-hover:text-cream">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-cream/30">
              Previous · [
            </span>
            <span className="mt-0.5 block text-sm font-medium text-cream/80 group-hover:text-cream line-clamp-1">
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
          className="group flex items-center justify-between gap-3 border border-circuit/30 bg-circuit/5 p-4 text-right transition hover:border-circuit sm:justify-self-end w-full"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] uppercase tracking-[0.16em] text-circuit-bright/80">
              {nextLabel} · ]
            </span>
            <span className="mt-0.5 block text-sm font-medium text-cream group-hover:text-cream line-clamp-1">
              {next.metadata.title}
            </span>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-circuit/40 bg-circuit/15 text-circuit-bright">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ) : (
        <Link
          href="/learn"
          className="group flex w-full items-center justify-between gap-3 border border-gold/20 bg-gold/[0.06] p-4 text-right transition hover:border-gold/40 hover:bg-gold/10 sm:justify-self-end"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] uppercase tracking-[0.16em] text-gold/70">
              Course Completed!
            </span>
            <span className="mt-0.5 block text-sm font-medium text-cream">
              Return to Learning Hub
            </span>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/30 bg-gold/20 text-gold-bright">
            <BookCheck className="h-4 w-4" />
          </div>
        </Link>
      )}
    </nav>
  );
}
