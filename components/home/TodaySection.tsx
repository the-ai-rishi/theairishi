import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getPublishedProgramDays } from "@/lib/programs";
import { formatDayLabel } from "@/lib/labels";

export default function TodaySection({ section }: { section: ResolvedHomepageSection }) {
  const published = getPublishedProgramDays();
  if (!published.length) return null;

  return (
    <section className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Available days"}
          title={section.title || "Ready to start"}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref || "/learn"}
        />
        <ol className="mt-8 divide-y divide-hairline border-y border-hairline">
          {published.map((day) => (
            <li key={day.slug}>
              <Link
                href={day.href || `/learn/${day.slug}`}
                className="group grid gap-1 py-4 sm:grid-cols-[5.5rem_1fr_auto] sm:items-baseline sm:gap-6 sm:py-5"
              >
                <span className="font-mono text-[13px] text-gold/80">{formatDayLabel(day.day)}</span>
                <span>
                  <span className="font-serif text-xl text-cream group-hover:text-gold-bright sm:text-2xl">
                    {day.title}
                  </span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-cream/45 sm:text-[15px]">
                    {day.summary}
                  </span>
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/70">
                  Available
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
