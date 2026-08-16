import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Layers,
  Play,
  Share2,
  Sparkles,
  Terminal,
  Video,
} from "lucide-react";

import SearchModal from "@/components/search/SearchModal";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import GuidesIcon from "@/components/icons/GuidesIcon";
import LearnIcon from "@/components/icons/LearnIcon";
import ProjectsIcon from "@/components/icons/ProjectsIcon";
import AboutIcon from "@/components/icons/AboutIcon";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white">
      {/* Ambient background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[750px] w-[750px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[150px]" />
        <div className="absolute right-[-200px] top-[350px] h-[550px] w-[550px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute left-[-200px] top-[750px] h-[450px] w-[450px] rounded-full bg-purple-800/5 blur-[130px]" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="The AI Rishi"
              width={220}
              height={55}
              className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
              priority
            />
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/learn"
              className="text-sm text-white transition font-medium hover:text-violet-200"
            >
              Learn
            </Link>

            <Link
              href="/guides"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Guides
            </Link>

            <Link
              href="/projects"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Projects
            </Link>

            <Link
              href="/youtube"
              className="text-sm text-white/60 transition hover:text-white"
            >
              YouTube
            </Link>

            <Link
              href="/instagram"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Instagram
            </Link>
          </div>

          {/* CTA & Search */}
          <div className="flex items-center gap-3">
            <SearchModal />
            <Link
              href="/learn"
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-medium transition hover:border-violet-400/30 hover:bg-white/[0.08] hover:text-white"
            >
              Learning Hub
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8 lg:pb-36 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Hero Copy */}
          <div>
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
              Learning · Engineering · Content Platform
            </div>

            {/* Heading */}
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.0] tracking-[-0.045em] sm:text-6xl lg:text-[84px]">
              <span className="block text-white">Deep foundations.</span>
              <span className="block bg-gradient-to-r from-white/30 via-white/60 to-white/20 bg-clip-text text-transparent">
                Modern mastery.
              </span>
              <span className="mt-1 block text-white">
                Shared in public.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
              A comprehensive educational and creator platform spanning Artificial Intelligence, LLM engineering, cloud platforms, DevOps infrastructure, and software craft.
            </p>

            {/* Action Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/learn"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 shadow-lg"
              >
                <span>Explore Learning Hub</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 transition hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
              >
                Browse Curricula
              </a>
            </div>

            {/* Quick Feature Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-8 text-white/40">
              <div>
                <div className="text-xl sm:text-2xl font-semibold text-white font-mono">
                  2+
                </div>
                <div className="text-xs text-white/40 mt-0.5">Active Courses</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-semibold text-white font-mono">
                  17+
                </div>
                <div className="text-xs text-white/40 mt-0.5">Core Lessons</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-semibold text-white font-mono">
                  100%
                </div>
                <div className="text-xs text-white/40 mt-0.5">First Principles</div>
              </div>
            </div>
          </div>

          {/* Interactive Visual Schematic */}
          <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[540px]">
            {/* Atmospheric glow */}
            <div className="absolute h-[340px] w-[340px] rounded-full bg-violet-600/15 blur-[100px]" />

            {/* Geometric orbital rings */}
            <div className="absolute h-[360px] w-[360px] rounded-full border border-white/[0.07]" />
            <div className="absolute h-[280px] w-[280px] rounded-full border border-violet-400/[0.12]" />
            <div className="absolute h-[200px] w-[200px] rounded-full border border-white/[0.08]" />

            {/* Orbiting particles */}
            <div className="absolute h-[360px] w-[360px] animate-[spin_24s_linear_infinite] rounded-full">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-300 shadow-[0_0_20px_rgba(196,181,253,0.9)]" />
            </div>

            <div className="absolute h-[280px] w-[280px] animate-[spin_16s_linear_infinite_reverse] rounded-full">
              <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </div>

            {/* Center Monogram / Symbol */}
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-black/75 shadow-[0_0_80px_rgba(124,58,237,0.22)] backdrop-blur-xl">
              <div className="absolute inset-3 rounded-full border border-violet-400/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-violet-300/30 bg-violet-500/[0.08]">
                <Sparkles className="h-7 w-7 text-violet-200" />
              </div>
            </div>

            {/* Floating Domain Badges */}
            <div className="absolute left-2 top-12 rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-violet-300" />
                <span className="text-xs font-medium text-white/80">AI & LLMs</span>
              </div>
            </div>

            <div className="absolute right-4 top-24 rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-300" />
                <span className="text-xs font-medium text-white/80">DevOps & Cloud</span>
              </div>
            </div>

            <div className="absolute bottom-12 left-10 rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-purple-300" />
                <span className="text-xs font-medium text-white/80">Creator Studio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: LEARN (The Platform Courses) */}
      <section
        id="courses"
        className="border-t border-white/[0.07] bg-white/[0.015] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-300/80">
                <BookOpen className="h-3.5 w-3.5" />
                Learn · Structured Curricula
              </div>
              <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-[-0.03em]">
                Explore Technology Courses
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/50 max-w-xl">
                Modular, first-principles learning tracks designed to take you from foundational concepts to building real systems.
              </p>
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-violet-300 transition hover:text-white self-start md:self-end"
            >
              <span>View full curriculum hub</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Course Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Course 1: Artificial Intelligence (Active) */}
            <div className="group relative rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-950/20 via-black to-black p-8 transition-all duration-300 hover:border-violet-400/40 hover:bg-white/[0.02] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-violet-300 font-medium">
                    Artificial Intelligence
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Track
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-white group-hover:text-violet-100 transition">
                  Artificial Intelligence & LLMs
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  From machine learning fundamentals and neural representations to transformers, self-attention, large language models, RAG, and autonomous agents.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-violet-300/70" />
                    2 Stages
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-violet-300/70" />
                    15 Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-violet-300/70" />
                    Self-paced
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href="/learn/ai-fundamentals-01"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
                >
                  <span>Start AI Course</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/learn"
                  className="text-xs text-white/40 hover:text-white transition"
                >
                  View syllabus →
                </Link>
              </div>
            </div>

            {/* Course 2: DevOps & Cloud Engineering (Active Validation Track) */}
            <div className="group relative rounded-3xl border border-white/[0.08] bg-black/40 p-8 transition-all duration-300 hover:border-violet-400/30 hover:bg-white/[0.02] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-wider text-white/50 font-medium">
                    Infrastructure & DevOps
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Track
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-white group-hover:text-violet-100 transition">
                  DevOps & Cloud Engineering
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  Master continuous integration, automated deployment pipelines, containerization with Docker, Kubernetes orchestration, and cloud infrastructure.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-violet-300/70" />
                    1 Stage
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-violet-300/70" />
                    2 Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-violet-300/70" />
                    Self-paced
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href="/learn/devops-fundamentals-01"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
                >
                  <span>Start DevOps Course</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/learn"
                  className="text-xs text-white/40 hover:text-white transition"
                >
                  View syllabus →
                </Link>
              </div>
            </div>

            {/* Upcoming Track: Cloud Architecture */}
            <div className="rounded-3xl border border-white/[0.05] bg-black/20 p-8 opacity-75 transition duration-300 hover:opacity-95">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">
                  Cloud Computing
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/40">
                  Coming Soon
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white/80">
                Cloud Architecture & Platforms
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/40">
                Multi-cloud architectures across Azure, AWS, and GCP, distributed networking, high availability, serverless compute, and microservices.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/[0.04]">
                {["Azure", "AWS", "GCP", "Microservices"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/30 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Upcoming Track: Software Engineering */}
            <div className="rounded-3xl border border-white/[0.05] bg-black/20 p-8 opacity-75 transition duration-300 hover:opacity-95">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">
                  Software Development
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/40">
                  Coming Soon
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white/80">
                Programming & System Design
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/40">
                High-performance programming with Python, TypeScript, and Rust, relational SQL & Vector database design, and resilient backend systems.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/[0.04]">
                {["Python", "TypeScript", "SQL", "System Design"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/30 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CREATE (Creator Content Hub) */}
      <section id="create" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-300/80">
              <Share2 className="h-3.5 w-3.5" />
              Create · Educational Media
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-[-0.03em]">
              The Creator Ecosystem
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/50 leading-relaxed">
              Transforming technical learning into high-clarity video teardowns, visual architectural guides, and open educational resources.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* YouTube Media */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.015] p-7 flex flex-col justify-between group transition hover:border-red-500/30">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
                    <YouTubeIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-red-300 font-mono">
                    Media Library
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-medium text-white group-hover:text-red-200 transition">
                  YouTube Teardowns
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/45">
                  Long-form video tutorials, architecture walk-throughs, and step-by-step code implementations built in public.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-white/30">Video Series & Streams</span>
                <Link href="/youtube" className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-medium">
                  <span>Watch videos</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Instagram & Visual Carousels */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.015] p-7 flex flex-col justify-between group transition hover:border-pink-500/30">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 text-pink-400">
                    <InstagramIcon className="h-5 w-5 text-pink-400" />
                  </div>
                  <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-pink-300 font-mono">
                    Visual Notes
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-medium text-white group-hover:text-pink-200 transition">
                  Instagram Carousels & Reels
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/45">
                  Bite-sized visual guides, system design flowcharts, and quick concept breakdowns designed for rapid daily learning.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-white/30">Visual Flowcharts</span>
                <Link href="/instagram" className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 font-medium">
                  <span>View visual notes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Technical Articles */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.015] p-7 flex flex-col justify-between group transition hover:border-violet-400/30">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                    <GuidesIcon className="h-5 w-5 text-violet-300" />
                  </div>
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-violet-300 font-mono">
                    Articles
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-medium text-white group-hover:text-violet-200 transition">
                  Articles & Architecture Guides
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/45">
                  Detailed technical essays, mental frameworks, performance benchmarks, and deep dives into AI and cloud engineering.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-white/30">Long-Form Writing</span>
                <Link href="/guides" className="inline-flex items-center gap-1 text-violet-300 hover:text-white font-medium">
                  <span>Read articles</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPLORE (Projects & Resources) */}
      <section
        id="projects"
        className="border-t border-white/[0.07] bg-white/[0.015] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-300/80">
                <Compass className="h-3.5 w-3.5" />
                Explore · Build in Public
              </div>
              <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-[-0.03em]">
                Real-World Projects & Labs
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/50 leading-relaxed">
                Knowledge becomes enduring when applied. Follow end-to-end open builds from initial architecture to live production deployment.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-violet-300 uppercase">
                      Lab 01 · In Progress
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">
                      AI Project
                    </span>
                  </div>
                  <h4 className="mt-2 text-base font-medium text-white">
                    Autonomous Multi-Source Research Agent
                  </h4>
                  <p className="mt-1 text-xs text-white/40">
                    Building a self-directed research agent utilizing ReAct loops, vector search grounding, and tool execution.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-300 uppercase">
                      Lab 02 · Planned
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">
                      DevOps Project
                    </span>
                  </div>
                  <h4 className="mt-2 text-base font-medium text-white">
                    Multi-Region Kubernetes CI/CD Pipeline
                  </h4>
                  <p className="mt-1 text-xs text-white/40">
                    Automated GitHub Actions GitOps workflow with ArgoCD, Terraform, and zero-downtime rolling deployments.
                  </p>
                </div>
              </div>
            </div>

            {/* Philosophy Card */}
            <div id="about" className="rounded-3xl border border-white/[0.08] bg-black/50 p-8 sm:p-12 relative overflow-hidden">
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />
              
              <Sparkles className="h-6 w-6 text-violet-300/80" />

              <h3 className="mt-6 text-2xl sm:text-3xl font-semibold text-white">
                Ancient Wisdom.
                <br />
                Modern Intelligence.
              </h3>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/50">
                The name <em>The AI Rishi</em> reflects a commitment to the depth, contemplation, and rigorous first-principles inquiry of ancient wisdom—applied to the most transformative computing paradigms of our era.
              </p>

              <div className="mt-8 space-y-3 border-t border-white/[0.08] pt-6 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>No superficial jargon — understand how systems work from zero.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Open educational curricula and practical engineering code.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Built for continuous learning, engineering, and creation.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="The AI Rishi"
              width={180}
              height={45}
              className="h-8 w-auto object-contain opacity-85 transition-opacity duration-300 group-hover:opacity-100"
            />
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/40">
            <Link href="/learn" className="hover:text-white transition">
              Learn
            </Link>
            <Link href="/guides" className="hover:text-white transition">
              Guides
            </Link>
            <Link href="/projects" className="hover:text-white transition">
              Projects
            </Link>
            <Link href="/youtube" className="hover:text-white transition">
              YouTube
            </Link>
            <Link href="/instagram" className="hover:text-white transition">
              Instagram
            </Link>
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs text-white/30">
              © {new Date().getFullYear()} The AI Rishi
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
