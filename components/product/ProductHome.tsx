import type { ReactNode } from "react";
import ForgeRail from "@/components/field/ForgeRail";
import { ControlPrimer, DayFlow, OrderStory, SkillsBand } from "@/components/home/ExperienceActs";
import Chapter from "@/components/home/Chapter";
import brandLanguage from "@/content/config/brand-language.json";
import CurrentWorkCard from "@/components/product/CurrentWorkCard";
import DestinationsSection from "@/components/home/DestinationsSection";
import CallToAction from "@/components/home/CallToAction";
import TodaySection from "@/components/home/TodaySection";
import ContentList from "@/components/home/ContentList";
import CourseListSection from "@/components/home/CourseListSection";
import TopicGrid from "@/components/home/TopicGrid";
import ChannelGrid from "@/components/home/ChannelGrid";
import { getLearnerCatalog } from "@/lib/programs";
import { getProgramModel } from "@/lib/program-model";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import type { SocialPlatform, TopicConfig } from "@/lib/config";
import type { Course } from "@/lib/lessons";
import type { UniversalContentItem } from "@/lib/content";
import { getPlatformStory } from "@/lib/config";

export default function ProductHome({ sections }: { sections: ResolvedHomepageSection[] }) {
  const catalog = getLearnerCatalog();
  const model = getProgramModel(catalog.programId);
  const story = getPlatformStory();
  const frames: Record<string, { kicker: string; surface: string; accent: string; layout: string }> = {
    hero: { kicker: "The journey", surface: "base", accent: "ochre", layout: "rail" },
    skills: { kicker: "The toolkit", surface: "raised", accent: "ochre", layout: "toolkit" },
    why: { kicker: "The sequence", surface: "inset", accent: "ink", layout: "sequence" },
    method: { kicker: "One day", surface: "base", accent: "ochre", layout: "flow" },
    instrument: { kicker: "The boundary", surface: "tinted", accent: "plum", layout: "flow" },
    path: { kicker: "After the programme", surface: "raised", accent: "teal", layout: "split" },
    cta: { kicker: "Begin", surface: "inset", accent: "ochre", layout: "split" },
    destinations: { kicker: "Elsewhere", surface: "base", accent: "ink", layout: "split" },
  };

  function chapter(section: ResolvedHomepageSection, index: number, children: ReactNode, title?: string) {
    const preset = frames[section.type] || { kicker: "", surface: "base", accent: "ink", layout: "prose" };
    return (
      <Chapter
        key={section.id}
        index={index}
        id={section.id}
        kicker={section.kicker || preset.kicker}
        title={title}
        surface={section.surface || preset.surface}
        accent={section.accent || preset.accent}
        layout={section.layout || preset.layout}
      >
        {children}
      </Chapter>
    );
  }

  function renderSection(section: ResolvedHomepageSection, index: number) {
    switch (section.type) {
      case "hero":
        return chapter(
          section,
          index,
          <ForgeRail
            catalog={catalog}
            primaryHref={brandLanguage.ctas.primaryHref}
            primaryLabel={brandLanguage.ctas.primary}
            secondaryHref={brandLanguage.ctas.secondaryHref}
            secondaryLabel={brandLanguage.ctas.secondary}
            hero={model.experience.hero}
            notes={model.experience.phases}
            facts={model.journey.days.map((day) => ({
              day: day.day,
              phaseId: day.phaseId,
              goal: day.goal,
              concepts: day.concepts,
            }))}
          />,
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
        return null;
      case "skills":
        return chapter(section, index, <SkillsBand experience={model.experience} />, section.title || "What you will practise");
      case "instrument":
        return chapter(section, index, <ControlPrimer experience={model.experience} />, section.title || "Where AI enters");
      case "why":
        return chapter(section, index, <OrderStory experience={model.experience} />, section.title || "Why this order");
      case "method":
        return chapter(section, index, <DayFlow experience={model.experience} />, section.title || "How one day works");
      case "today":
        return <TodaySection key={section.id} section={section} />;
      case "path":
        return chapter(
          section,
          index,
          <p className="chapter-copy">{section.body || story.pathBody}</p>,
          section.title || story.pathTitle,
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
        return chapter(
          section,
          index,
          <DestinationsSection section={section} destinations={(section.data.destinations as SocialPlatform[]) || []} />,
          section.title || "Around the work",
        );
      case "cta":
        return chapter(section, index, <CallToAction section={section} />, section.title || "Ready to start?");
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

  return <>{sections.map((section, index) => renderSection(section, index + 1))}</>;
}
