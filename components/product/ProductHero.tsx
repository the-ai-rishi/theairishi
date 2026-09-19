import SmartCta from "@/components/learning/SmartCta";
import CurrentWorkCard from "@/components/product/CurrentWorkCard";
import { getPlatformCopy } from "@/lib/config";
import type { LearnerCatalog } from "@/lib/continue-learning";

export default function ProductHero({
  catalog,
  outcomes,
  estimatedMinutes,
}: {
  catalog: LearnerCatalog;
  outcomes?: string[];
  estimatedMinutes?: number;
}) {
  const copy = getPlatformCopy();
  const published = catalog.days.filter((day) => day.published).length;
  const planned = Math.max(0, catalog.totalDays - published);

  return (
    <section className="product-stage relative overflow-hidden pt-6 pb-6 sm:pt-10 sm:pb-9 lg:pt-12 lg:pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)] lg:gap-10">
          <div className="min-w-0">
            <p className="kicker text-gold/85">{copy.heroBadge || "Current program"}</p>
            <h1 className="display mt-3 text-[2.05rem] sm:text-5xl lg:text-[4.15rem]">
              {catalog.title}
            </h1>
            <p className="stat-line mt-4">
              <span>{catalog.durationLabel}</span>
              <span>{catalog.phases.length} phases</span>
              <span>{published} available</span>
              <span>{planned} planned</span>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center">
              <SmartCta
                catalog={catalog}
                fallbackLabel={copy.heroPrimaryCta || "Start Day 1"}
                fallbackHref={copy.heroPrimaryCtaHref || catalog.startHref}
                className="btn-primary btn-block"
              />
              <a href="#path" className="btn-ghost btn-block">
                See the map
              </a>
            </div>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/60 sm:text-[16px]">
              {copy.heroDescription || catalog.description}
            </p>
          </div>
          <CurrentWorkCard
            catalog={catalog}
            outcomes={outcomes}
            estimatedMinutes={estimatedMinutes}
            size="hero"
          />
        </div>
      </div>
    </section>
  );
}
