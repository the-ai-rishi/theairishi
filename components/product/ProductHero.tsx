import { getBrandConfig } from "@/lib/config";
import type { LearnerCatalog } from "@/lib/continue-learning";

export default function ProductHero({ catalog }: { catalog: LearnerCatalog }) {
  const brand = getBrandConfig();
  const words = catalog.title.split(/\s+/).filter(Boolean);

  return (
    <div className="system-overlay">
      <p className="system-kicker">{brand.tagline || "Ancient wisdom · modern intelligence"}</p>
      <h1 className="system-title">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="system-word">
            {word}
          </span>
        ))}
      </h1>
      <p className="system-meta">
        <span>{catalog.durationLabel}</span>
        <span>{catalog.phases.length} phases</span>
        <span>{catalog.totalDays} days</span>
      </p>
      <a className="system-enter" href="#path" data-magnetic="" data-cursor="cta">
        Enter the path
      </a>
    </div>
  );
}
