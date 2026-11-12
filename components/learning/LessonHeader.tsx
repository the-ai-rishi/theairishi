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
  const cleanTitle = title.replace(/^Day\s+\d+\s+[-–-]\s+/i, "");
  const phaseLabel = phaseNumber
    ? `${formatPhaseLabel(phaseNumber).replace(/Phase (\d+)/, (_, n) => `Phase ${String(n).padStart(2, "0")}`)} · ${stage}`
    : stage;

  return (
    <section className="lesson-mast">
      {day ? <p className="lesson-day">{String(day).padStart(2, "0")}</p> : null}
      <div>
        <p className="kicker">{phaseLabel}</p>
        <h1>{cleanTitle}</h1>
        <p className="stat-line">
          {day ? (
            <span>
              {formatDayLabel(day)} of {programTotal}
            </span>
          ) : (
            <span>{stage}</span>
          )}
          {estimatedMinutes ? <span>~{estimatedMinutes} min</span> : null}
        </p>

        {outcomes.length > 0 ? (
          <ul>
            {outcomes.slice(0, 3).map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        ) : (
          <p className="lesson-lead">{description}</p>
        )}

        <div className="lesson-actions">
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
      </div>
    </section>
  );
}
