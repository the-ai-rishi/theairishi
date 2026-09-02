import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllTopics, getTopicBySlug } from "@/lib/topics";
import { getContentByTopic } from "@/lib/content";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
} from "@/lib/config";

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return getAllTopics().map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const config = getTopicBySlug(topic);
  const brand = getBrandConfig();

  if (!config) {
    return { title: `Topic Not Found | ${brand.name}` };
  }

  return {
    title: `${config.name} | ${brand.name}`,
    description: config.description,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const config = getTopicBySlug(topic);

  if (!config) {
    notFound();
  }

  const items = getContentByTopic(topic);
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      {/* Dynamic Header */}
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 font-mono">
          <Compass className="h-3.5 w-3.5" />
          {config.category} • {config.badge}
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          {config.name}
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/50 max-w-2xl mx-auto">
          {config.description}
        </p>
      </section>

      {/* Content Feed for Topic */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-12 text-center text-white/40">
            Content for this domain is currently being curated. Check back soon.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-black/40 p-6 transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider text-violet-300">
                      {item.type}
                    </span>
                    <span className="text-xs text-white/35 font-mono">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white group-hover:text-violet-200 transition">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-white/50 max-w-2xl">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-white shrink-0 self-start sm:self-center">
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-violet-300" />
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
