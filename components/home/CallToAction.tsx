import Link from "next/link";
import { getPlatformCopy } from "@/lib/config";
import { getLearnerCatalog, getProgram } from "@/lib/programs";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SmartCta from "@/components/learning/SmartCta";

export default function CallToAction({ section }: { section?: ResolvedHomepageSection }) {
  const copy = getPlatformCopy();
  const program = getProgram();
  const catalog = getLearnerCatalog(program.id);
  const body = program.outcome || program.description;
  return (
    <div id="close" className="closing">
      <p className="chapter-copy">{body}</p>
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
  );
}
