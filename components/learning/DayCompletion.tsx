"use client";

import { useEffect } from "react";
import Link from "next/link";
import { formatDayLabel } from "@/lib/labels";
import { resolveContinue, type LearnerCatalog, type LearnerDay } from "@/lib/continue-learning";
import { useLessonProgress } from "./useLessonProgress";

interface DayCompletionProps {
  slug: string;
  day?: number;
  title: string;
  outcomes?: string[];
  catalog: LearnerCatalog;
  nextPublished: LearnerDay | null;
}

export default function DayCompletion({
  slug,
  day,
  title,
  outcomes = [],
  catalog,
  nextPublished,
}: DayCompletionProps) {
  const { isCompleted, toggleComplete, setLastVisited, hasHydrated, state } = useLessonProgress();

  useEffect(() => {
    setLastVisited(slug);
  }, [slug, setLastVisited]);

  const completed = hasHydrated && isCompleted(slug);
  const after = resolveContinue(state, catalog);
  const isProgramDay = catalog.days.some((item) => item.slug === slug);
  const continueTarget =
    completed && nextPublished
      ? nextPublished
      : completed && isProgramDay && after.kind !== "wait"
        ? { href: after.href, day: after.day, title: after.title, slug: after.slug }
        : null;
  const waiting = completed && isProgramDay && !nextPublished;
  const dayLabel = day ? formatDayLabel(day) : title;

  return (
    <section className="lesson-block lesson-block-gate p-0" aria-labelledby="day-gate-heading">
      <header className="lesson-block-head">
        <span className="lesson-block-label">Checkpoint</span>
      </header>
      <div className="p-5 sm:p-7">
        <h2 id="day-gate-heading" className="font-serif text-2xl text-cream sm:text-3xl">
          {completed ? `${dayLabel} proved` : `Can you prove ${dayLabel}?`}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
          {completed
            ? "You claimed the work. That is not the same as having scrolled the page."
            : "Completion is a claim about evidence on your machine, not about finishing the article."}
        </p>

        {outcomes.length > 0 ? (
          <div className="mt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
              {completed ? "What you claimed" : "You should now be able to"}
            </p>
            <ul className="mt-3 space-y-2">
              {outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-[15px] leading-relaxed text-cream/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => toggleComplete(slug)}
            className={
              completed
                ? "inline-flex min-h-11 items-center justify-center border border-gold/30 bg-gold/10 px-5 font-mono text-[13px] tracking-[0.08em] text-gold-bright"
                : "btn-primary btn-block"
            }
            aria-pressed={completed}
          >
            {completed ? "Undo complete" : "I can prove this"}
          </button>

          {completed && continueTarget?.href ? (
            <Link href={continueTarget.href} className="btn-primary btn-block">
              Continue {continueTarget.day ? formatDayLabel(continueTarget.day) : "next"}
            </Link>
          ) : null}
        </div>

        {waiting ? (
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream/50">
            {after.waitTitle
              ? `${formatDayLabel(after.waitDay || 0)} — ${after.waitTitle} is planned, not published yet.`
              : "The next day is not published yet."}{" "}
            <Link href="/learn" className="link-editorial text-gold">
              See the plan
            </Link>
          </p>
        ) : null}

        {completed ? (
          <p className="mt-4">
            <a href="#main-content" className="font-mono text-[12px] tracking-[0.12em] text-cream/45 hover:text-gold">
              Review this day
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
