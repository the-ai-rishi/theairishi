import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import TechnologyOrbit from "./TechnologyOrbit";
import SearchModal from "@/components/search/SearchModal";
import { getBrandConfig, getPlatformCopy, type TopicConfig } from "@/lib/config";

interface HeroSectionProps {
  topics: TopicConfig[];
  focusTopic?: TopicConfig | null;
  tone?: "focus" | "discovery";
}

export default function HeroSection({
  topics,
  focusTopic = null,
  tone = "discovery",
}: HeroSectionProps) {
  const copy = getPlatformCopy();
  const brand = getBrandConfig();
  const focused = tone === "focus" && focusTopic;

  const description = focused
    ? `Learn ${focusTopic.name} from first principles — ${focusTopic.description}`
    : copy.heroDescription;

  const primaryHref = focused ? `/topics/${focusTopic.slug}` : copy.heroPrimaryCtaHref;
  const primaryLabel = focused ? `Start ${focusTopic.shortName}` : copy.heroPrimaryCta;
  const secondaryHref = topics.length > 0 ? "#topics" : copy.heroSecondaryCtaHref;
  const secondaryLabel = focused ? "View course" : copy.heroSecondaryCta;

  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              <span>{copy.heroBadge}</span>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              {copy.heroTitle} <br />
              <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                {copy.heroTagline}
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-xl leading-relaxed">
              {description}
            </p>

            {topics.length > 0 && (
              <p className="text-xs font-mono uppercase tracking-widest text-white/35">
                {topics.map((t) => t.shortName || t.name).join("  ·  ")}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:bg-white/90 shadow-lg shadow-white/5"
              >
                <span>{primaryLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 transition duration-300 hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
              >
                <span>{secondaryLabel}</span>
              </Link>

              <SearchModal />
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <TechnologyOrbit topics={topics} brandName={brand.name} />
          </div>
        </div>
      </div>
    </section>
  );
}
