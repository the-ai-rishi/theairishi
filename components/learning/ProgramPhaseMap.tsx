import Link from "next/link";
import type { HydratedPhase } from "@/lib/programs";
import { formatDayLabel, formatPhaseLabel } from "@/lib/labels";

export default function ProgramPhaseMap({
  phases,
  completedSlugs = [],
}: {
  phases: HydratedPhase[];
  completedSlugs?: readonly string[];
}) {
  const published = phases.reduce((sum, phase) => sum + phase.publishedCount, 0);
  const total = phases.reduce((sum, phase) => sum + phase.days.length, 0);

  return (
    <div>
      <p className="font-mono text-[13px] text-cream/45">
        {published} of {total} days available as pages. The rest are planned titles.
      </p>
      <nav
        aria-label="Jump to phase"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {phases.map((phase) => (
          <a
            key={phase.id}
            href={`#${phase.id}`}
            className="shrink-0 border border-hairline px-3 py-2 font-mono text-[12px] tracking-[0.08em] text-cream/60 hover:border-gold/40 hover:text-gold"
          >
            <span className="sr-only">Jump to phase </span>
            {phase.number} {phase.name}
            {phase.current ? " · now" : ""}
          </a>
        ))}
      </nav>
      <div className="mt-10 space-y-4">
        {phases.map((phase) => (
          <details
            key={phase.id}
            id={phase.id}
            className="phase-block border-t border-hairline pt-6"
            open={phase.current}
          >
            <summary
              className="phase-summary cursor-pointer list-none sm:cursor-default"
              aria-label={`${formatPhaseLabel(phase.number)} ${phase.name}, days ${phase.daysLabel}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-gold/70">
                    {formatPhaseLabel(phase.number)} · Days {phase.daysLabel}
                    {phase.current ? " · current" : ""}
                    {phase.publishedCount > 0
                      ? ` · ${phase.publishedCount} available`
                      : " · planned"}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-cream">{phase.name}</h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/45">
                    {phase.summary}
                  </p>
                </div>
                <span className="phase-toggle mt-1 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-gold/80 sm:hidden">
                  <span className="phase-toggle-closed">Show days</span>
                  <span className="phase-toggle-open">Hide days</span>
                </span>
              </div>
            </summary>
            <ol className="phase-days mt-6 divide-y divide-hairline border-y border-hairline">
              {phase.days.map((day) => {
                const completed = completedSlugs.includes(day.slug);
                const state = day.published ? (
                  <span className="inline-flex border border-gold/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
                    {completed ? "Complete" : "Available"}
                  </span>
                ) : (
                  <span className="inline-flex border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                    Planned
                  </span>
                );
                const inner = (
                  <span className="grid gap-2 py-3 sm:grid-cols-[5.5rem_1fr_auto] sm:items-baseline">
                    <span className="font-mono text-[13px] text-cream/50">{formatDayLabel(day.day)}</span>
                    <span>
                      <span
                        className={`font-serif text-xl ${day.published ? "text-cream" : "text-cream/55"}`}
                      >
                        {day.title}
                      </span>
                      <span className="mt-1 block text-[14px] text-cream/40">{day.summary}</span>
                    </span>
                    <span>{state}</span>
                  </span>
                );
                return (
                  <li key={day.slug}>
                    {day.published && day.href ? (
                      <Link href={day.href} className="block hover:text-gold-bright">
                        {inner}
                      </Link>
                    ) : (
                      <div aria-disabled="true">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </details>
        ))}
      </div>
    </div>
  );
}
