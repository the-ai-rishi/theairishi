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
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  const brand = getBrandConfig();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    image: input.image ? `${siteConfig.url}${input.image}` : `${siteConfig.url}${brand.ogImage}`,
    author: {
      "@type": "Organization",
      name: brand.name,
    },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${brand.logoMark || brand.logo}`,
      },
    },
    mainEntityOfPage: input.url,
  };
}
