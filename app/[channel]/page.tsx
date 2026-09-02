import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Radio } from "lucide-react";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getChannelItems } from "@/lib/media";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
  loadPlatformConfig,
  type SocialPlatform,
} from "@/lib/config";
import { getLiveCatalog } from "@/lib/catalog";
import { channelRouteState, getRouteChannels } from "@/lib/visibility-core";

interface ChannelPageProps {
  params: Promise<{ channel: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getRouteChannels(loadPlatformConfig(), getLiveCatalog()).map((ch) => {
      const fromHref = String(ch.href || "").replace(/^\//, "").replace(/\/.*$/, "");
      return { channel: fromHref || String(ch.id || "") };
    });
}

export async function generateMetadata({
  params,
}: ChannelPageProps): Promise<Metadata> {
  const { channel } = await params;
  const state = channelRouteState(loadPlatformConfig(), channel, getLiveCatalog());
  const brand = getBrandConfig();
  if (state.state === "not-found" || !state.channel) {
    return { title: `Not found | ${brand.name}` };
  }
  const platform = state.channel as unknown as SocialPlatform;
  return {
    title: `${platform.displayName || platform.label} | ${brand.name}`,
    description: platform.description || brand.description,
    robots: state.state === "coming-soon" ? { index: false, follow: false } : undefined,
  };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channel } = await params;
  const state = channelRouteState(loadPlatformConfig(), channel, getLiveCatalog());
  if (state.state === "not-found" || !state.channel) {
    notFound();
  }

  const platform = state.channel as unknown as SocialPlatform;
  const isComingSoon = state.state === "coming-soon";
  const items = isComingSoon ? [] : getChannelItems(platform.id);
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const externalUrl = platform.status === "active" ? platform.externalUrl : undefined;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      <Header navItems={mainNav} brand={brand} copy={copy} />

      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
          <Radio className="h-3.5 w-3.5" />
          {platform.badge || platform.label}
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          {platform.displayName || platform.label}
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/50 max-w-2xl mx-auto">
          {platform.description || brand.description}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {isComingSoon || items.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-12 sm:p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <Clock className="h-7 w-7 text-violet-300" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white">Coming soon</h2>
            <p className="mt-3 text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              Nothing is published on this channel yet.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {externalUrl ? (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-black"
                >
                  <span>Open {platform.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-xs text-white/70 hover:text-white"
              >
                Browse courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between transition hover:border-violet-400/30"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                      {item.publishedAt}
                    </span>
                    {item.duration || item.type ? (
                      <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] text-violet-300 font-mono">
                        {item.duration || item.type}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
                    {item.description || item.caption}
                  </p>
                </div>
                {(item.url || item.youtubeUrl || item.instagramUrl) && (
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end">
                    <a
                      href={item.url || item.youtubeUrl || item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-violet-300 hover:text-white"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
