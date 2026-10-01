import CurrentWorkCard from "@/components/product/CurrentWorkCard";
import { getBrandConfig, getPlatformCopy } from "@/lib/config";
import type { LearnerCatalog } from "@/lib/continue-learning";

export default function ProductHero({ catalog }: { catalog: LearnerCatalog }) {
  const copy = getPlatformCopy();
  const brand = getBrandConfig();
  const published = catalog.days.filter((day) => day.published).length;
  const planned = Math.max(0, catalog.totalDays - published);

  return (
    <div className="universe-copy">
      <div className="universe-copy-inner">
        <p className="universe-brand universe-in">{brand.name}</p>
        <p className="kicker universe-in mt-3 text-gold/85">{copy.heroBadge || "Current program"}</p>
        <h1 className="universe-title universe-in">{catalog.title}</h1>
        <p className="stat-line universe-in mt-4">
          <span>{catalog.durationLabel}</span>
          <span>{catalog.phases.length} phases</span>
          <span>{published} available</span>
          <span>{planned} planned</span>
        </p>
        <p className="universe-lead universe-in">{copy.heroDescription || catalog.description}</p>
      </div>
      <div className="universe-dock universe-in">
        <CurrentWorkCard catalog={catalog} size="hero" />
      </div>
    </div>
  );
}
