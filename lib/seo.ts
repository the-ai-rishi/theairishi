import { getBrandConfig } from "./config";
import { siteConfig } from "./site";

export function organizationJsonLd() {
  const brand = getBrandConfig();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: siteConfig.url,
    email: brand.email,
    logo: `${siteConfig.url}${brand.logoMark || brand.logo}`,
    description: brand.description,
    slogan: brand.tagline,
  };
}

export function websiteJsonLd() {
  const brand = getBrandConfig();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: siteConfig.url,
    description: brand.description,
    publisher: {
      "@type": "Organization",
      name: brand.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
