import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Cloud, Code2, Database, Sparkles } from "lucide-react";

import { getAllCourses, getAllLessonSummaries } from "@/lib/lessons";
import ResumeLearningBanner from "@/components/learning/ResumeLearningBanner";
import CourseCard from "@/components/learning/CourseCard";
import SearchModal from "@/components/search/SearchModal";

export const metadata: Metadata = {
  title: "Learning Hub & Technology Courses | The AI Rishi",
  description:
    "Explore comprehensive, first-principles technology courses across Artificial Intelligence, LLMs, DevOps, Cloud Architecture, and Software Engineering.",
  keywords: [
    "Learning Platform",
    "AI Curriculum",
    "DevOps Course",
    "LLM Engineering",
    "Cloud Architecture",
    "The AI Rishi",
  ],
  openGraph: {
    title: "Learning Hub & Technology Courses | The AI Rishi",
    description:
      "Explore comprehensive, first-principles technology courses across Artificial Intelligence, LLMs, DevOps, Cloud Architecture, and Software Engineering.",
    type: "website",
    siteName: "The AI Rishi",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Hub & Technology Courses | The AI Rishi",
    description:
      "Explore comprehensive, first-principles technology courses across Artificial Intelligence, LLMs, DevOps, Cloud Architecture, and Software Engineering.",
  },
};

const UPCOMING_COURSES = [
  {
    title: "Cloud Architecture & Platforms",
    category: "Cloud Computing",
    icon: Cloud,
    description:
      "Multi-cloud design patterns across AWS, Azure, and GCP, resilient microservices, serverless compute, and enterprise networking.",
    status: "Upcoming Course",
    topics: ["AWS", "Azure", "GCP", "Distributed Systems"],
  },
  {
    title: "Software Engineering & Systems",
    category: "Software Development",
    icon: Code2,
    description:
      "High-performance programming in Python, TypeScript, and Rust, relational and vector databases, and scalable backend design.",
    status: "Upcoming Course",
    topics: ["Python", "TypeScript", "SQL", "System Design"],
  },
  {
    title: "Data Engineering & Pipelines",
    category: "Data Platforms",
    icon: Database,
    description:
      "Batch and real-time streaming architectures, Apache Kafka, Apache Spark, data lakes, dbt, and modern analytical warehouses.",
    status: "Upcoming Course",
    topics: ["Kafka", "Spark", "PostgreSQL", "dbt"],
  },
  {
    title: "Autonomous AI Agents & Multi-Agent Systems",
    category: "Advanced AI",
    icon: Bot,
    description:
      "Planning architectures, function calling, tool execution loops, self-reflection, and production multi-agent orchestration.",
    status: "Upcoming Course",
    topics: ["Tool Calling", "ReAct Loops", "Multi-Agent", "MCP"],
  },
];

export default function LearnPage() {
  const courses = getAllCourses();
  const allLessons = getAllLessonSummaries();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute right-[-200px] top-[500px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="The AI Rishi"
              width={200}
              height={50}
              className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/learn" className="text-sm text-white transition font-medium">
              Learning Hub
            </Link>
            <Link
              href="/guides"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Guides
            </Link>
            <Link
              href="/projects"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Projects
            </Link>
            <Link
              href="/youtube"
              className="text-sm text-white/50 transition hover:text-white"
            >
              YouTube
            </Link>
            <Link
              href="/instagram"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Instagram
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <SearchModal />
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-xs sm:text-sm text-white/80 transition hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
            >
              Home
            </Link>
          </div>
        </nav>
      </header>

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
          Structured, first-principles educational paths across modern artificial intelligence, large language models, cloud platforms, and DevOps infrastructure.
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

          {/* Planned Future Courses Roadmap */}
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
              {UPCOMING_COURSES.map((upcoming) => {
                const Icon = upcoming.icon;

                return (
                  <div
                    key={upcoming.title}
                    className="rounded-3xl border border-white/[0.05] bg-black/20 p-6 opacity-75 transition duration-300 hover:opacity-95 hover:border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                        {upcoming.category}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-white/30 font-medium">
                        {upcoming.status}
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

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.04]">
                      {upcoming.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/35 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <Sparkles className="mx-auto h-6 w-6 text-violet-300/70" />

        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          Ancient Wisdom · Modern Intelligence
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-white/45">
          We combine the contemplative, first-principles discipline of ancient scholars with modern computational engineering to build deep, enduring technical mastery.
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

      {/* Footer */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="The AI Rishi"
              width={180}
              height={45}
              className="h-8 w-auto object-contain opacity-85 transition-opacity duration-300 group-hover:opacity-100"
            />
          </Link>

          <div className="flex gap-6 text-xs text-white/40">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/learn" className="transition hover:text-white">
              Learning Hub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
