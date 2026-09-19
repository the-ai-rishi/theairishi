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
    <section
      className="border border-hairline bg-field/40 p-6 sm:p-8"
      aria-labelledby="day-gate-heading"
    >
      <p className="kicker text-gold/80">Day gate</p>
      <h2 id="day-gate-heading" className="mt-3 font-serif text-3xl text-cream">
        {completed ? `${dayLabel} complete` : `Finish ${dayLabel}`}
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
        {completed
          ? "You marked this day complete. That is a claim about work you did, not about scrolling the page."
          : "Reading this page is not done. Mark complete only when the definition of done is true."}
      </p>

      {outcomes.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3 text-[15px] leading-relaxed text-cream/70">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => toggleComplete(slug)}
          className={
            completed
              ? "inline-flex min-h-11 items-center border border-gold/30 bg-gold/10 px-5 font-mono text-[13px] tracking-[0.08em] text-gold-bright"
              : "btn-primary"
          }
          aria-pressed={completed}
        >
          {completed ? "Completed — undo" : "Mark day complete"}
        </button>

        {completed && continueTarget?.href ? (
          <Link href={continueTarget.href} className="btn-primary">
            Continue {continueTarget.day ? formatDayLabel(continueTarget.day) : "next"}
          </Link>
        ) : null}
      </div>

      {waiting ? (
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream/50">
          {after.waitTitle
            ? `${formatDayLabel(after.waitDay || 0)} — ${after.waitTitle} is planned, not published yet. Come back to the 120-day map.`
            : "The next day is not published yet."}{" "}
          <Link href="/learn" className="link-editorial text-gold">
            See the plan
          </Link>
        </p>
      ) : null}

      {completed ? (
        <p className="mt-4">
          <a
            href="#main-content"
            className="font-mono text-[12px] tracking-[0.12em] text-cream/45 hover:text-gold"
          >
            Review this day
          </a>
        </p>
      ) : null}
    </section>
  );
}
