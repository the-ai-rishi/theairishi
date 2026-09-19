import Link from "next/link";
import { getPlatformCopy } from "@/lib/config";
import { getLearnerCatalog, getProgram } from "@/lib/programs";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SmartCta from "@/components/learning/SmartCta";

export default function CallToAction({ section }: { section?: ResolvedHomepageSection }) {
  const copy = getPlatformCopy();
  const program = getProgram();
  const catalog = getLearnerCatalog(program.id);
  const title = section?.title || "Start at Day 1";
  const kicker = section?.subtitle || program.durationLabel;
  const body = program.outcome || program.description;

  return (
    <section id="close" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="dual-rule" />
        <div className="py-12 text-center sm:py-14">
          <p className="kicker text-gold/80">{kicker}</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-[1.05] tracking-[0.012em] text-cream sm:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-cream/50 sm:text-[17px]">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:mt-10 sm:gap-6">
            <SmartCta
              catalog={catalog}
              fallbackLabel={section?.ctaLabel || copy.heroPrimaryCta || "Start Day 1"}
              fallbackHref={section?.ctaHref || copy.heroPrimaryCtaHref || "/learn/day-01"}
            />
            <Link
              href={copy.heroSecondaryCtaHref || "/learn"}
              className="link-editorial font-mono text-[14px] tracking-[0.14em] text-gold hover:text-gold-bright"
            >
              {copy.heroSecondaryCta || "Explore the 120-day plan"}
            </Link>
          </div>
        </div>
        <div className="dual-rule" />
      </div>
    </section>
  );
}
