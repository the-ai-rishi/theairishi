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
    <div>
      <p className="chapter-copy">{body}</p>
      <div className="mt-4">
        <DestinationLinks destinations={destinations} />
      </div>
    </div>
  );
}
