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
import { getRecentContent, getTechnologyUpdates, getInterviewContent } from "@/lib/content";
import {
  getMainNavigation,
  getFooterNavigation,
  getHomepageSections,
  getTopicBySlug,
  getBrandConfig,
  getPlatformCopy,
} from "@/lib/config";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  // Title uses brand config tagline — no hardcoded tagline here
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function Home() {
  const courses = getAllCourses();
  const recentContent = getRecentContent(5);
  const techUpdates = getTechnologyUpdates();
  const interviewContent = getInterviewContent();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const sections = getHomepageSections();

  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  // Resolve topic slugs dynamically from config for section-specific components
  // This means if "updates" is renamed to "technology-radar", the link updates automatically
  const updatesTopic = getTopicBySlug("updates");
  const interviewTopic = getTopicBySlug("interview");
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white">
      {/* Background Glow Overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-350px] h-[850px] w-[850px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[170px]" />
        <div className="absolute right-[-200px] top-[500px] h-[550px] w-[550px] rounded-full bg-indigo-600/5 blur-[150px]" />
      </div>

      {/* Dynamic Header */}
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Homepage Sections — rendered in config order, config-controlled */}
      {orderedSections.map((section) => {
        switch (section.id) {
          case "hero":
            return <HeroSection key="hero" />;

          case "topics":
            // Section title/subtitle/CTA come from section config
            return <QuickDiscovery key="topics" section={section} />;

          case "content-types":
            return <ContentTypeDiscovery key="content-types" section={section} />;

          case "continue-learning":
            return <ContinueLearning key="continue-learning" courses={courses} />;

          case "latest-content":
            return <LatestFeed key="latest-content" items={recentContent} section={section} />;

          case "technology-updates":
            // topicSlug is derived from the active "updates" topic config slug
            // If "updates" topic is renamed/disabled, this updates automatically
            return (
              <TechnologyUpdates
                key="technology-updates"
                updates={techUpdates}
                section={section}
                topicSlug={updatesTopic?.slug}
              />
            );

          case "interviews":
            // topicSlug is derived from the active "interview" topic config slug
            return (
              <InterviewSection
                key="interviews"
                interviews={interviewContent}
                section={section}
                topicSlug={interviewTopic?.slug}
              />
            );

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
            // Unknown section IDs are silently skipped — no crash
            return null;
        }
      })}

      {/* Dynamic Footer */}
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
