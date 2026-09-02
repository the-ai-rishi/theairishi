import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getInstagramPosts } from "@/lib/media";
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
    title: `Instagram Visual Notes | ${brand.name}`,
    description:
      "Bite-sized visual guides, architectural carousels, and quick concept reels.",
  };
}

export default function InstagramPage() {
  const platform = getSocialPlatform("instagram");
  const isComingSoon = !platform || platform.status === "coming-soon";
  const posts = isComingSoon ? [] : getInstagramPosts();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const instagramUrl = siteConfig.social.instagram;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-pink-600/10 blur-[150px]" />
      </div>

      <Header navItems={mainNav} brand={brand} copy={copy} />

      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs text-pink-300">
          <Sparkles className="h-3.5 w-3.5 text-pink-400" />
          Visual Architecture Notes & Carousels
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          {platform?.displayName ?? "Instagram Visual Guides"}
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/50 max-w-2xl mx-auto">
          {platform?.description ??
            "Bite-sized architectural flowcharts, concept carousels, and visual engineering summaries."}
        </p>

        {instagramUrl ? (
          <div className="mt-8 flex justify-center">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-xs font-semibold text-white transition hover:opacity-90 shadow-lg cursor-pointer"
            >
              <span>Follow on Instagram</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {isComingSoon ? (
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-12 sm:p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10">
              <Clock className="h-7 w-7 text-pink-400" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white">
              Instagram Content Coming Soon
            </h2>
            <p className="mt-3 text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              Visual guides, architecture carousels, and concept reels are in production.
              Follow the account to be notified when the first posts publish.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <span>Follow for Updates</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
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
            {posts.map((post) => (
              <div
                key={post.id}
                className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between transition hover:border-pink-500/30 hover:bg-white/[0.02]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                      {post.publishedAt}
                    </span>
                    <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-2.5 py-0.5 text-[10px] text-pink-300 font-mono">
                      {post.type}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-pink-200 transition">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
                    {post.caption}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-white/35 font-mono">
                    {post.likes ? `${post.likes} likes` : "Post"}
                  </span>
                  {post.instagramUrl ? (
                    <a
                      href={post.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-medium transition"
                    >
                      <span>View on Instagram</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
