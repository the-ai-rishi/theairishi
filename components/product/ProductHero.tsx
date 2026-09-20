import CurrentWorkCard from "@/components/product/CurrentWorkCard";
import { getPlatformCopy } from "@/lib/config";
import type { LearnerCatalog } from "@/lib/continue-learning";

export default function ProductHero({ catalog }: { catalog: LearnerCatalog }) {
  const copy = getPlatformCopy();
  const published = catalog.days.filter((day) => day.published).length;
  const planned = Math.max(0, catalog.totalDays - published);

  return (
    <section className="product-stage relative overflow-hidden pt-6 pb-8 sm:pt-9 sm:pb-10 lg:pt-11 lg:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="kicker text-gold/85">{copy.heroBadge || "Current program"}</p>
        <h1 className="mt-3 font-serif text-[1.85rem] leading-[0.95] tracking-[0.01em] text-cream sm:text-5xl lg:text-[3.35rem]">
          {catalog.title}
        </h1>
        <p className="stat-line mt-4">
          <span>{catalog.durationLabel}</span>
          <span>{catalog.phases.length} phases</span>
          <span>{published} available</span>
          <span>{planned} planned</span>
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/58 sm:text-[16px]">
          {copy.heroDescription || catalog.description}
        </p>

        <div className="mt-7 sm:mt-8">
          <CurrentWorkCard catalog={catalog} size="hero" />
        </div>
      </div>
    </section>
  );
}
