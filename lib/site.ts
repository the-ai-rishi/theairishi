import { getBrandConfig, getMainNavigation, getFooterNavigation, getSocialPlatforms } from "./config";

/**
 * siteConfig
 *
 * All values derived from content/config/platform.json via getBrandConfig().
 * Do NOT hardcode site name, tagline, URLs, or social URLs here.
 * Change them in platform.json → "brand" and "social" sections.
 */
function buildSiteConfig() {
  const brand = getBrandConfig();
  const socialPlatforms = getSocialPlatforms();

  // Build a keyed social map for easy access by id (e.g. siteConfig.social.youtube)
  const socialMap: Record<string, string> = {};
  for (const platform of socialPlatforms) {
    if (platform.externalUrl) {
      socialMap[platform.id] = platform.externalUrl;
    }
  }

  return {
    name: brand.name,
    tagline: brand.tagline,
    description: brand.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || brand.url || "https://theairishi.com",
    author: {
      name: brand.name,
      role: "AI & Platform Engineer",
      bio: brand.description,
      email: brand.email,
    },
    brand: {
      logo: brand.logo,
      logoAlt: brand.logoAlt,
      logoMark: brand.logoMark,
      ogImage: brand.ogImage,
    },
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
