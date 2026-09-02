import Link from "next/link";
import TechnologyOrbit from "./TechnologyOrbit";
import { getBrandConfig, getPlatformCopy, type TopicConfig } from "@/lib/config";
import { getBrandShortName } from "@/lib/brand";

export interface HeroMode {
  id: string;
  label: string;
  href: string;
}

interface HeroSectionProps {
  topics: TopicConfig[];
  focusTopic?: TopicConfig | null;
  tone?: "focus" | "discovery";
  modes?: HeroMode[];
}

export default function HeroSection({
  topics,
  focusTopic = null,
  tone = "discovery",
  modes = [],
}: HeroSectionProps) {
  const copy = getPlatformCopy();
  const brand = getBrandConfig();
  const focused = tone === "focus" && focusTopic;
  const shortName = getBrandShortName(brand);

  const description = focused
    ? `Learn ${focusTopic.name} from first principles — ${focusTopic.description}`
    : copy.heroDescription;

  const primaryHref = focused ? `/topics/${focusTopic.slug}` : copy.heroPrimaryCtaHref;
  const primaryLabel = focused ? `Start ${focusTopic.shortName}` : copy.heroPrimaryCta;

  const readMode = modes.find((m) => m.id === "read");
  const buildMode = modes.find((m) => m.id === "build");
  const secondary =
    readMode && buildMode
      ? { label: copy.heroSecondaryCta || "Read & build", href: readMode.href }
      : readMode
        ? { label: "Read a guide", href: readMode.href }
        : buildMode
          ? { label: "See a project", href: buildMode.href }
          : null;

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="flex flex-col space-y-7 text-left lg:col-span-7">
            <p className="kicker text-gold/85">{copy.heroBadge}</p>

            <div>
              <h1 className="font-serif text-[2.75rem] leading-[0.95] tracking-[0.012em] text-cream sm:text-6xl lg:text-7xl xl:text-[5rem]">
                {copy.heroTitle}
              </h1>
              <p className="mt-4 max-w-xl font-serif text-xl italic tracking-[0.02em] text-cream/55 sm:text-2xl">
                {copy.heroTagline}
              </p>
            </div>

            <p className="max-w-xl text-[17px] leading-relaxed text-cream/60 sm:text-lg">
              {description}
            </p>

            {modes.length > 0 ? (
              <nav aria-label="Modes" className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {modes.map((mode, i) => (
                  <span key={mode.id} className="contents">
                    {i > 0 ? (
                      <span className="text-cream/25" aria-hidden="true">
                        /
                      </span>
                    ) : null}
                    <Link
                      href={mode.href}
                      className="link-editorial font-mono text-[14px] tracking-[0.16em] uppercase text-cream/70 hover:text-gold"
                    >
                      {mode.label}
                    </Link>
                  </span>
                ))}
              </nav>
            ) : null}

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 bg-cream px-6 py-3 text-[14px] font-medium tracking-[0.04em] text-ink transition hover:bg-gold-bright"
              >
                {primaryLabel}
              </Link>
              {secondary ? (
                <Link
                  href={secondary.href}
                  className="link-editorial font-mono text-[14px] tracking-[0.12em] text-cream/65 hover:text-circuit-bright"
                >
                  {secondary.label} →
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <TechnologyOrbit topics={topics} brandName={shortName} />
          </div>
        </div>
      </div>
    </section>
  );
}
