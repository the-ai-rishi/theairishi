import Link from "next/link";
import brandLanguage from "@/content/config/brand-language.json";
import { getPlatformCopy } from "@/lib/config";
import type { LearnerCatalog } from "@/lib/continue-learning";

export default function ProductHero({ catalog }: { catalog: LearnerCatalog }) {
  const copy = getPlatformCopy();
  const primaryHref = copy.heroPrimaryCtaHref || brandLanguage.ctas.primaryHref;
  const secondaryHref = copy.heroSecondaryCtaHref || brandLanguage.ctas.secondaryHref;

  return (
    <div className="system-overlay">
      <p className="system-brand">{brandLanguage.displayName}</p>
      <p className="system-kicker">{brandLanguage.tagline}</p>
      <h1 className="system-title">{catalog.title}</h1>
      <p className="system-dek">{copy.heroDescription || catalog.description}</p>
      <p className="system-meta">
        <span>{catalog.durationLabel}</span>
        <span>{catalog.phases.length} phases</span>
        <span>{catalog.totalDays} days</span>
      </p>
      <p className="system-actions">
        <Link className="system-enter" href={primaryHref} data-magnetic="" data-cursor="cta">
          {copy.heroPrimaryCta || brandLanguage.ctas.primary}
        </Link>
        <Link className="system-enter system-enter-quiet" href={secondaryHref}>
          {copy.heroSecondaryCta || brandLanguage.ctas.secondary}
        </Link>
      </p>
    </div>
  );
}
