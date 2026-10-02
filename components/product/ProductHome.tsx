import ProductHero from "@/components/product/ProductHero";
import CurrentWorkCard from "@/components/product/CurrentWorkCard";
import JourneyMap from "@/components/product/JourneyMap";
import WhySection from "@/components/home/WhySection";
import MethodSection from "@/components/home/MethodSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import CallToAction from "@/components/home/CallToAction";
import TodaySection from "@/components/home/TodaySection";
import ContentList from "@/components/home/ContentList";
import CourseListSection from "@/components/home/CourseListSection";
import TopicGrid from "@/components/home/TopicGrid";
import ChannelGrid from "@/components/home/ChannelGrid";
import UniverseStage from "@/components/immersive/UniverseStage";
import SystemDesk from "@/components/immersive/SystemDesk";
import ProgressSignal from "@/components/immersive/ProgressSignal";
import CurriculumControl from "@/components/product/CurriculumControl";
import curriculum from "@/data/curriculum/forge-120.json";
import { getLearnerCatalog } from "@/lib/programs";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import type { SocialPlatform, TopicConfig } from "@/lib/config";
import type { Course } from "@/lib/lessons";
import type { UniversalContentItem } from "@/lib/content";
import { getPlatformStory } from "@/lib/config";

function Instrument() {
  return (
    <CurriculumControl
      reliabilityName={curriculum.phases[7]?.name || "Reliability"}
      reliabilitySummary={curriculum.phases[7]?.summary || ""}
      controlName={curriculum.phases[8]?.name || "RAG and controlled tool use"}
      controlSummary={curriculum.phases[8]?.summary || ""}
      days={curriculum.days
        .filter((day) => day.day >= 89 && day.day <= 105)
        .map((day) => ({ day: day.day, title: day.title, goal: day.goal }))}
      gates={curriculum.gates}
      touchpoints={curriculum.touchpoints}
    />
  );
}

export default function ProductHome({ sections }: { sections: ResolvedHomepageSection[] }) {
  const catalog = getLearnerCatalog();
  const story = getPlatformStory();

  function renderSection(section: ResolvedHomepageSection) {
    switch (section.type) {
      case "hero":
        return (
          <UniverseStage key={section.id}>
            <SystemDesk catalog={catalog}>
              <ProgressSignal total={catalog.totalDays} />
            </SystemDesk>
            <ProductHero catalog={catalog} />
          </UniverseStage>
        );
      case "continue-learning":
        return (
          <section key={section.id} className="world-lock" aria-label="Current day">
            <CurrentWorkCard catalog={catalog} />
          </section>
        );
      case "program":
        return (
          <section key={section.id} className="world-lock world-lock-copy" aria-labelledby="program-title">
            <p className="kicker text-gold/80">{section.subtitle || "The current program"}</p>
            <h2 id="program-title" className="mt-3 font-serif text-[1.75rem] leading-tight text-cream sm:text-4xl">
              {section.title || catalog.title}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-cream/70">{catalog.outcome}</p>
            {catalog.capstone ? (
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-cream/55">Capstone: {catalog.capstone}</p>
            ) : null}
          </section>
        );
      case "phases":
        return (
          <section key={section.id} id="path" className="journey-chapter constellation-world relative scroll-mt-24">
            <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
              <p className="kicker text-gold/80">{section.subtitle || catalog.title}</p>
              <h2 className="mt-3 font-serif text-[1.75rem] text-cream sm:text-4xl">
                {section.title || `${catalog.phases.length} phases · ${catalog.totalDays} days`}
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
                You are in one phase at a time. Gold is complete. Outlined gold is a published day. Quiet marks are
                planned titles, not empty pages.
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
        );
      case "instrument":
        return <Instrument key={section.id} />;
      case "why":
        return <WhySection key={section.id} section={section} />;
      case "method":
        return <MethodSection key={section.id} section={section} />;
      case "today":
        return <TodaySection key={section.id} section={section} />;
      case "path":
        return (
          <section key={section.id} className="py-7 sm:py-9">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <p className="kicker text-gold/80">{section.subtitle || "Later"}</p>
              <h2 className="mt-3 font-serif text-2xl text-cream">{section.title || story.pathTitle}</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">{section.body || story.pathBody}</p>
            </div>
          </section>
        );
      case "prose":
        return (
          <section key={section.id} className="py-7 sm:py-9">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <p className="kicker text-gold/80">{section.subtitle || "Practise"}</p>
              <h2 className="mt-3 font-serif text-2xl text-cream">{section.title || story.communityTitle}</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
                {section.body || story.communityBody}
              </p>
            </div>
          </section>
        );
      case "destinations":
        return (
          <DestinationsSection
            key={section.id}
            section={section}
            destinations={(section.data.destinations as SocialPlatform[]) || []}
          />
        );
      case "cta":
        return <CallToAction key={section.id} section={section} />;
      case "topic-grid":
        return <TopicGrid key={section.id} section={section} topics={(section.data.topics as TopicConfig[]) || []} />;
      case "course-list":
        return (
          <CourseListSection key={section.id} section={section} courses={(section.data.courses as Course[]) || []} />
        );
      case "content-list":
        return (
          <ContentList key={section.id} section={section} items={(section.data.items as UniversalContentItem[]) || []} />
        );
      case "channel-grid":
        return (
          <ChannelGrid key={section.id} section={section} channels={(section.data.channels as SocialPlatform[]) || []} />
        );
      default:
        return null;
    }
  }

  return <>{sections.map((section) => renderSection(section))}</>;
}
