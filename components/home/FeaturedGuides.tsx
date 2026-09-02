import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getAllGuideSummaries } from "@/lib/guides";
import type { HomepageSection } from "@/lib/config";

interface FeaturedGuidesProps {
  section?: HomepageSection;
}

export default function FeaturedGuides({ section }: FeaturedGuidesProps) {
  const guides = getAllGuideSummaries();
  const title = section?.title ?? "Featured Guides & Frameworks";
  const subtitle = section?.subtitle ?? "Deep Technical Essays";
  const ctaLabel = section?.ctaLabel ?? "View All Guides";
  const ctaHref = section?.ctaHref ?? "/guides";

  if (guides.length === 0) return null;


  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
              <BookOpen className="h-3.5 w-3.5" />
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

        <div className="mt-8 space-y-4">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-0.5 text-[11px] uppercase tracking-wider text-violet-300 font-mono">
                    {guide.metadata.category}
                  </span>
                  <span className="text-xs text-white/35 font-mono">{guide.metadata.date}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-violet-200 transition">
                  {guide.metadata.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-2xl">
                  {guide.metadata.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-white shrink-0 self-start sm:self-center">
                <span>Read guide</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-violet-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
