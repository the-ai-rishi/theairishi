import Link from "next/link";
import ResumeLearningBanner from "@/components/learning/ResumeLearningBanner";
import ProgramPhaseMap from "@/components/learning/ProgramPhaseMap";
import { getAllLessonSummaries } from "@/lib/lessons";
import {
  getHydratedPhases,
  getPublishedProgramDays,
  getStartDay,
  type ProgramConfig,
} from "@/lib/programs";
import { formatDayLabel } from "@/lib/labels";

export default function ProgramOverview({ program }: { program: ProgramConfig }) {
  const phases = getHydratedPhases(program.id);
  const published = getPublishedProgramDays(program.id);
  const start = getStartDay(program.id);
  const allLessons = getAllLessonSummaries();
  const mapTitle = program.mapTitle || `${program.phases.length} phases`;

  return (
    <>
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
        {program.capstone ? (
          <p className="mt-4 max-w-2xl font-mono text-[13px] leading-relaxed text-cream/40">
            {program.capstone}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {start?.href ? (
            <Link href={start.href} className="btn-primary">
              Start {formatDayLabel(start.day)}
            </Link>
          ) : null}
          {program.repoUrl ? (
            <a
              href={program.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="link-editorial font-mono text-[14px] tracking-[0.12em] text-cream/60 hover:text-gold"
            >
              GitHub source of truth →
            </a>
          ) : null}
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
        <h2 className="mt-3 font-serif text-4xl text-cream">{mapTitle}</h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/50">
          Titles below come from the locked execution plan. A day becomes a page on this
          site only when its lesson file is published. Planned days are titles, not empty
          articles.
        </p>
        <div className="mt-10">
          <ProgramPhaseMap phases={phases} />
        </div>
      </section>
    </>
  );
}
