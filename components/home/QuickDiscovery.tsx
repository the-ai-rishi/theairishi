import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { getAllTopics } from "@/lib/config";
import type { HomepageSection } from "@/lib/config";

interface QuickDiscoveryProps {
  section?: HomepageSection;
}

export default function QuickDiscovery({ section }: QuickDiscoveryProps) {
  const topics = getAllTopics();
  const title = section?.title ?? "Explore Topics";
  const subtitle = section?.subtitle ?? "Platform Domains";
  const ctaLabel = section?.ctaLabel ?? "View All Courses";
  const ctaHref = section?.ctaHref ?? "/learn";

  return (
    <section id="explore-topics" className="py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
              <Compass className="h-3.5 w-3.5" />
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

        {/* Topics Grid — fully dynamic from config */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="group relative rounded-3xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-white/50">
                    {topic.badge}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-violet-300" />
                </div>

                <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-amber-200 transition">
                  {topic.name}
                </h3>

                <p className="mt-2 text-xs text-white/50 leading-relaxed line-clamp-3">
                  {topic.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-white/35 font-mono">Domain</span>
                <span className="text-violet-300 font-medium group-hover:text-white transition">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
