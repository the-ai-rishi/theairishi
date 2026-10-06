import Link from "next/link";
import { getAllGuideSummaries } from "@/lib/guides";
import { getAllProjectSummaries } from "@/lib/projects";
import { getProgramModel } from "@/lib/program-model";
import { getLearnerCatalog } from "@/lib/programs";

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
  const model = getProgramModel(catalog.programId);
  const fact = model.journey.days.find((item) => item.day === day);
  const phase = catalog.phases.find((item) => item.id === (phaseId || fact?.phaseId));
  const siblings = catalog.days.filter(
    (item) => item.phaseId === phase?.id && item.slug !== slug && item.published && item.href,
  );
  const planned = catalog.days.filter((item) => item.phaseId === phase?.id && !item.published).length;
  const projects = getAllProjectSummaries().filter((project) => fact?.relatedProjects.includes(project.slug));
  const guides = getAllGuideSummaries().filter((guide) => fact?.relatedGuides.includes(guide.slug));
  const related = (fact?.relatedDays || [])
    .map((number) => catalog.days.find((item) => item.day === number))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!phase && !fact && projects.length === 0) return null;

  return (
    <section aria-label="Where this day sits" className="lesson-trail">
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
      {related.length > 0 ? (
        <ul className="mt-4 flex flex-col">
          {related.map((item) => (
            <li key={item.slug} className="text-[14px] leading-relaxed text-cream/70">
              Related day:{" "}
              {item.href ? (
                <Link href={item.href} className="text-cream underline decoration-gold/50 underline-offset-4">
                  Day {item.day}, {item.title}
                </Link>
              ) : (
                <span>
                  Day {item.day}, {item.title}
                </span>
              )}
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
      {projects.map((project) => (
        <p key={project.slug} className="mt-5 text-[15px] leading-relaxed text-cream/70">
          <Link href={`/projects/${project.slug}`} className="text-cream underline decoration-gold/50 underline-offset-4">
            {project.metadata.title}
          </Link>
          <span className="mt-1 block text-cream/50">{project.metadata.description}</span>
        </p>
      ))}
      {guides.length > 0 ? (
        <div className="mt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40">Related writing</p>
          <ul className="mt-2">
            {guides.map((guide) => (
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
