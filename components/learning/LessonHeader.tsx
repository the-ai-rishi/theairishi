import Link from "next/link";
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
  const dayLabel = day ? formatDayLabel(day) : null;
  const phaseLabel = phaseNumber
    ? `${formatPhaseLabel(phaseNumber).replace(/Phase (\d+)/, (_, n) => `Phase ${String(n).padStart(2, "0")}`)} · ${stage}`
    : stage;
  const timeLabel = estimatedMinutes
    ? `About ${estimatedMinutes} minutes`
    : null;

  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-cream/40">
        <Link href="/learn" className="transition hover:text-cream hover:underline underline-offset-4">
          120 Days
        </Link>
        <span aria-hidden="true" className="text-cream/25">
          /
        </span>
        <span className="text-cream/80 font-medium">
          {dayLabel ? `${dayLabel} · ${stage}` : stage}
        </span>
      </nav>

      {dayLabel ? (
        <p className="mt-8 kicker text-gold/85">
          {dayLabel.startsWith("Day ") ? `Day ${String(day).padStart(2, "0")}` : dayLabel}
        </p>
      ) : (
        <p className="mt-8 kicker text-gold/85">{stage}</p>
      )}

      <h1 className="mt-4 font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl lg:text-6xl">
        {title.replace(/^Day\s+\d+\s+[—–-]\s+/i, "")}
      </h1>

      <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-gold/70">{phaseLabel}</p>

      <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-cream/55">{description}</p>

      {outcomes.length > 0 ? (
        <div className="mt-8 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
            You should be able to
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

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] text-cream/45">
        {timeLabel ? <span>{timeLabel}</span> : null}
        {day ? (
          <span>
            {formatDayLabel(day)} of {programTotal}
          </span>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        {startHref ? (
          <a href={startHref} className="btn-primary">
            {day ? `Start ${formatDayLabel(day)}` : "Start"}
          </a>
        ) : null}
        {practiceHref ? (
          <a
            href={practiceHref}
            className="link-editorial min-h-11 inline-flex items-center font-mono text-[13px] tracking-[0.12em] text-cream/65 hover:text-gold"
          >
            Already know this? Jump to practice
          </a>
        ) : null}
      </div>
    </section>
  );
}
