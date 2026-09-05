import { getBrandConfig, getMainNavigation, getFooterNavigation, getSocialPlatforms, getSearchTopics } from "./config";

function buildSiteConfig() {
  const brand = getBrandConfig();
  const socialPlatforms = getSocialPlatforms();

  const socialMap: Record<string, string> = {};
  for (const platform of socialPlatforms) {
    if (platform.externalUrl && platform.status === "active") {
      socialMap[platform.id] = platform.externalUrl;
    }
  }

  const publicTopics = getSearchTopics();

  return {
    name: brand.name,
    tagline: brand.tagline,
    description: brand.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || brand.url,
    author: {
      name: brand.name,
      role: brand.tagline,
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
        [brand.name, brand.tagline, ...publicTopics.flatMap((t) => [t.name, t.shortName, t.badge])].filter(
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
