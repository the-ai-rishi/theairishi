import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getHydratedPhases } from "@/lib/programs";

export default function JourneyStrip({ section }: { section: ResolvedHomepageSection }) {
  const phases = getHydratedPhases();
  if (!phases.length) return null;

  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Eleven phases"}
          title={section.title || "120 days"}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref || "/learn"}
        />
        <ol className="mt-10 divide-y divide-hairline border-y border-hairline">
          {phases.map((phase) => (
            <li key={phase.id} className="grid gap-2 py-5 sm:grid-cols-[4.5rem_8rem_1fr_auto] sm:items-baseline sm:gap-6">
              <span className="font-mono text-[13px] text-gold/80">
                {String(phase.number).padStart(2, "0")}
              </span>
              <span className="font-mono text-[12px] tracking-[0.14em] text-cream/40">
                Days {phase.daysLabel}
              </span>
              <div>
                <p className="font-serif text-2xl text-cream">{phase.name}</p>
                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-cream/45">
                  {phase.summary}
                </p>
              </div>
              <span className="font-mono text-[12px] text-cream/35">
                {phase.current
                  ? phase.publishedCount > 0
                    ? `${phase.publishedCount} live`
                    : "current"
                  : phase.publishedCount > 0
                    ? `${phase.publishedCount} live`
                    : "later"}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link
            href={section.ctaHref || "/learn"}
            className="link-editorial font-mono text-[14px] tracking-[0.12em] text-gold hover:text-gold-bright"
          >
            Open the full journey →
          </Link>
        </div>
      </div>
    </section>
  );
}
