import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Play } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getYoutubeVideos } from "@/lib/media";
import {
  getSocialPlatform,
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
} from "@/lib/config";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `YouTube | ${brand.name}`,
    description:
      "Long-form video tutorials, architecture walk-throughs, and live AI and cloud system builds.",
  };
}

export default function YoutubePage() {
  const platform = getSocialPlatform("youtube");
  const isComingSoon = !platform || platform.status === "coming-soon";
  const videos = isComingSoon ? [] : getYoutubeVideos();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />
      </div>

      {/* Dynamic Header */}
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs text-red-300">
          <Play className="h-3.5 w-3.5 fill-red-400 text-red-400" />
          Video Teardowns & Architecture
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          YouTube Media Library
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/50 max-w-2xl mx-auto">
          In-depth video tutorials, architectural walk-throughs, and first-principles software build-in-public streams.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-xs font-semibold text-white transition hover:bg-red-500 shadow-lg cursor-pointer"
          >
            <span>Subscribe on YouTube</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Content or Coming Soon */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {isComingSoon ? (
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-12 sm:p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <Clock className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white">
              YouTube Content Coming Soon
            </h2>
            <p className="mt-3 text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              Video tutorials, architecture walk-throughs, and live build sessions are in production.
              Subscribe to the channel to be notified when the first videos publish.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-xs font-semibold text-white transition hover:bg-red-500"
              >
                <span>Subscribe for Updates</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-xs text-white/70 transition hover:text-white hover:bg-white/[0.08]"
              >
                <span>Explore Learning Hub</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between transition hover:border-red-500/30 hover:bg-white/[0.02]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                      {video.publishedAt}
                    </span>
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[10px] text-red-300 font-mono">
                      {video.duration}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-red-200 transition">
                    {video.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
                    {video.description}
                  </p>
                  {video.tags && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {video.tags.map((t) => (
                        <span key={t} className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/35 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-end">
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition"
                  >
                    <span>Watch Video</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Footer */}
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}

