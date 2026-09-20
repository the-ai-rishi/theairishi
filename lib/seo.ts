import { getBrandConfig, getDefaultsConfig, getSameAsUrls } from "./config";
import { canonicalUrl, getSiteOrigin } from "./urls";

function personJsonLd() {
  const brand = getBrandConfig();
  const defaults = getDefaultsConfig();
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: defaults.authorName,
    url: defaults.authorUrl || getSiteOrigin(),
  };
  if (brand.email) person.email = brand.email;
  if (brand.shortName && brand.shortName !== defaults.authorName) {
    person.alternateName = brand.shortName;
  }
  const sameAs = getSameAsUrls();
  if (sameAs.length) person.sameAs = sameAs;
  return person;
}

export function publisherJsonLd() {
  return personJsonLd();
}

/** Public Person for JSON-LD. Name comes from defaults.authorName - an explicit operator choice, not inferred. */
export function creatorJsonLd() {
  return {
    "@context": "https://schema.org",
    ...personJsonLd(),
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

/** Child openGraph objects replace the layout images unless they repeat them. */
export function shareImages() {
  const brand = getBrandConfig();
  return [
    {
      url: brand.ogImage || "/brand/og-image.jpg",
      width: 1200,
      height: 630,
      alt: brand.name,
    },
  ];
}

export function shareTwitterImages() {
  const brand = getBrandConfig();
  return [brand.ogImage || "/brand/og-image.jpg"];
}

export function courseJsonLd(input: {
  name: string;
  description: string;
  url: string;
  numberOfLessons?: number;
}) {
  const person = personJsonLd();
  const pageUrl = input.url.startsWith("http") ? input.url : canonicalUrl(input.url);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: pageUrl,
    isAccessibleForFree: true,
    provider: person,
    ...(typeof input.numberOfLessons === "number"
      ? {
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: `${input.numberOfLessons} published lessons`,
          },
        }
      : {}),
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
