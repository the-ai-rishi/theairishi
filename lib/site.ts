import { getBrandConfig, getMainNavigation, getFooterNavigation, getSocialPlatforms, getSearchTopics, getDefaultsConfig } from "./config";
import { getSiteOrigin } from "./urls";

function buildSiteConfig() {
  const brand = getBrandConfig();
  const defaults = getDefaultsConfig();
  const socialPlatforms = getSocialPlatforms();

  const socialMap: Record<string, string> = {};
  for (const platform of socialPlatforms) {
    if (platform.externalUrl && platform.status === "active") {
      socialMap[platform.id] = platform.externalUrl;
    }
  }

  const publicTopics = getSearchTopics();
  const tagline = brand.tagline?.trim() || "";

  return {
    name: brand.name,
    tagline,
    description: brand.description,
    url: getSiteOrigin(),
    author: {
      name: defaults.authorName,
      role: brand.description,
      bio: brand.description,
      email: brand.email,
    },
    brand: {
      logo: brand.logo,
      logoAlt: brand.logoAlt,
      logoMark: brand.logoMark,
      ogImage: brand.ogImage,
    },
    keywords: Array.from(
      new Set(
        [brand.name, ...publicTopics.flatMap((t) => [t.name, t.shortName, t.badge])].filter(
          Boolean
        )
      )
    ),
    social: {
      ...socialMap,
      email: brand.email,
    } as Record<string, string | undefined>,
    get navigation() {
      return {
        main: getMainNavigation().map((item) => ({ name: item.label, href: item.href })),
        footer: getFooterNavigation().map((item) => ({ name: item.label, href: item.href })),
      };
    },
  };
}

export const siteConfig = buildSiteConfig();
