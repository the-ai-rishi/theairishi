"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Check, ChevronRight, Clock, Share2 } from "lucide-react";

interface LessonHeaderProps {
  courseTitle?: string;
  stageNumber: number;
  stage: string;
  title: string;
  description: string;
  lessonNumber: number;
  totalLessons: number;
  readingTime?: number;
}

export default function LessonHeader({
  courseTitle,
  stageNumber,
  stage,
  title,
  description,
  lessonNumber,
  totalLessons,
  readingTime = 4,
}: LessonHeaderProps) {
  const [copied, setCopied] = useState(false);
  const progress =
    totalLessons > 0 ? Math.round((lessonNumber / totalLessons) * 100) : 0;

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } else if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore user cancellation
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pt-24">
      {/* Breadcrumb Navigation & Share Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-cream/40">
          <Link
            href="/learn"
            className="transition hover:text-cream hover:underline underline-offset-4"
          >
            Learning Hub
          </Link>
          {courseTitle && (
            <>
              <ChevronRight className="h-3 w-3 text-cream/25 shrink-0" />
              <span className="text-cream/60">{courseTitle}</span>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-cream/25 shrink-0" />
          <span className="text-cream/80 font-medium">
            Stage {String(stageNumber).padStart(2, "0")} · {stage}
          </span>
        </nav>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/45 hover:bg-white/[0.08] hover:text-cream transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Stage Badge & Reading Time */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Stage {String(stageNumber).padStart(2, "0")}
        </div>

        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-cream/45">
          <Clock className="h-3.5 w-3.5 text-white/30" />
          <span>{readingTime} min read</span>
        </div>

        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-cream/45">
          <BookOpen className="h-3.5 w-3.5 text-white/30" />
          <span>Lesson {lessonNumber} of {totalLessons}</span>
        </div>
      </div>

      <h1 className="mt-6 font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-cream/50">
        {description}
      </p>

      {/* Stage Progress Bar */}
      <div className="mt-10">
        <div className="flex items-center justify-between text-xs text-cream/35">
          <span>Stage progress</span>
          <span>{progress}% complete</span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden bg-hairline">
          <div
            className="h-full bg-gradient-to-r from-gold to-circuit transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
