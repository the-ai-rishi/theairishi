import { formatDayLabel, formatPhaseLabel } from "@/lib/labels";

interface LessonHeaderProps {
  courseTitle?: string;
  stageNumber: number;
  stage: string;
  title: string;
  description: string;
  lessonNumber: number;
  totalLessons: number;
  readingTime?: number;
  day?: number;
  phaseNumber?: number;
  outcomes?: string[];
  estimatedMinutes?: number;
  startHref?: string | null;
  practiceHref?: string | null;
  programTotal?: number;
}

export default function LessonHeader({
  stage,
  title,
  description,
  day,
  phaseNumber,
  outcomes = [],
  estimatedMinutes,
  startHref,
  practiceHref,
  programTotal = 120,
}: LessonHeaderProps) {
  const cleanTitle = title.replace(/^Day\s+\d+\s+[—–-]\s+/i, "");
  const phaseLabel = phaseNumber
    ? `${formatPhaseLabel(phaseNumber).replace(/Phase (\d+)/, (_, n) => `Phase ${String(n).padStart(2, "0")}`)} · ${stage}`
    : stage;

  return (
    <section className="panel p-5 sm:p-7">
      <p className="kicker text-gold/85">{day ? `Day ${String(day).padStart(2, "0")}` : stage}</p>
      <h1 className="mt-3 font-serif text-[1.85rem] tracking-[0.01em] text-cream sm:text-5xl">{cleanTitle}</h1>
      <p className="stat-line mt-3">
        <span>{phaseLabel}</span>
        {day ? <span>{formatDayLabel(day)} of {programTotal}</span> : null}
        {estimatedMinutes ? <span>~{estimatedMinutes} min</span> : null}
      </p>

      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/55 sm:text-base">{description}</p>

      {outcomes.length > 0 ? (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
            After this day you can
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3 text-[14px] leading-relaxed text-cream/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {startHref ? (
          <a href={startHref} className="btn-primary btn-block">
            {day ? `Start ${formatDayLabel(day)}` : "Start"}
          </a>
        ) : null}
        {practiceHref ? (
          <a href={practiceHref} className="btn-ghost btn-block">
            Jump to practice
          </a>
        ) : null}
      </div>
    </section>
  );
}
