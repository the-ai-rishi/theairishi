import SectionHeading from "@/components/brand/SectionHeading";
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
    section.body ||
    "Daily posts go on Instagram. The structured plan stays here.";

  return (
    <section className="scroll-mt-24 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Elsewhere"}
          title={section.title || "Around the work"}
        />
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-cream/45">{body}</p>
        <div className="mt-6">
          <DestinationLinks destinations={destinations} />
        </div>
      </div>
    </section>
  );
}
