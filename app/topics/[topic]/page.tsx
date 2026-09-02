import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/brand/PageShell";
import { getContentByTopic } from "@/lib/content";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
  loadPlatformConfig,
  type TopicConfig,
} from "@/lib/config";
import { getLiveCatalog } from "@/lib/catalog";
import { getRouteTopics, topicRouteState } from "@/lib/visibility-core";
import { topicTone } from "@/lib/palette";

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return getRouteTopics(loadPlatformConfig(), getLiveCatalog()).map((t) => ({
    topic: String(t.slug || ""),
  }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const state = topicRouteState(loadPlatformConfig(), topic, getLiveCatalog());
  const brand = getBrandConfig();

  if (state.state === "not-found" || !state.topic) {
    return { title: `Topic Not Found | ${brand.name}` };
  }

  const config = state.topic as unknown as TopicConfig;
  return {
    title: `${config.name} | ${brand.name}`,
    description: config.description,
    robots: state.state === "coming-soon" ? { index: false, follow: false } : undefined,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const state = topicRouteState(loadPlatformConfig(), topic, getLiveCatalog());

  if (state.state === "not-found" || !state.topic) {
    notFound();
  }

  const config = state.topic as unknown as TopicConfig;
  const items = state.state === "active" ? getContentByTopic(topic) : [];
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const isComingSoon = state.state === "coming-soon" || items.length === 0;
  const tone = topicTone(config.color, 0, 1);

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker" style={{ color: tone.accent }}>
          {config.category}
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          {config.shortName}
        </h1>
        <p className="mt-3 font-serif text-xl italic text-cream/45">{config.name}</p>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/55">
          {config.description}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {isComingSoon ? (
          <div className="border-t border-hairline py-16">
            <p className="kicker text-cream/40">Coming soon</p>
            <p className="mt-4 max-w-md text-cream/45">
              Nothing published here yet. Check the paths that are already live.
            </p>
            <Link href="/learn" className="link-editorial mt-6 inline-block font-mono text-[14px] text-gold">
              Browse paths →
            </Link>
          </div>
        ) : (
          <ol className="divide-y divide-hairline border-t border-hairline">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="group grid grid-cols-1 items-baseline gap-2 py-5 sm:grid-cols-[7.5rem_5.5rem_1fr] sm:gap-6"
                >
                  <span className="font-mono text-[13px] text-cream/40">
                    {item.publishedAt || "—"}
                  </span>
                  <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold/70">
                    {item.type}
                  </span>
                  <span className="font-serif text-xl text-cream group-hover:text-gold-bright sm:text-2xl">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </PageShell>
  );
}
