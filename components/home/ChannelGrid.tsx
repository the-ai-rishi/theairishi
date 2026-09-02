import Link from "next/link";
import SectionHeading from "@/components/brand/SectionHeading";
import type { SocialPlatform } from "@/lib/config";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import { sectionAnchorId } from "@/lib/presentation";

export default function ChannelGrid({
  section,
  channels,
}: {
  section: ResolvedHomepageSection;
  channels: SocialPlatform[];
}) {
  if (!channels.length) return null;
  const title = section.title ?? "On air";
  const subtitle = section.subtitle ?? "Media";

  return (
    <section
      id={sectionAnchorId("channel-grid")}
      className="scroll-mt-24 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading kicker={subtitle} title={title} />
        <div className="mt-8 flex gap-5 overflow-x-auto pb-2">
          {channels.map((channel) => (
            <Link
              key={channel.id}
              href={channel.href}
              className="group w-[280px] shrink-0 sm:w-[340px]"
            >
              <div className="relative aspect-video overflow-hidden border border-hairline bg-field">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-circuit/15" />
                <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/35" />
                <span
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 border-y-[8px] border-l-[14px] border-y-transparent border-l-cream/85"
                  style={{ marginLeft: "2px" }}
                />
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-circuit-bright">
                {channel.badge || channel.label}
              </p>
              <h3 className="mt-1 font-serif text-2xl text-cream group-hover:text-gold-bright">
                {channel.displayName || channel.label}
              </h3>
              {channel.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-cream/45">{channel.description}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
