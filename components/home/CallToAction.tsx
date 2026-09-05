import Link from "next/link";
import { getBrandConfig, getPlatformCopy } from "@/lib/config";
import type { ResolvedHomepageSection } from "@/lib/homepage";

export default function CallToAction({ section }: { section?: ResolvedHomepageSection }) {
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <section id="close" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="dual-rule" />
        <div className="py-12 text-center sm:py-16">
          <p className="kicker text-gold/80">{section?.subtitle || brand.shortName || brand.name}</p>
          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-4xl leading-[1.05] tracking-[0.012em] text-cream sm:text-6xl lg:text-7xl">
            {section?.title || brand.tagline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/50">
            {brand.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <Link
              href="/about"
              className="link-editorial font-mono text-[14px] tracking-[0.14em] text-gold hover:text-gold-bright"
            >
              Read the philosophy
            </Link>
            <Link
              href={copy.heroPrimaryCtaHref || "/learn"}
              className="inline-flex items-center bg-cream px-6 py-3 text-[14px] font-medium tracking-[0.04em] text-ink transition hover:bg-gold-bright"
            >
              {copy.heroPrimaryCta || "Start with AI"}
            </Link>
          </div>
        </div>
        <div className="dual-rule" />
      </div>
    </section>
  );
}
