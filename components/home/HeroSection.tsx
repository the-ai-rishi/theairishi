import Link from "next/link";
import { getBrandConfig, getPlatformCopy, type TopicConfig } from "@/lib/config";
import BrandMark from "@/components/brand/BrandMark";

export interface HeroMode {
  id: string;
  label: string;
  href: string;
}

interface HeroSectionProps {
  topics?: TopicConfig[];
  focusTopic?: TopicConfig | null;
  tone?: "focus" | "discovery";
  modes?: HeroMode[];
}

export default function HeroSection({}: HeroSectionProps) {
  const copy = getPlatformCopy();
  const brand = getBrandConfig();

  const secondaryLabel = copy.heroSecondaryCta;
  const secondaryHref = copy.heroSecondaryCtaHref;
  const secondary = secondaryLabel && secondaryHref ? { label: secondaryLabel, href: secondaryHref } : null;

  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="dual-rule mb-10" />
        <p className="kicker text-gold/85">{copy.heroBadge}</p>
        <div className="mt-5 flex items-center gap-3">
          <BrandMark className="h-9 w-9 shrink-0 text-gold" />
          <h1 className="display">{copy.heroTitle}</h1>
        </div>
        {copy.heroTagline ? (
          <p className="mt-5 max-w-xl font-serif text-xl italic tracking-[0.02em] text-cream/55 sm:text-2xl">
            {copy.heroTagline}
          </p>
        ) : null}
        <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-cream/65 sm:text-lg">
          {copy.heroDescription}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Link href={copy.heroPrimaryCtaHref || "/learn/day-01"} className="btn-primary">
            {copy.heroPrimaryCta || "Start Day 1"}
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="link-editorial font-mono text-[14px] tracking-[0.12em] text-cream/65 hover:text-gold"
            >
              {secondary.label} →
            </Link>
          ) : null}
        </div>
        <p className="mt-8 font-mono text-[12px] tracking-[0.1em] text-cream/35">
          {brand.tagline}
        </p>
        <div className="dual-rule mt-12" />
      </div>
    </section>
  );
}
