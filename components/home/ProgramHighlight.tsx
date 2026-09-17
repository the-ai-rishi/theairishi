import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getHydratedPhases, getProgram, getPublishedProgramDays } from "@/lib/programs";

export default function ProgramHighlight({ section }: { section: ResolvedHomepageSection }) {
  const program = getProgram();
  if (!program.enabled) return null;
  const phases = getHydratedPhases();
  const current = phases.find((phase) => phase.current) || phases[0];
  const published = getPublishedProgramDays();
  const first = published[0];

  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "The current program"}
          title={section.title || program.title}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref || "/learn"}
        />
        <div className="mt-10 grid gap-10 border-t border-hairline pt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-gold/80">
              {program.durationLabel}
            </p>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream/60">
              {program.description}
            </p>
            <p className="mt-5 max-w-2xl font-mono text-[13px] leading-relaxed text-cream/40">
              {program.capstone}
            </p>
          </div>
          <div className="flex flex-col justify-end gap-5 lg:col-span-5">
            {current ? (
              <p className="font-mono text-[13px] text-cream/45">
                Current phase · {current.name} · Days {current.daysLabel}
                {current.publishedCount > 0
                  ? ` · ${current.publishedCount} day${current.publishedCount === 1 ? "" : "s"} live`
                  : ""}
              </p>
            ) : null}
            {first ? (
              <Link href={first.href || program.startHref} className="btn-primary self-start">
                Start {first.title}
              </Link>
            ) : (
              <a href={program.repoUrl} target="_blank" rel="noreferrer" className="btn-primary self-start">
                Open the repo
              </a>
            )}
            <a
              href={program.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="link-editorial font-mono text-[13px] tracking-[0.12em] text-cream/50 hover:text-gold"
            >
              Source of truth on GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
