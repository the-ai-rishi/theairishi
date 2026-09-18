import { getBrandConfig, getDefaultsConfig } from "./config";
import { canonicalUrl, getSiteOrigin } from "./urls";

function personJsonLd() {
  const brand = getBrandConfig();
  const defaults = getDefaultsConfig();
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: defaults.authorName || brand.name,
    url: getSiteOrigin(),
  };
  if (brand.email) person.email = brand.email;
  if (brand.shortName) person.alternateName = brand.shortName;
  person.sameAs = ["https://github.com/the-ai-rishi"];
  return person;
}

export function publisherJsonLd() {
  return personJsonLd();
}

export function organizationJsonLd() {
  const brand = getBrandConfig();
  const person = personJsonLd();
  return {
    "@context": "https://schema.org",
    ...person,
    description: brand.description,
  };
}

export function websiteJsonLd() {
  const brand = getBrandConfig();
  const person = personJsonLd();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: getSiteOrigin(),
    description: brand.description,
    publisher: person,
    author: person,
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
  const person = personJsonLd();
  const pageUrl = input.url.startsWith("http") ? input.url : canonicalUrl(input.url);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: pageUrl,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    image: input.image
      ? `${getSiteOrigin()}${input.image}`
      : `${getSiteOrigin()}${brand.ogImage}`,
    author: person,
    publisher: person,
    mainEntityOfPage: pageUrl,
  };
}
