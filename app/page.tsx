import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import QuickDiscovery from "@/components/home/QuickDiscovery";
import ContentTypeDiscovery from "@/components/home/ContentTypeDiscovery";
import ContinueLearning from "@/components/home/ContinueLearning";
import LatestFeed from "@/components/home/LatestFeed";
import TechnologyUpdates from "@/components/home/TechnologyUpdates";
import InterviewSection from "@/components/home/InterviewSection";
import FeaturedGuides from "@/components/home/FeaturedGuides";
import ProjectShowcase from "@/components/home/ProjectShowcase";
import SeriesShowcase from "@/components/home/SeriesShowcase";
import SocialShowcase from "@/components/home/SocialShowcase";
import CallToAction from "@/components/home/CallToAction";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllCourses } from "@/lib/lessons";
import { getContentForTopic, getRecentContent } from "@/lib/content";
import {
  getMainNavigation,
  getFooterNavigation,
  getHomepageSections,
  getBrandConfig,
  getPlatformCopy,
} from "@/lib/config";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function Home() {
  const courses = getAllCourses();
  const recentContent = getRecentContent(5);
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const sections = getHomepageSections();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-350px] h-[850px] w-[850px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[170px]" />
        <div className="absolute right-[-200px] top-[500px] h-[550px] w-[550px] rounded-full bg-indigo-600/5 blur-[150px]" />
      </div>

      <Header navItems={mainNav} brand={brand} copy={copy} />

      {sections.map((section) => {
        switch (section.id) {
          case "hero":
            return <HeroSection key="hero" />;

          case "topics":
            return <QuickDiscovery key="topics" section={section} />;

          case "content-types":
            return <ContentTypeDiscovery key="content-types" section={section} />;

          case "continue-learning":
            return <ContinueLearning key="continue-learning" courses={courses} />;

          case "latest-content":
            return <LatestFeed key="latest-content" items={recentContent} section={section} />;

          case "technology-updates": {
            const topicSlug = section.topicId;
            const items = getContentForTopic(topicSlug);
            return (
              <TechnologyUpdates
                key="technology-updates"
                updates={items}
                section={section}
                topicSlug={topicSlug}
              />
            );
          }

          case "interviews": {
            const topicSlug = section.topicId;
            const items = getContentForTopic(topicSlug);
            return (
              <InterviewSection
                key="interviews"
                interviews={items}
                section={section}
                topicSlug={topicSlug}
              />
            );
          }

          case "guides":
            return <FeaturedGuides key="guides" section={section} />;

          case "projects":
            return <ProjectShowcase key="projects" section={section} />;

          case "series":
            return <SeriesShowcase key="series" section={section} />;

          case "social":
            return <SocialShowcase key="social" />;

          case "cta":
            return <CallToAction key="cta" />;

          default:
            return null;
        }
      })}

      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
