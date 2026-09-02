import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import type { HomepageSection } from "@/lib/config";
import type { UniversalContentItem } from "@/lib/content";

interface InterviewSectionProps {
  interviews: UniversalContentItem[];
  section?: HomepageSection;
  /** The slug of the topic this section links to (from config, e.g. "interview") */
  topicSlug?: string;
}

export default function InterviewSection({
  interviews,
  section,
  topicSlug,
}: InterviewSectionProps) {
  // All display text from config; fallback to sensible defaults
  const title = section?.title ?? "Interview & Career Prep";
  const subtitle = section?.subtitle ?? "Career Track";
  const ctaLabel = section?.ctaLabel ?? "View All Prep Content";
  const ctaHref = section?.ctaHref ?? (topicSlug ? `/topics/${topicSlug}` : "/learn");

  if (interviews.length === 0) {
    return (
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm text-white/45">
            {title} is coming soon.{" "}
            <Link href={ctaHref} className="text-pink-300 hover:text-white transition">
              {ctaLabel}
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-pink-300">
              <HelpCircle className="h-3.5 w-3.5 text-pink-300" />
              <span>{subtitle}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              {title}
            </h2>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-pink-300 hover:text-white transition"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
            {interviews.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between transition duration-300 hover:border-pink-500/30 hover:bg-white/[0.02]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider text-pink-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/35">
                      Interview Q&A
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-pink-200 transition">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-white/35 font-mono">Architecture Teardown</span>
                  <span className="inline-flex items-center gap-1 text-pink-300 group-hover:text-white font-medium transition">
                    <span>Explore framework</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
      </div>
    </section>
  );
}
