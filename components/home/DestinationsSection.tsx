import DestinationLinks from "@/components/brand/DestinationLinks";
import type { SocialPlatform } from "@/lib/config";
import type { ResolvedHomepageSection } from "@/lib/homepage";

export default function DestinationsSection({
  section,
  destinations,
}: {
  section: ResolvedHomepageSection;
  destinations: SocialPlatform[];
}) {
  if (!destinations.length) return null;
  const body =
    section.body || "Daily posts go on Instagram. The structured plan stays here.";

  return (
    <section className="scroll-mt-24 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="panel p-5 sm:p-7">
          <p className="kicker text-gold/80">{section.subtitle || "Elsewhere"}</p>
          <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">
            {section.title || "Around the work"}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-cream/45">{body}</p>
          <div className="mt-5">
            <DestinationLinks destinations={destinations} />
          </div>
        </div>
      </div>
    </section>
  );
}
