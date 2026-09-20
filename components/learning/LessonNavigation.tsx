"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDayLabel } from "@/lib/labels";

interface AdjacentLesson {
  slug: string;
  metadata: { title: string; stage?: string; day?: number };
}

interface LessonNavigationProps {
  previous: AdjacentLesson | null;
  next: AdjacentLesson | null;
  currentStage: string;
  waitTitle?: string | null;
  waitDay?: number | null;
}

export default function LessonNavigation({
  previous,
  next,
  currentStage,
  waitTitle,
  waitDay,
}: LessonNavigationProps) {
  const router = useRouter();

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
    next && next.metadata.stage && next.metadata.stage !== currentStage
      ? "Continue to next phase"
      : "Next day";

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
          className="group flex items-center justify-between gap-3 border border-gold/25 bg-gold/[0.04] p-4 text-right transition hover:border-gold/50 sm:justify-self-end w-full"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] uppercase tracking-[0.16em] text-gold/80">
              {nextLabel} · ]
            </span>
            <span className="mt-0.5 block text-sm font-medium text-cream group-hover:text-cream line-clamp-1">
              {next.metadata.title}
            </span>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/40 bg-gold/15 text-gold-bright">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ) : waitTitle ? (
        <div className="border border-hairline p-4 text-left sm:text-right sm:justify-self-end w-full">
          <span className="block text-[11px] uppercase tracking-[0.16em] text-cream/40">
            Next day is planned
          </span>
          <span className="mt-0.5 block text-sm font-medium text-cream/70">
            {waitDay ? `${formatDayLabel(waitDay)} - ${waitTitle}` : waitTitle}
          </span>
          <Link href="/learn" className="mt-2 inline-block font-mono text-[12px] text-gold">
            See the 120-day map
          </Link>
        </div>
      ) : (
        <Link
          href="/learn"
          className="group flex w-full items-center justify-between gap-3 border border-gold/20 bg-gold/[0.06] p-4 text-right transition hover:border-gold/40 hover:bg-gold/10 sm:justify-self-end"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] uppercase tracking-[0.16em] text-gold/70">
              Back to the map
            </span>
            <span className="mt-0.5 block text-sm font-medium text-cream">
              120-day command center
            </span>
          </div>
        </Link>
      )}
    </nav>
  );
}
