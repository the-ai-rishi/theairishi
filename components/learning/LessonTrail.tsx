import Link from "next/link";
import curriculum from "@/data/curriculum/forge-120.json";
import { getAllGuideSummaries } from "@/lib/guides";
import { getAllProjectSummaries } from "@/lib/projects";
import { getLearnerCatalog } from "@/lib/programs";

const STOP = new Set([
  "this",
  "that",
  "with",
  "from",
  "into",
  "your",
  "about",
  "than",
  "then",
  "only",
  "using",
  "used",
  "each",
  "what",
  "when",
  "where",
  "which",
  "their",
  "there",
  "have",
  "does",
  "day",
  "days",
  "phase",
]);

function words(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !STOP.has(word));
}

export default function LessonTrail({
  slug,
  day,
  phaseId,
}: {
  slug: string;
  day?: number;
  phaseId?: string;
}) {
  const catalog = getLearnerCatalog();
  const fact = curriculum.days.find((item) => item.day === day);
  const phase = catalog.phases.find((item) => item.id === (phaseId || fact?.phaseId));
  const siblings = catalog.days.filter(
    (item) => item.phaseId === phase?.id && item.slug !== slug && item.published && item.href,
  );
  const planned = catalog.days.filter((item) => item.phaseId === phase?.id && !item.published).length;
  const conceptWords = new Set((fact?.concepts || []).flatMap((concept) => words(concept)));
  const guides = getAllGuideSummaries()
    .map((guide) => {
      const hay = words(
        [guide.metadata.title, guide.metadata.description, ...(guide.metadata.tags || [])].join(" "),
      );
      const score = hay.filter((word) => conceptWords.has(word)).length;
      return { guide, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  const lab = day ? getAllProjectSummaries().find((project) => project.slug === "forge-api") : null;

  if (!phase && !fact && !lab) return null;

  return (
    <section aria-label="Where this day sits" className="border-t border-hairline pt-6">
      <p className="kicker text-gold/80">From here</p>
      {phase ? (
        <p className="mt-3 text-[15px] leading-relaxed text-cream/70">
          <Link href={`/learn#${phase.id}`} className="text-cream underline decoration-gold/50 underline-offset-4">
            {phase.name}
          </Link>
          <span className="text-cream/45"> · days {phase.daysLabel}</span>
          {planned > 0 ? <span className="text-cream/45"> · {planned} still planned</span> : null}
        </p>
      ) : null}
      {siblings.length > 0 ? (
        <ul className="mt-4 flex flex-col">
          {siblings.slice(0, 6).map((item) => (
            <li key={item.slug} className="border-b border-hairline">
              <Link
                href={item.href || `/learn/${item.slug}`}
                className="flex min-h-11 items-baseline gap-3 py-2 text-[15px] text-cream/80 hover:text-cream"
              >
                <span className="font-mono text-[11px] text-gold/80">{String(item.day).padStart(2, "0")}</span>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {fact && fact.concepts.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {fact.concepts.map((concept) => (
            <li key={concept} className="text-[14px] leading-relaxed text-cream/60">
              {concept}
            </li>
          ))}
        </ul>
      ) : null}
      {lab ? (
        <p className="mt-5 text-[15px] leading-relaxed text-cream/70">
          <Link href={`/projects/${lab.slug}`} className="text-cream underline decoration-gold/50 underline-offset-4">
            {lab.metadata.title}
          </Link>
          <span className="mt-1 block text-cream/50">{lab.metadata.description}</span>
        </p>
      ) : null}
      {guides.length > 0 ? (
        <div className="mt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40">
            Earlier writing that shares a term. Not this day.
          </p>
          <ul className="mt-2">
            {guides.map(({ guide }) => (
              <li key={guide.slug} className="border-b border-hairline">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="flex min-h-11 items-center py-2 text-[15px] text-cream/80 hover:text-cream"
                >
                  {guide.metadata.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
