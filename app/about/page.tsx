import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import LearnIcon from "@/components/icons/LearnIcon";
import GuidesIcon from "@/components/icons/GuidesIcon";
import ProjectsIcon from "@/components/icons/ProjectsIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import AboutIcon from "@/components/icons/AboutIcon";
import SearchModal from "@/components/search/SearchModal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & Mission | The AI Rishi",
  description:
    "Discover the philosophy behind The AI Rishi: fusing ancient contemplative discipline with first-principles artificial intelligence, cloud engineering, and modern systems mastery.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[750px] w-[750px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[150px]" />
        <div className="absolute right-[-200px] top-[400px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      {/* Header */}
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
            <Link href="/learn" className="text-sm text-white/50 transition hover:text-white">
              Learn
            </Link>
            <Link href="/guides" className="text-sm text-white/50 transition hover:text-white">
              Guides
            </Link>
            <Link href="/projects" className="text-sm text-white/50 transition hover:text-white">
              Projects
            </Link>
            <Link href="/youtube" className="text-sm text-white/50 transition hover:text-white">
              YouTube
            </Link>
            <Link href="/instagram" className="text-sm text-white/50 transition hover:text-white">
              Instagram
            </Link>
            <Link href="/about" className="text-sm text-white font-medium transition">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <SearchModal />
            <Link
              href="/learn"
              className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-xs sm:text-sm text-white/80 transition hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
            >
              Learning Hub
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          The Rishi Philosophy
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          Ancient Wisdom. <br />
          <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
            Modern Intelligence.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/60 max-w-2xl mx-auto">
          The AI Rishi is a first-principles technology learning and content platform created to demystify complex computational systems—from deep neural networks to distributed cloud infrastructure.
        </p>
      </section>

      {/* Mission Pillars Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <LearnIcon className="h-6 w-6 text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">First-Principles Learning</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
              We deconstruct complex technology into foundational mathematical, physical, and architectural building blocks. No magic, no unexplained jargon.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <GuidesIcon className="h-6 w-6 text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">Curated Engineering Guides</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
              In-depth essays, architectural decision records, and practical tutorials covering AI, LLMs, DevOps pipelines, and cloud platform design.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <ProjectsIcon className="h-6 w-6 text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">Build in Public Labs</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
              Open-source autonomous AI agents, vector synthesis tools, and automated deployment blueprints built live and documented step-by-step.
            </p>
          </div>
        </div>
      </section>

      {/* Creator & Brand Story */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.03] to-black/60 p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/logo-mark.png"
              alt="The AI Rishi emblem"
              width={64}
              height={64}
              className="h-16 w-16 object-contain rounded-2xl border border-violet-400/20 bg-black/60"
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">The AI Rishi</h2>
              <p className="text-xs text-amber-200/70 font-mono">
                {siteConfig.author.role}
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            {siteConfig.author.bio}
          </p>

          <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
            <span>Core Pillars: Artificial Intelligence · Cloud Infrastructure · Engineering Excellence</span>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 font-semibold text-violet-300 hover:text-white transition"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] mt-16">
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

          <div className="flex flex-wrap gap-6 text-xs text-white/40">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <Link href="/learn" className="transition hover:text-white">Learn</Link>
            <Link href="/guides" className="transition hover:text-white">Guides</Link>
            <Link href="/projects" className="transition hover:text-white">Projects</Link>
            <Link href="/youtube" className="transition hover:text-white">YouTube</Link>
            <Link href="/instagram" className="transition hover:text-white">Instagram</Link>
            <Link href="/about" className="transition hover:text-white">About</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
