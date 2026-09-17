import type { ResolvedHomepageSection } from "@/lib/homepage";
import HeroSection, { type HeroMode } from "./HeroSection";
import TopicGrid from "./TopicGrid";
import CourseListSection from "./CourseListSection";
import ContentList from "./ContentList";
import ChannelGrid from "./ChannelGrid";
import ContinueLearning from "./ContinueLearning";
import CallToAction from "./CallToAction";
import ProseSection from "./ProseSection";
import ProgramHighlight from "./ProgramHighlight";
import JourneyStrip from "./JourneyStrip";
import MethodSection from "./MethodSection";
import PathAhead from "./PathAhead";
import type { Course } from "@/lib/lessons";
import type { TopicConfig, SocialPlatform } from "@/lib/config";
import type { UniversalContentItem } from "@/lib/content";

export default function SectionRenderer({
  section,
}: {
  section: ResolvedHomepageSection;
}) {
  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          topics={(section.data.topics as TopicConfig[]) || []}
          focusTopic={(section.data.focusTopic as TopicConfig | null) || null}
          tone={(section.data.tone as "focus" | "discovery") || "discovery"}
          modes={(section.data.modes as HeroMode[]) || []}
        />
      );
    case "topic-grid":
      return (
        <TopicGrid
          section={section}
          topics={(section.data.topics as TopicConfig[]) || []}
        />
      );
    case "course-list":
      return (
        <CourseListSection
          section={section}
          courses={(section.data.courses as Course[]) || []}
        />
      );
    case "content-list":
      return (
        <ContentList
          section={section}
          items={(section.data.items as UniversalContentItem[]) || []}
        />
      );
    case "channel-grid":
      return (
        <ChannelGrid
          section={section}
          channels={(section.data.channels as SocialPlatform[]) || []}
        />
      );
    case "continue-learning":
      return <ContinueLearning courses={(section.data.courses as Course[]) || []} />;
    case "cta":
      return <CallToAction section={section} />;
    case "prose":
      return <ProseSection section={section} />;
    case "program":
      return <ProgramHighlight section={section} />;
    case "journey":
      return <JourneyStrip section={section} />;
    case "method":
      return <MethodSection section={section} />;
    case "path":
      return <PathAhead section={section} />;
    default:
      return null;
  }
}
