import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import type { HomepageSection } from "@/lib/config";
import type { UniversalContentItem } from "@/lib/content";

interface TechnologyUpdatesProps {
  updates: UniversalContentItem[];
  section?: HomepageSection;
  /** The slug of the topic this section links to (from config, e.g. "updates") */
  topicSlug?: string;
}

export default function TechnologyUpdates({ updates, section, topicSlug }: TechnologyUpdatesProps) {
  // All display text from config; fallback to sensible defaults
  const title = section?.title ?? "Technology Radar & Updates";
  const subtitle = section?.subtitle ?? "Tech Radar";
  const ctaLabel = section?.ctaLabel ?? "View All Radar Updates";
  const ctaHref = section?.ctaHref ?? (topicSlug ? `/topics/${topicSlug}` : "/learn");

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
              <Radio className="h-3.5 w-3.5 text-violet-300" />
              <span>{subtitle}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              {title}
            </h2>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white transition"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {updates.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/[0.08] bg-black/40 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 mb-4">
              <Radio className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Technology Updates Radar</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              Curated breakdowns of major model releases, cloud announcements, developer tools, and platform updates from OpenAI, Azure, AWS, and Kubernetes.
            </p>
            <Link
              href={ctaHref}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-xs text-white/80 transition hover:border-white/30 hover:text-white"
            >
              <span>Explore Tech Updates</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {updates.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider text-violet-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/35">
                      {item.publishedAt}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-violet-200 transition">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-white/35 font-mono">Radar Digest</span>
                  <span className="inline-flex items-center gap-1 text-violet-300 group-hover:text-white font-medium transition">
                    <span>Read update</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
