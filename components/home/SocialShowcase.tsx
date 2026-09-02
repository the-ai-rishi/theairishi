import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { getSocialPlatforms, type SocialPlatform } from "@/lib/config";

type IconProps = { className?: string };
type IconComponent = ComponentType<IconProps>;

interface PlatformTheme {
  icon: IconComponent;
  iconWrap: string;
  hover: string;
  badge: string;
  link: string;
  titleHover: string;
}

const THEMES: Record<string, PlatformTheme> = {
  youtube: {
    icon: YouTubeIcon,
    iconWrap: "border-red-500/20 bg-red-500/10 text-red-400",
    hover: "hover:border-red-500/30",
    badge: "border-red-500/20 bg-red-500/10 text-red-300",
    link: "text-red-400 hover:text-red-300",
    titleHover: "group-hover:text-red-200",
  },
  instagram: {
    icon: InstagramIcon,
    iconWrap: "border-pink-500/20 bg-pink-500/10 text-pink-400",
    hover: "hover:border-pink-500/30",
    badge: "border-pink-500/20 bg-pink-500/10 text-pink-300",
    link: "text-pink-400 hover:text-pink-300",
    titleHover: "group-hover:text-pink-200",
  },
};

const DEFAULT_THEME: PlatformTheme = {
  icon: Sparkles,
  iconWrap: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  hover: "hover:border-violet-500/30",
  badge: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  link: "text-violet-400 hover:text-violet-300",
  titleHover: "group-hover:text-violet-200",
};

function themeFor(id: string): PlatformTheme {
  return THEMES[id] ?? DEFAULT_THEME;
}

export default function SocialShowcase() {
  const platforms = getSocialPlatforms();
  if (platforms.length === 0) return null;

  const heading = platforms.map((p) => p.displayName || p.label).join(" · ");

  return (
    <section className="py-12 sm:py-16 bg-white/[0.01] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Multi-Channel Ecosystem</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
            {heading}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/50 leading-relaxed">
            Follow along in the formats that fit how you learn. Channels that are not live yet show a Coming Soon badge.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {platforms.map((platform: SocialPlatform) => {
            const theme = themeFor(platform.id);
            const Icon = theme.icon;
            const comingSoon = platform.status !== "active";
            return (
              <div
                key={platform.id}
                className={`group rounded-3xl border border-white/[0.08] bg-black/40 p-8 flex flex-col justify-between transition duration-300 ${theme.hover}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconWrap}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-wider ${comingSoon ? "border-white/10 bg-white/[0.03] text-white/50" : theme.badge}`}>
                      {comingSoon ? "Coming Soon" : platform.badge ?? platform.label}
                    </span>
                  </div>

                  <h3 className={`mt-6 text-2xl font-semibold text-white transition ${theme.titleHover}`}>
                    {platform.displayName ?? platform.label}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed">
                    {platform.description ?? "Updates from this channel will appear here when it goes live."}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href={platform.href}
                    className={`inline-flex items-center gap-2 text-xs font-semibold transition ${theme.link}`}
                  >
                    <span>{comingSoon ? "View channel page" : "Browse channel"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
