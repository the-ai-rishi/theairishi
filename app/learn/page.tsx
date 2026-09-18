import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import ResumeLearningBanner from "@/components/learning/ResumeLearningBanner";
import ProgramPhaseMap from "@/components/learning/ProgramPhaseMap";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
  isContentTypeRoutable,
} from "@/lib/config";
import { getAllLessonSummaries } from "@/lib/lessons";
import { getHydratedPhases, getProgram, getPublishedProgramDays, getStartDay } from "@/lib/programs";
import { formatDayLabel } from "@/lib/labels";
import { canonicalAlternates } from "@/lib/urls";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const program = getProgram();
  return {
    title: program.title,
    description: program.description,
    alternates: canonicalAlternates("/learn"),
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
        {program.outcome ? (
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/45">{program.outcome}</p>
        ) : null}
        <p className="mt-4 max-w-2xl font-mono text-[13px] leading-relaxed text-cream/40">
          {program.capstone}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {start?.href ? (
            <Link href={start.href} className="btn-primary">
              Start {formatDayLabel(start.day)}
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
        <h2 className="mt-3 font-serif text-4xl text-cream">Available days</h2>
        {published.length === 0 ? (
          <p className="mt-6 text-cream/45">No daily lessons are published on this site yet.</p>
        ) : (
          <ol className="mt-8 divide-y divide-hairline border-y border-hairline">
            {published.map((day) => (
              <li key={day.slug}>
                <Link
                  href={day.href || `/learn/${day.slug}`}
                  className="group grid gap-2 py-5 sm:grid-cols-[5.5rem_1fr] sm:items-baseline"
                >
                  <span className="font-mono text-[13px] text-gold/80">{formatDayLabel(day.day)}</span>
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
          page on this site only when its lesson file is published. Planned days
          are titles, not empty articles.
        </p>
        <div className="mt-10">
          <ProgramPhaseMap phases={phases} />
        </div>
      </section>
    </PageShell>
  );
}
