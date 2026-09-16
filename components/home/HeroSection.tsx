import Link from "next/link";
import Image from "next/image";
import { getBrandConfig, getPlatformCopy, type TopicConfig } from "@/lib/config";

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
  topics = [],
  focusTopic = null,
  tone = "discovery",
  modes = [],
}: HeroSectionProps) {
  const copy = getPlatformCopy();
  const brand = getBrandConfig();
  const focused = tone === "focus" && focusTopic;
  const description = focused
    ? `Learn ${focusTopic.name} from first principles — ${focusTopic.description}`
    : copy.heroDescription;

  const primaryHref = focused ? `/topics/${focusTopic.slug}` : copy.heroPrimaryCtaHref;
  const primaryLabel = focused ? `Start ${focusTopic.shortName}` : copy.heroPrimaryCta;

  const secondaryLabel = copy.heroSecondaryCta;
  const secondaryHref = copy.heroSecondaryCtaHref || "/guides";
  const secondary = secondaryLabel ? { label: secondaryLabel, href: secondaryHref } : null;
  const liveModes = modes.slice(0, 4);
  const plateSrc = brand.logoMark || brand.logo || "/brand/logo-mark.png";

  return (
    <section className="relative overflow-hidden pt-8 pb-4 sm:pt-14 sm:pb-6 lg:pt-16 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="dual-rule" />
        <div className="grid items-center gap-10 pt-8 sm:pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-14">
          <div className="flex flex-col lg:col-span-7">
            <p className="kicker text-gold/85">{copy.heroBadge}</p>

            <h1 className="display mt-5">{copy.heroTitle}</h1>
            <p className="mt-5 max-w-xl font-serif text-xl italic tracking-[0.02em] text-cream/55 sm:text-2xl">
              {copy.heroTagline}
            </p>
            {brand.lineage ? (
              <p className="mt-2 font-mono text-[12px] tracking-[0.16em] uppercase text-cream/35">
                {brand.lineage}
              </p>
            ) : null}

            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-cream/60 sm:text-lg">
              {description}
            </p>

            {liveModes.length > 0 ? (
              <nav aria-label="What you can do today" className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                {liveModes.map((mode, i) => (
                  <span key={mode.id} className="contents">
                    {i > 0 ? (
                      <span className="text-cream/20" aria-hidden="true">
                        /
                      </span>
                    ) : null}
                    <Link
                      href={mode.href}
                      className="link-editorial font-mono text-[13px] tracking-[0.16em] uppercase text-cream/65 hover:text-gold"
                    >
                      {mode.label}
                    </Link>
                  </span>
                ))}
              </nav>
            ) : null}

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link href={primaryHref} className="btn-primary">
                {primaryLabel}
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

            {topics.length > 0 && !focused ? (
              <p className="mt-8 font-mono text-[12px] tracking-[0.1em] text-cream/35">
                Live today: {topics.map((t) => t.shortName).join(" · ")}
              </p>
            ) : null}
          </div>

          <figure className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="plate overflow-hidden bg-field">
              <Image
                src={plateSrc}
                alt=""
                width={1672}
                height={941}
                className="h-auto w-full object-contain"
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
            <figcaption className="border-x border-b border-hairline px-4 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/40">
              The mark · lotus + circuit
            </figcaption>
          </figure>
        </div>
        <div className="mt-12 dual-rule sm:mt-16" />
      </div>
    </section>
  );
}
