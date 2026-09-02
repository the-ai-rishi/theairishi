import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { UniversalContentItem } from "@/lib/content";
import type { ResolvedHomepageSection } from "@/lib/homepage";

export default function ContentList({
  section,
  items,
}: {
  section: ResolvedHomepageSection;
  items: UniversalContentItem[];
}) {
  if (!items.length) return null;
  const title = section.title ?? "Latest";
  const subtitle = section.subtitle ?? "Published";
  const ctaLabel = section.ctaLabel;
  const ctaHref = section.ctaHref;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
              <Layers className="h-3.5 w-3.5" />
              <span>{subtitle}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              {title}
            </h2>
          </div>
          {ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white transition"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-black/40 p-6 transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-violet-300">
                    {item.type}
                  </span>
                  {item.category ? (
                    <span className="text-xs text-white/35 font-mono">{item.category}</span>
                  ) : null}
                  {item.publishedAt ? (
                    <>
                      <span className="text-xs text-white/20">•</span>
                      <span className="text-xs text-white/35 font-mono">{item.publishedAt}</span>
                    </>
                  ) : null}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-violet-200 transition">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-3xl line-clamp-2">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white shrink-0 self-start sm:self-center">
                <span>View</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-violet-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
