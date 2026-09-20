import type { Metadata } from "next";
import PageShell from "@/components/brand/PageShell";
import ProgramOverview from "@/components/learning/ProgramOverview";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
  isContentTypeRoutable,
} from "@/lib/config";
import { getProgram, getPublishedProgramDays } from "@/lib/programs";
import { canonicalAlternates, canonicalUrl } from "@/lib/urls";
import { courseJsonLd, shareImages, shareTwitterImages } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const program = getProgram();
  return {
    title: program.title,
    description: program.description,
    alternates: canonicalAlternates("/learn"),
    openGraph: {
      title: program.title,
      description: program.description,
      type: "website",
      images: shareImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: program.title,
      description: program.description,
      images: shareTwitterImages(),
    },
  };
}

export default function LearnPage() {
  if (!isContentTypeRoutable("learn")) notFound();
  const program = getProgram();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const published = getPublishedProgramDays(program.id);
  const jsonLd = courseJsonLd({
    name: program.title,
    description: program.description,
    url: canonicalUrl("/learn"),
    numberOfLessons: published.length,
  });

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgramOverview program={program} />
    </PageShell>
  );
}
