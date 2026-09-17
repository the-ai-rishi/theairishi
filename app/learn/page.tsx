import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import ResumeLearningBanner from "@/components/learning/ResumeLearningBanner";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
  isContentTypeRoutable,
} from "@/lib/config";
import { getAllLessonSummaries } from "@/lib/lessons";
import { getHydratedPhases, getProgram, getPublishedProgramDays, getStartDay } from "@/lib/programs";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const program = getProgram();
  return {
    title: program.title,
    description: program.description,
    openGraph: {
      title: program.title,
      description: program.description,
      type: "website",
    },
  };
}

export default function LearnPage() {
  if (!isContentTypeRoutable("learn")) notFound();
  const program = getProgram();
  const phases = getHydratedPhases();
  const published = getPublishedProgramDays();
  const start = getStartDay();
  const allLessons = getAllLessonSummaries();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker text-gold/80">{program.durationLabel}</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          {program.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/55 sm:text-lg">
          {program.description}
        </p>
        <p className="mt-4 max-w-2xl font-mono text-[13px] leading-relaxed text-cream/40">
          {program.capstone}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {start?.href ? (
            <Link href={start.href} className="btn-primary">
              Start Day {String(start.day).padStart(2, "0")}
            </Link>
          ) : null}
          <a
            href={program.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="link-editorial font-mono text-[14px] tracking-[0.12em] text-cream/60 hover:text-gold"
          >
            GitHub source of truth →
          </a>
        </div>
      </section>

      <ResumeLearningBanner allLessons={allLessons} />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="kicker text-gold/80">Live today</p>
        <h2 className="mt-3 font-serif text-4xl text-cream">Published days</h2>
        {published.length === 0 ? (
          <p className="mt-6 text-cream/45">No daily lessons are published on this site yet.</p>
        ) : (
          <ol className="mt-8 divide-y divide-hairline border-y border-hairline">
            {published.map((day) => (
              <li key={day.slug}>
                <Link
                  href={day.href || `/learn/${day.slug}`}
                  className="group grid gap-2 py-5 sm:grid-cols-[4.5rem_1fr] sm:items-baseline"
                >
                  <span className="font-mono text-[13px] text-gold/80">
                    Day {String(day.day).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-serif text-2xl text-cream group-hover:text-gold-bright">
                      {day.title}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-cream/45">
                      {day.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="kicker text-gold/80">The map</p>
        <h2 className="mt-3 font-serif text-4xl text-cream">Eleven phases</h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/50">
          Titles below come from the locked 120-day execution plan. A day becomes a
          page on this site only when its lesson file is published. Unpublished days
          are not empty articles.
        </p>
        <div className="mt-10 space-y-12">
          {phases.map((phase) => (
            <section key={phase.id} className="border-t border-hairline pt-8">
              <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-gold/70">
                Phase {String(phase.number).padStart(2, "0")} · Days {phase.daysLabel}
                {phase.current ? " · current" : ""}
              </p>
              <h3 className="mt-2 font-serif text-3xl text-cream">{phase.name}</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/45">
                {phase.summary}
              </p>
              <ol className="mt-6 divide-y divide-hairline border-y border-hairline">
                {phase.days.map((day) => {
                  const inner = (
                    <span className="grid gap-1 py-3 sm:grid-cols-[4.5rem_1fr] sm:items-baseline">
                      <span className="font-mono text-[13px] text-cream/40">
                        {String(day.day).padStart(2, "0")}
                      </span>
                      <span>
                        <span className={`font-serif text-xl ${day.published ? "text-cream" : "text-cream/45"}`}>
                          {day.title}
                        </span>
                        <span className="mt-1 block text-[14px] text-cream/40">{day.summary}</span>
                      </span>
                    </span>
                  );
                  return (
                    <li key={day.slug}>
                      {day.published && day.href ? (
                        <Link href={day.href} className="block hover:text-gold-bright">
                          {inner}
                        </Link>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
