import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import type { SocialPlatform } from "@/lib/config";
import type { ResolvedHomepageSection } from "@/lib/homepage";

export default function ChannelGrid({
  section,
  channels,
}: {
  section: ResolvedHomepageSection;
  channels: SocialPlatform[];
}) {
  if (!channels.length) return null;
  const title = section.title ?? "Channels";
  const subtitle = section.subtitle ?? "Media";

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
            <Radio className="h-3.5 w-3.5" />
            <span>{subtitle}</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
            {title}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => (
            <Link
              key={channel.id}
              href={channel.href}
              className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-white/50">
                  {channel.badge || channel.label}
                </span>
                <ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-violet-300" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-amber-200 transition">
                {channel.displayName || channel.label}
              </h3>
              {channel.description ? (
                <p className="mt-2 text-xs text-white/50 leading-relaxed">{channel.description}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
