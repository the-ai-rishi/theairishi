import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LearnIcon from "@/components/icons/LearnIcon";
import ProjectsIcon from "@/components/icons/ProjectsIcon";
import AboutIcon from "@/components/icons/AboutIcon";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `About & Mission | ${brand.name}`,
    description:
      `${brand.name} is a premium technology education and content platform covering AI, machine learning, cloud, DevOps, software engineering, career guidance, and more — explained simply and practically.`,
  };
}

export default function AboutPage() {
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[750px] w-[750px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[150px]" />
        <div className="absolute right-[-200px] top-[400px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      {/* Dynamic Header */}
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
          <AboutIcon className="h-3.5 w-3.5 text-violet-300" />
          {brand.name} Ecosystem
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          Demystifying Technology From First Principles
        </h1>

        <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/60 max-w-2xl mx-auto">
          Built for software engineers, platform architects, and technology leaders looking to learn, build, and stay ahead in the age of AI.
        </p>
      </section>

      {/* Core Mission Cards */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <LearnIcon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">First-Principles Learning</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Skip surface-level tutorials. Learn how systems work underneath the abstraction layer.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
              <ProjectsIcon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Build in Public</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Hands-on lab projects, open-source AI agents, and production infrastructure blueprints.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-500/10 text-amber-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Career Evolution</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Senior engineering principles, system design teardowns, and leadership frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Footer */}
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
