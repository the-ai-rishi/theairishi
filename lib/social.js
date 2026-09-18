"use strict";

/**
 * Canonical social / destination rules.
 *
 * Internal channels (YouTube listing, future on-site carousels) stay
 * site routes and still need real items before they are public.
 * External destinations (Instagram, Telegram, GitHub) are outbound
 * https URLs. They never create a /instagram-style fake surface.
 *
 * Do not invent Telegram URLs or Instagram posts.
 */

const STATUS_ALIASES = {
  published: "active",
  publish: "active",
  live: "active",
  draft: "planned",
  hidden: "disabled",
  off: "disabled",
};

const LIFECYCLE_STATUSES = [
  "planned",
  "coming-soon",
  "active",
  "paused",
  "disabled",
  "archived",
];

const PLACEHOLDER_RE =
  /example\.com|placeholder|your-real-|your-community|changeme|\btodo\b|fixme|t\.me\/your/i;

const INSTAGRAM_PROFILE_RE = /^https:\/\/(?:www\.)?instagram\.com\/theairishi\/?(?:[?#].*)?$/i;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeStatus(status) {
  if (status == null || status === "") return "active";
  const raw = String(status).trim().toLowerCase();
  if (STATUS_ALIASES[raw]) return STATUS_ALIASES[raw];
  return raw;
}

function isValidLifecycle(status) {
  return LIFECYCLE_STATUSES.includes(normalizeStatus(status));
}

function isHttpsUrl(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!/^https:\/\//i.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function isInternalHref(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

function isPlaceholderUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  const trimmed = value.trim();
  if (PLACEHOLDER_RE.test(trimmed)) return true;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname.replace(/\/+$/, "");
    if (host === "instagram.com" && (!path || path === "/")) return true;
    if ((host === "youtube.com" || host === "youtu.be") && (!path || path === "/")) return true;
    if (host === "t.me" && (!path || path === "/")) return true;
    if (host === "github.com" && (!path || path === "/")) return true;
  } catch {
    return true;
  }
  return false;
}

function channelKind(channel) {
  if (!channel || typeof channel !== "object") return "internal";
  if (channel.kind === "external" || channel.kind === "internal") return channel.kind;
  if (isInternalHref(channel.href)) return "internal";
  if (isHttpsUrl(channel.url) || isHttpsUrl(channel.externalUrl)) return "external";
  return "internal";
}

function rawDestinationUrl(channel) {
  if (!channel || typeof channel !== "object") return "";
  if (isHttpsUrl(channel.url)) return String(channel.url).trim();
  if (isHttpsUrl(channel.externalUrl)) return String(channel.externalUrl).trim();
  return typeof channel.url === "string" ? channel.url.trim() : "";
}

function destinationUrl(channel) {
  if (channelKind(channel) !== "external") return "";
  const url = rawDestinationUrl(channel);
  return isHttpsUrl(url) && !isPlaceholderUrl(url) ? url : "";
}

function isEnabledChannel(channel) {
  if (!channel || typeof channel !== "object") return false;
  if (channel.enabled === false) return false;
  if (typeof channel.enabled === "string" && channel.enabled.trim().toLowerCase() === "false") {
    return false;
  }
  return true;
}

function isPublicDestination(channel) {
  if (!isEnabledChannel(channel)) return false;
  if (normalizeStatus(channel.status || "active") !== "active") return false;
  if (channelKind(channel) !== "external") return false;
  return Boolean(destinationUrl(channel));
}

function showDestinationOn(channel, surface) {
  if (!isPublicDestination(channel)) return false;
  if (surface === "footer") return channel.showInFooter !== false;
  if (surface === "homepage") return channel.showOnHomepage !== false;
  if (surface === "header") return channel.showInHeader === true;
  if (surface === "about") return channel.showOnAbout !== false;
  return true;
}

function publicDestinations(platform, surface) {
  const list = ((platform && platform.social) || []).filter((channel) =>
    surface ? showDestinationOn(channel, surface) : isPublicDestination(channel)
  );
  return list.slice().sort((a, b) => (a.order || 99) - (b.order || 99));
}

function includeInSameAs(channel) {
  return isPublicDestination(channel) && channel.includeInSameAs !== false;
}

function sameAsUrls(platform, extra) {
  const fromSocial = publicDestinations(platform)
    .filter(includeInSameAs)
    .map((channel) => destinationUrl(channel))
    .filter(Boolean);
  const extras = Array.isArray(extra)
    ? extra.filter((item) => isHttpsUrl(item) && !isPlaceholderUrl(item))
    : [];
  const seen = new Set();
  const out = [];
  for (const url of fromSocial.concat(extras)) {
    const key = String(url).replace(/\/+$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(url);
  }
  return out;
}

function isInternalChannel(channel) {
  return channelKind(channel) === "internal";
}

function collectSocialErrors(social) {
  const errors = [];
  if (social == null) return errors;
  if (!Array.isArray(social)) {
    errors.push("platform.json social must be an array");
    return errors;
  }

  const ids = new Set();
  for (const channel of social) {
    if (!channel || typeof channel !== "object") {
      errors.push("social items must be objects");
      continue;
    }
    if (!isNonEmptyString(channel.id) || !isNonEmptyString(channel.label)) {
      errors.push("social items require id and label");
      continue;
    }
    if (ids.has(channel.id)) {
      errors.push("Duplicate social id: " + channel.id);
    }
    ids.add(channel.id);

    if (channel.kind != null && channel.kind !== "external" && channel.kind !== "internal") {
      errors.push("social '" + channel.id + "' kind must be external or internal");
    }
    if (!isValidLifecycle(channel.status || "active")) {
      errors.push("social '" + channel.id + "' has invalid status: " + channel.status);
    }

    const kind = channelKind(channel);
    const enabled = isEnabledChannel(channel);
    const status = normalizeStatus(channel.status || "active");
    const url = typeof channel.url === "string" ? channel.url.trim() : "";
    const externalUrl =
      typeof channel.externalUrl === "string" ? channel.externalUrl.trim() : "";
    const combined = url || externalUrl;

    if (kind === "internal") {
      if (enabled && status === "active" && !isInternalHref(channel.href)) {
        errors.push(
          "social '" +
            channel.id +
            "' is an internal channel and needs href (a site path such as /youtube) before it can be active"
        );
      }
      if (combined && !isHttpsUrl(combined) && combined !== "") {
        errors.push("social '" + channel.id + "' external URL must be https when set");
      }
      if (combined && isPlaceholderUrl(combined)) {
        errors.push("social '" + channel.id + "' has a placeholder URL. Use a real profile URL or leave it empty.");
      }
    } else {
      if (channel.href && isInternalHref(channel.href) && enabled && status === "active") {
        errors.push(
          "social '" +
            channel.id +
            "' is an external destination. Do not give it an on-site href such as /instagram. Put the real https URL in url."
        );
      }
      if (enabled && status === "active") {
        if (!combined) {
          errors.push(
            "social '" +
              channel.id +
              "' is enabled and active but has no URL. Paste the real https URL or set enabled to false."
          );
        } else if (!isHttpsUrl(combined)) {
          errors.push("social '" + channel.id + "' URL must be https");
        } else if (isPlaceholderUrl(combined)) {
          errors.push(
            "social '" +
              channel.id +
              "' URL looks like a placeholder. Use the real profile URL or keep the channel disabled."
          );
        }
      } else if (combined && combined !== "" && !isHttpsUrl(combined)) {
        errors.push("social '" + channel.id + "' URL must be https when set");
      } else if (combined && isPlaceholderUrl(combined)) {
        errors.push(
          "social '" +
            channel.id +
            "' URL looks like a placeholder. Leave url empty until the real destination exists."
        );
      }
    }

    if (channel.id === "instagram" && enabled && status === "active") {
      const dest = combined || destinationUrl(channel);
      if (dest && !INSTAGRAM_PROFILE_RE.test(dest)) {
        errors.push(
          "social 'instagram' must use the real profile https://www.instagram.com/theairishi/ (no invented posts, no /instagram site route)"
        );
      }
    }

    if (channel.id === "telegram" && enabled && status === "active") {
      if (!combined) {
        errors.push(
          "social 'telegram' is enabled but url is empty. Paste the real https://t.me/... URL or keep enabled false."
        );
      }
    }
  }

  return errors;
}

module.exports = {
  isHttpsUrl,
  isInternalHref,
  isPlaceholderUrl,
  channelKind,
  destinationUrl,
  isEnabledChannel,
  isPublicDestination,
  showDestinationOn,
  publicDestinations,
  includeInSameAs,
  sameAsUrls,
  isInternalChannel,
  collectSocialErrors,
  INSTAGRAM_PROFILE_RE,
};
