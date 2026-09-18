import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllGuideSlugs, getGuide } from "@/lib/guides";
import LessonContent from "@/components/learning/LessonContent";
import { getBrandConfig, getFooterNavigation, getMainNavigation, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import PageShell from "@/components/brand/PageShell";
import ExistingNotesNote from "@/components/content/ExistingNotesNote";
import { articleJsonLd } from "@/lib/seo";
import { canonicalAlternates, canonicalUrl } from "@/lib/urls";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!isContentTypeRoutable("guides")) return [];
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return { title: "Guide not found" };
  }

  return {
    title: guide.metadata.title,
    description: guide.metadata.description,
    openGraph: {
      title: guide.metadata.title,
      description: guide.metadata.description,
      type: "article",
    },
    alternates: canonicalAlternates(`/guides/${slug}`),
  };
}

export default async function GuideSinglePage({ params }: GuidePageProps) {
  const { slug } = await params;
  if (!isContentTypeRoutable("guides")) notFound();
  const guide = await getGuide(slug);
  const brand = getBrandConfig();

  if (!guide) {
    notFound();
  }

  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const copy = getPlatformCopy();
  const jsonLd = articleJsonLd({
    title: guide.metadata.title,
    description: guide.metadata.description,
    url: canonicalUrl(`/guides/${slug}`),
    datePublished: guide.metadata.date,
  });

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mb-6 flex items-center gap-3 font-mono text-xs text-cream/40">
          <span className="uppercase tracking-[0.16em] text-gold">
            {guide.metadata.category}
          </span>
          <span>{guide.metadata.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {guide.metadata.readTime || 5} min read
          </span>
        </div>

        <h1 className="font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl lg:text-6xl">
          {guide.metadata.title}
        </h1>

        <p className="mt-6 border-b border-hairline pb-10 text-base leading-relaxed text-cream/50 sm:text-lg">
          {guide.metadata.description}
        </p>
        <div className="pt-6">
          <ExistingNotesNote topicKey={guide.metadata.topic || guide.metadata.topicSlug} />
        </div>

        <div className="pt-10">
          <LessonContent content={guide.content} />
        </div>
      </article>
    </PageShell>
  );
}
