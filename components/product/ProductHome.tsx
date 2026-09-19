import ProductHero from "@/components/product/ProductHero";
import JourneyMap from "@/components/product/JourneyMap";
import WhySection from "@/components/home/WhySection";
import MethodSection from "@/components/home/MethodSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import CallToAction from "@/components/home/CallToAction";
import { getLearnerCatalog } from "@/lib/programs";
import { getAllLessonSummaries } from "@/lib/lessons";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import type { SocialPlatform } from "@/lib/config";
import { getPlatformStory } from "@/lib/config";

export default function ProductHome({ sections }: { sections: ResolvedHomepageSection[] }) {
  const catalog = getLearnerCatalog();
  const firstDay = getAllLessonSummaries().find(
    (lesson) => lesson.slug === catalog.days.find((d) => d.published)?.slug
  );
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
      <ProductHero
        catalog={catalog}
        outcomes={firstDay?.metadata.outcomes}
        estimatedMinutes={firstDay?.metadata.estimatedMinutes}
      />

      <section id="path" className="scroll-mt-24 py-7 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="kicker text-gold/80">Your path</p>
          <h2 className="mt-3 font-serif text-[1.85rem] text-cream sm:text-4xl">
            {catalog.totalDays} days, {catalog.phases.length} phases
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
            Gold is complete. The cream square is where you are. Outlined gold is a published page.
            Quiet squares are planned titles — not empty articles.
          </p>
          <div className="panel mt-6 p-4 sm:mt-8 sm:p-7">
            <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
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

      {method ? <MethodSection section={method} /> : null}
      {why ? <WhySection section={why} /> : null}

      {path || community ? (
        <section className="py-7 sm:py-9">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="panel grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
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
      ) : null}

      {dest ? (
        <DestinationsSection
          section={dest}
          destinations={(dest.data.destinations as SocialPlatform[]) || []}
        />
      ) : null}
      {cta ? <CallToAction section={cta} /> : null}
    </>
  );
}
