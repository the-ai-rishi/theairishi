import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllGuideSlugs, getGuide } from "@/lib/guides";
import LessonContent from "@/components/learning/LessonContent";
import { getBrandConfig, getFooterNavigation, getMainNavigation, getPlatformCopy } from "@/lib/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  const brand = getBrandConfig();

  if (!guide) {
    return { title: `Guide Not Found | ${brand.name}` };
  }

  return {
    title: `${guide.metadata.title} | ${brand.name}`,
    description: guide.metadata.description,
  };
}

export default async function GuideSinglePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  const brand = getBrandConfig();

  if (!guide) {
    notFound();
  }

  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-ink text-cream selection:bg-gold/25 selection:text-ink pb-24">
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Guide Header */}
      <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="flex items-center gap-3 font-mono text-xs text-cream/40 mb-6">
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

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-cream/50 border-b border-hairline pb-10">
          {guide.metadata.description}
        </p>

        <div className="pt-10">
          <LessonContent content={guide.content} />
        </div>
      </article>
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
