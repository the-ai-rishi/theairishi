import Link from "next/link";
import { getBrandConfig, getPlatformCopy } from "@/lib/config";
import type { ResolvedHomepageSection } from "@/lib/homepage";

export default function CallToAction({ section }: { section?: ResolvedHomepageSection }) {
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const title = section?.title || brand.tagline;
  const kicker = section?.subtitle || brand.shortName || "Rishi";
  const body = brand.lineage
    ? `${brand.lineage} ${brand.description}`
    : brand.description;

  return (
    <section id="close" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="dual-rule" />
        <div className="py-14 text-center sm:py-16">
          <p className="kicker text-gold/80">{kicker}</p>
          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-4xl leading-[1.05] tracking-[0.012em] text-cream sm:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/50">
            {body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Link href={section?.ctaHref || "/about"} className="link-editorial font-mono text-[14px] tracking-[0.14em] text-gold hover:text-gold-bright">
              {section?.ctaLabel || "Read the philosophy"}
            </Link>
            <Link href={copy.heroPrimaryCtaHref || "/learn"} className="btn-primary">
              {copy.heroPrimaryCta || "Start learning"}
            </Link>
          </div>
        </div>
        <div className="dual-rule" />
      </div>
    </section>
  );
}
