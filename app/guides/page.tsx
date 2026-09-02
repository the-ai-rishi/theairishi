import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllGuideSummaries } from "@/lib/guides";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `Articles & Guides | ${brand.name}`,
    description:
      "In-depth technical articles, architecture deep-dives, and practical engineering tutorials across AI, DevOps, and cloud systems.",
  };
}

export default function GuidesPage() {
  const guides = getAllGuideSummaries();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
      </div>

      {/* Dynamic Header */}
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
          <FileText className="h-3.5 w-3.5 text-violet-300" />
          Technical Writing & Essays
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          Articles & Architecture Guides
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/50 max-w-2xl mx-auto">
          First-principles technical essays, mental frameworks, and architectural deep dives designed for engineers.
        </p>
      </section>

      {/* Guides List */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {guides.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-12 text-center text-white/40">
            Articles and guides are currently being written. Check back soon.
          </div>
        ) : (
          <div className="space-y-6">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-0.5 text-[11px] uppercase tracking-wider text-violet-300 font-mono">
                      {guide.metadata.category}
                    </span>
                    <span className="text-xs text-white/35 font-mono">
                      {guide.metadata.date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-violet-200 transition">
                    {guide.metadata.title}
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-white/50 max-w-2xl">
                    {guide.metadata.description}
                  </p>

                  {guide.metadata.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {guide.metadata.tags.map((t) => (
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

                <div className="flex items-center gap-2 text-xs font-semibold text-white shrink-0 self-start sm:self-center">
                  <span>Read guide</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-violet-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Footer */}
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}

