import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { getAllSeriesConfigs, type SeriesConfig, type HomepageSection } from "@/lib/config";

interface SeriesShowcaseProps {
  section?: HomepageSection;
}

export default function SeriesShowcase({ section }: SeriesShowcaseProps) {
  const seriesList = getAllSeriesConfigs();
  const title = section?.title ?? "Featured Content Series";
  const subtitle = section?.subtitle ?? "Multi-Format Tracks";
  const ctaLabel = section?.ctaLabel ?? "Explore All Series";
  const ctaHref = section?.ctaHref ?? "/learn";

  if (seriesList.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-white/[0.01] border-y border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300">
              <Bookmark className="h-3.5 w-3.5" />
              <span>{subtitle}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              {title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-xl leading-relaxed">
              Curated tracks that connect interactive courses, architectural teardowns, open-source blueprints, and visual explainers.
            </p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-white transition"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {seriesList.map((series: SeriesConfig) => (
            <Link
              key={series.id}
              href={`/topics/${series.topic}`}
              className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 flex flex-col justify-between transition duration-300 hover:border-amber-400/30 hover:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-mono text-amber-300 uppercase tracking-wider">
                    {series.badge || "Series Track"}
                  </span>
                  <span className="text-[11px] font-mono text-white/35">
                    {series.category}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white group-hover:text-amber-200 transition">
                  {series.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed">
                  {series.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-white transition">
                <span>Explore Track</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
