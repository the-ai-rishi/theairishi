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
    <section id="close" className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="panel flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="min-w-0 max-w-xl">
            <p className="kicker text-gold/80">{kicker}</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] text-cream sm:text-4xl">{title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-cream/50">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
            <SmartCta
              catalog={catalog}
              fallbackLabel={section?.ctaLabel || copy.heroPrimaryCta || "Start Day 1"}
              fallbackHref={section?.ctaHref || copy.heroPrimaryCtaHref || "/learn/day-01"}
              className="btn-primary btn-block"
            />
            <Link
              href={copy.heroSecondaryCtaHref || "/learn"}
              className="link-editorial self-center font-mono text-[13px] tracking-[0.14em] text-gold hover:text-gold-bright sm:self-end"
            >
              {copy.heroSecondaryCta || "Explore the 120-day plan"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
