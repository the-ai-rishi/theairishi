import type { Metadata } from "next";
import { ArrowRight, Bot, Cloud, Code2, Database, Sparkles, Layers } from "lucide-react";

import { getAllCourses, getAllLessonSummaries } from "@/lib/lessons";
import ResumeLearningBanner from "@/components/learning/ResumeLearningBanner";
import CourseCard from "@/components/learning/CourseCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getMainNavigation,
  getFooterNavigation,
  getComingSoonCourses,
  getBrandConfig,
  getPlatformCopy,
  type CourseConfig,
} from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `Learning Hub & Technology Courses | ${brand.name}`,
    description: `First-principles courses that are actually published on this site.`,
    keywords: [brand.name, brand.tagline, "courses"],
    openGraph: {
      title: `Learning Hub & Technology Courses | ${brand.name}`,
      description: `First-principles courses that are actually published on this site.`,
      type: "website",
      siteName: brand.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Learning Hub & Technology Courses | ${brand.name}`,
      description: `First-principles courses that are actually published on this site.`,
    },
  };
}

function getCourseIcon(course: CourseConfig) {
  const cat = (course.category || "").toLowerCase();
  const id = (course.id || "").toLowerCase();

  if (id.includes("agent") || id.includes("bot") || cat.includes("advanced ai")) return Bot;
  if (id.includes("cloud") || cat.includes("cloud")) return Cloud;
  if (id.includes("data") || cat.includes("data")) return Database;
  if (id.includes("software") || id.includes("programming") || cat.includes("software")) return Code2;
  return Layers;
}

export default function LearnPage() {
  const courses = getAllCourses();
  const allLessons = getAllLessonSummaries();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const comingSoonCourses = getComingSoonCourses();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute right-[-200px] top-[500px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      {/* Dynamic Header */}
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
          The Technology Learning Platform
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
          Deep fundamentals.
          <br />
          <span className="text-white/35">Modern engineering mastery.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-white/50 sm:text-lg">
          Structured paths for the courses that are live today. Upcoming tracks stay listed as coming soon until they have lessons.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#courses"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-black transition hover:bg-white/90 shadow-lg cursor-pointer"
          >
            Explore all courses
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Dynamic Resume Banner (Shows only if learner has active progress) */}
      <ResumeLearningBanner allLessons={allLessons} />

      {/* Available Courses Section */}
      <section
        id="courses"
        className="border-y border-white/[0.07] bg-white/[0.015]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-violet-300/80">
              Curriculum Hub
            </p>
            <h2 className="mt-3 text-2xl sm:text-4xl font-semibold tracking-[-0.03em]">
              Available Courses & Paths
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/40 max-w-xl">
              Choose a discipline to begin your learning journey. Every course is organized into sequential stages and bite-sized lessons.
            </p>
          </div>

          {/* Active Courses */}
          <div className="space-y-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Planned Future Courses Roadmap — Driven from courses.json config */}
          {comingSoonCourses.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/[0.08]">
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
                  Ecosystem Expansion
                </p>
                <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-white/80">
                  Upcoming Courses in the Platform
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {comingSoonCourses.map((upcoming) => {
                  const Icon = getCourseIcon(upcoming);

                  return (
                    <div
                      key={upcoming.id}
                      className="rounded-3xl border border-white/[0.05] bg-black/20 p-6 opacity-75 transition duration-300 hover:opacity-95 hover:border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                          {upcoming.category}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-white/30 font-medium">
                          {upcoming.badge || "Upcoming Course"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#08080c] text-violet-300/70">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="text-lg font-medium text-white/90">
                          {upcoming.title}
                        </h4>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-white/45">
                        {upcoming.description}
                      </p>

                      {upcoming.upcomingTopics && upcoming.upcomingTopics.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.04]">
                          {upcoming.upcomingTopics.map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/35 font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <Sparkles className="mx-auto h-6 w-6 text-violet-300/70" />

        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          {brand.tagline}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-white/45">
          {brand.description}
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-violet-300/60 font-medium">
              01 · First Principles
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/50">
              Master the foundational mathematical and architectural concepts before using high-level frameworks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-violet-300/60 font-medium">
              02 · System Design
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/50">
              Understand how models, cloud platforms, pipelines, and agents fit together in production systems.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-violet-300/60 font-medium">
              03 · Creation & Code
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/50">
              Turn deep understanding into working software, educational resources, and open knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Footer */}
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
