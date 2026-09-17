import Link from "next/link";
import { getPlatformCopy, type TopicConfig } from "@/lib/config";
import { getProgram } from "@/lib/programs";
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
  const program = getProgram();

  const secondaryLabel = copy.heroSecondaryCta;
  const secondaryHref = copy.heroSecondaryCtaHref;
  const secondary = secondaryLabel && secondaryHref ? { label: secondaryLabel, href: secondaryHref } : null;

  return (
    <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="dual-rule mb-8 sm:mb-10" />
        <div className="flex items-center gap-3">
          <BrandMark className="h-7 w-7 shrink-0 text-gold sm:h-8 sm:w-8" />
          <p className="kicker text-gold/85">{copy.heroBadge || "The AI Rishi"}</p>
        </div>
        <h1 className="mt-5 font-serif text-[2.35rem] leading-[0.95] tracking-[0.01em] text-cream sm:text-6xl lg:text-7xl">
          {program.title}
        </h1>
        <p className="mt-4 font-mono text-[13px] tracking-[0.12em] text-gold/80 sm:text-[14px]">
          {program.durationLabel}
        </p>
        {program.outcome ? (
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-cream/70 sm:text-[17px]">
            {program.outcome}
          </p>
        ) : null}
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/55 sm:text-[17px]">
          {copy.heroDescription}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5 sm:mt-9 sm:gap-6">
          <Link href={copy.heroPrimaryCtaHref || program.startHref || "/learn/day-01"} className="btn-primary">
            {copy.heroPrimaryCta || "Start Day 1"}
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="link-editorial min-h-11 inline-flex items-center font-mono text-[14px] tracking-[0.12em] text-cream/65 hover:text-gold"
            >
              {secondary.label} →
            </Link>
          ) : null}
        </div>
        <div className="dual-rule mt-10 sm:mt-12" />
      </div>
    </section>
  );
}
