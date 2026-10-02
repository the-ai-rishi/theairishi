import ProductHero from "@/components/product/ProductHero";
import JourneyMap from "@/components/product/JourneyMap";
import WhySection from "@/components/home/WhySection";
import MethodSection from "@/components/home/MethodSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import CallToAction from "@/components/home/CallToAction";
import UniverseStage from "@/components/immersive/UniverseStage";
import ProgressSignal from "@/components/immersive/ProgressSignal";
import SectionFrame from "@/components/motion/SectionFrame";
import { getLearnerCatalog } from "@/lib/programs";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import type { SocialPlatform } from "@/lib/config";
import { getPlatformStory } from "@/lib/config";

export default function ProductHome({ sections }: { sections: ResolvedHomepageSection[] }) {
  const catalog = getLearnerCatalog();
  const byType = new Map(sections.map((section) => [section.type, section]));
  const byId = new Map(sections.map((section) => [section.id, section]));
  const why = byType.get("why");
  const method = byType.get("method");
  const dest = byType.get("destinations");
  const cta = byType.get("cta");
  const path = byType.get("path");
  const community = byId.get("community");
  const story = getPlatformStory();

  return (
    <>
      <UniverseStage>
        <ProgressSignal total={catalog.totalDays} />
        <ProductHero catalog={catalog} />
      </UniverseStage>

      <section id="path" className="journey-chapter relative scroll-mt-24 py-10 sm:py-16">
          <span className="chapter-watermark" aria-hidden="true">
            02
          </span>
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="kicker text-gold/80">The spine</p>
            <h2 className="mt-3 font-serif text-[1.75rem] text-cream sm:text-4xl">
              {catalog.phases.length} phases · {catalog.totalDays} days
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
              You are in one phase at a time. Gold is complete. Outlined gold is a published day.
              Quiet marks are planned titles, not empty pages.
            </p>
            <div className="mt-7">
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                <span className="inline-flex items-center gap-2">
                  <span className="day-dot day-dot-done" /> Complete
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="day-dot day-dot-now" /> Now
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="day-dot day-dot-live" /> Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="day-dot day-dot-plan" /> Planned
                </span>
              </div>
              <JourneyMap catalog={catalog} compact />
            </div>
          </div>
        </section>

      <div className="geometry-rule" aria-hidden="true" />

      {method ? (
        <SectionFrame index="03">
          <MethodSection section={method} />
        </SectionFrame>
      ) : null}
      {why ? (
        <SectionFrame index="04">
          <WhySection section={why} />
        </SectionFrame>
      ) : null}

      {path || community ? (
        <SectionFrame index="05">
          <section className="py-7 sm:py-9">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 sm:grid-cols-2">
                {path ? (
                  <div>
                    <p className="kicker text-gold/80">{path.subtitle || "Later"}</p>
                    <h2 className="mt-3 font-serif text-2xl text-cream">{path.title || story.pathTitle}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-cream/50">{path.body || story.pathBody}</p>
                  </div>
                ) : null}
                {community ? (
                  <div>
                    <p className="kicker text-gold/80">{community.subtitle || "Practise"}</p>
                    <h2 className="mt-3 font-serif text-2xl text-cream">
                      {community.title || story.communityTitle}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-cream/50">
                      {community.body || story.communityBody}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </SectionFrame>
      ) : null}

      {dest ? (
        <SectionFrame index="06">
          <DestinationsSection
            section={dest}
            destinations={(dest.data.destinations as SocialPlatform[]) || []}
          />
        </SectionFrame>
      ) : null}
      {cta ? (
        <SectionFrame index="07">
          <CallToAction section={cta} />
        </SectionFrame>
      ) : null}
    </>
  );
}
