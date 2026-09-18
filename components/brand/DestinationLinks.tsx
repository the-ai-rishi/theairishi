import type { ComponentType } from "react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import {
  getDestinationUrl,
  getPublicDestinations,
  type SocialPlatform,
} from "@/lib/config";
import { isTemporaryDestination } from "@/lib/social";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-3.5 w-3.5"} aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.79 8.21 10.37.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-3.5 w-3.5"} aria-hidden="true">
      <path d="M21.5 3.3 2.9 10.5c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.6.9.4 0 .6-.2.8-.4l2.7-2.6 5.2 3.8c1 .6 1.7.3 1.9-.9l3.4-16c.3-1.3-.5-1.9-1.3-1.6z" />
    </svg>
  );
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  github: GitHubIcon,
  youtube: YouTubeIcon,
};

export default function DestinationLinks({
  surface,
  destinations,
  compact = false,
}: {
  surface?: "footer" | "homepage" | "header" | "about";
  destinations?: SocialPlatform[];
  compact?: boolean;
}) {
  const items = destinations || getPublicDestinations(surface);
  if (!items.length) return null;

  return (
    <ul
      className={`flex flex-wrap ${
        compact ? "gap-x-5 gap-y-2 lg:justify-end" : "gap-x-6 gap-y-3"
      }`}
    >
      {items.map((channel) => {
        const href = getDestinationUrl(channel);
        if (!href) return null;
        const Icon = ICONS[channel.id];
        const temporary = isTemporaryDestination(channel);
        const label = temporary
          ? `${channel.label} · Placeholder`
          : channel.ctaLabel
            ? `${channel.label} · ${channel.ctaLabel}`
            : channel.label;
        const shown = compact && !temporary ? channel.label : label;
        return (
          <li key={channel.id}>
            <a
              href={href}
              target="_blank"
              rel={temporary ? "noopener noreferrer nofollow" : "noopener noreferrer"}
              title={
                temporary
                  ? "Temporary placeholder — not a real Telegram community yet. Replace url with https://t.me/..."
                  : undefined
              }
              aria-label={temporary ? `${channel.label} (temporary placeholder)` : undefined}
              className="link-editorial inline-flex min-h-11 items-center gap-2 font-mono text-[12px] tracking-[0.14em] text-cream/55 hover:text-gold"
            >
              {Icon ? <Icon className="h-3.5 w-3.5 text-gold/80" /> : null}
              <span>{shown}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
