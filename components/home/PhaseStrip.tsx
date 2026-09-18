import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getHydratedPhases } from "@/lib/programs";

export default function PhaseStrip({ section }: { section: ResolvedHomepageSection }) {
  const phases = getHydratedPhases();
  if (!phases.length) return null;

  return (
    <section className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Eleven phases · 120 days"}
          title={section.title || "What you will work through"}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref || "/learn"}
        />
        <ol className="mt-8 grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase) => (
            <li key={phase.id} className="bg-ink">
              <Link
                href={`/learn#${phase.id}`}
                className="block min-h-[5.5rem] px-4 py-4 hover:bg-cream/[0.03] focus-visible:bg-cream/[0.03]"
              >
                <span className="flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] tracking-[0.12em] text-gold/80">
                  <span>{phase.number}</span>
                  <span className="text-cream/35">Days {phase.daysLabel}</span>
                  {phase.current ? <span>now</span> : null}
                  {phase.publishedCount > 0 ? (
                    <span className="text-cream/45">{phase.publishedCount} available</span>
                  ) : (
                    <span className="text-cream/30">planned</span>
                  )}
                </span>
                <span className="mt-1.5 block font-serif text-xl text-cream">{phase.name}</span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <Link
            href={section.ctaHref || "/learn"}
            className="link-editorial font-mono text-[14px] tracking-[0.12em] text-gold hover:text-gold-bright"
          >
            {section.ctaLabel || "Open the full plan"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
