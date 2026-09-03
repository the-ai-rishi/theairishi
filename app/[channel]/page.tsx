import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
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
  if (state.state !== "active" || !state.channel) {
    return { title: `Not found | ${brand.name}` };
  }
  const platform = state.channel as unknown as SocialPlatform;
  return {
    title: `${platform.displayName || platform.label} | ${brand.name}`,
    description: platform.description || brand.description,
  };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channel } = await params;
  const state = channelRouteState(loadPlatformConfig(), channel, getLiveCatalog());
  if (state.state !== "active" || !state.channel) {
    notFound();
  }

  const platform = state.channel as unknown as SocialPlatform;
  const items = getChannelItems(platform.id);
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const externalUrl = platform.status === "active" ? platform.externalUrl : undefined;

  return (
    <main className="min-h-screen bg-ink text-cream selection:bg-gold/25 selection:text-ink pb-24">
      <Header navItems={mainNav} brand={brand} copy={copy} />

      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase text-circuit-bright">
          <Radio className="h-3.5 w-3.5" />
          {platform.badge || platform.label}
        </div>
        <h1 className="mt-6 font-serif text-5xl tracking-[0.01em] text-cream sm:text-7xl">
          {platform.displayName || platform.label}
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-cream/50 max-w-2xl mx-auto">
          {platform.description || brand.description}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="border-t border-hairline py-16 text-center">
            <h2 className="font-serif text-3xl text-cream">Coming soon</h2>
            <p className="mt-3 text-sm text-cream/50 max-w-md mx-auto leading-relaxed">
              Nothing is published on this channel yet.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {externalUrl ? (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cream px-6 py-3 text-xs font-medium text-ink"
                >
                  <span>Open {platform.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 font-mono text-xs text-gold hover:text-gold-bright"
              >
                Browse courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group w-[280px] shrink-0 border-t border-hairline pt-5 sm:w-[320px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-cream/40 font-mono">
                      {item.publishedAt}
                    </span>
                    {item.duration || item.type ? (
                      <span className="font-mono text-[10px] text-circuit-bright">
                        {item.duration || item.type}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-serif text-2xl text-cream">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-cream/50">
                    {item.description || item.caption}
                  </p>
                </div>
                {(item.url || item.youtubeUrl || item.instagramUrl) && (
                  <div className="mt-6 pt-4 border-t border-hairline flex justify-end">
                    <a
                      href={item.url || item.youtubeUrl || item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-circuit-bright hover:text-cream"
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
