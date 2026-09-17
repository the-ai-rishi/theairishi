import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getHydratedPhases } from "@/lib/programs";

export default function JourneyStrip({ section }: { section: ResolvedHomepageSection }) {
  const phases = getHydratedPhases();
  if (!phases.length) return null;

  return (
    <section className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Eleven phases"}
          title={section.title || "What you will work through"}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref || "/learn"}
        />
        <ol className="mt-8 divide-y divide-hairline border-y border-hairline">
          {phases.map((phase) => (
            <li
              key={phase.id}
              className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3 sm:grid-cols-[3rem_8rem_1fr_auto] sm:gap-6 sm:py-3.5"
            >
              <span className="font-mono text-[12px] text-gold/80">
                {String(phase.number).padStart(2, "0")}
              </span>
              <span className="hidden font-mono text-[11px] tracking-[0.12em] text-cream/35 sm:block">
                {phase.daysLabel}
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-lg text-cream sm:text-xl">{phase.name}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-cream/35 sm:hidden">
                  Days {phase.daysLabel}
                </span>
              </span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-cream/40">
                {phase.current ? "now" : phase.publishedCount > 0 ? `${phase.publishedCount} ready` : ""}
              </span>
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
