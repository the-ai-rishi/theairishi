import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import SearchModal from "@/components/search/SearchModal";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/brand/Logo";
import { getBrandConfig, getFooterNavigation, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";

import LessonHeader from "@/components/learning/LessonHeader";
import LessonNavigation from "@/components/learning/LessonNavigation";
import LessonSidebar from "@/components/learning/LessonSidebar";
import LessonContent from "@/components/learning/LessonContent";
import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import MobileLessonMenu from "@/components/learning/MobileLessonMenu";
import {
  getAllLessonSlugs,
  getLesson,
  getLessonContext,
} from "@/lib/lessons";

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!isContentTypeRoutable("learn")) return [];
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  const brand = getBrandConfig();

  if (!lesson) {
    return {
      title: "Lesson not found",
    };
  }

  const courseTitle = lesson.metadata.courseTitle || "Course";
  const title = `${lesson.metadata.title} · ${lesson.metadata.stage}`;
  const description = lesson.metadata.description;

  return {
    title,
    description,
    keywords: [
      lesson.metadata.course,
      courseTitle,
      lesson.metadata.stage,
      lesson.metadata.title,
      brand.name,
      "Tutorial",
      ...(lesson.metadata.tags || []),
    ],
    openGraph: {
      title,
      description,
      type: "article",
      siteName: brand.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/learn/${slug}`,
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  if (!isContentTypeRoutable("learn")) notFound();
  const lesson = await getLesson(slug);
  const lessonContext = getLessonContext(slug);

  if (!lesson || !lessonContext) {
    notFound();
  }

  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const footerNav = getFooterNavigation();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lesson.metadata.title,
    description: lesson.metadata.description,
    author: {
      "@type": "Person",
      name: brand.name,
    },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      description: brand.tagline,
    },
  };

  return (
    <main id="main-content" className="min-h-screen bg-ink text-cream selection:bg-gold/25 selection:text-ink pb-20">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-ink/85 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo brand={brand} variant="horizontal" priority />

          <div className="flex items-center gap-3">
            <SearchModal />
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 border border-hairline px-4 py-2 font-mono text-xs text-cream/60 transition hover:text-cream"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Journey</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Lesson Header Banner */}
      <LessonHeader
        courseTitle={lessonContext.course.title}
        stageNumber={lessonContext.stage.number}
        stage={lesson.metadata.stage}
        title={lesson.metadata.title}
        description={lesson.metadata.description}
        lessonNumber={lessonContext.lessonIndex + 1}
        totalLessons={lessonContext.totalLessonsInStage}
        readingTime={lesson.readingTime}
        day={lesson.metadata.day}
      />

      {/* Lesson Content Area & Sidebar */}
      <section className="border-y border-hairline">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1fr_280px] lg:px-8">
          <div className="space-y-12">
            <LessonContent content={lesson.content} />

            {/* Interactive Completion Trigger */}
            <LessonCompletionButton
              slug={lesson.slug}
              nextSlug={lessonContext.next?.slug ?? null}
            />

            {/* Previous & Next Navigation (Scoped to Course) */}
            <LessonNavigation
              previous={lessonContext.previous}
              next={lessonContext.next}
              currentStage={lessonContext.stage.name}
            />
          </div>

          {/* Desktop Sticky Sidebar (Scoped to Course) */}
          <LessonSidebar
            courseTitle={lessonContext.course.title}
            stage={lessonContext.stage.name}
            lessons={lessonContext.stage.lessons}
            currentSlug={lesson.slug}
            headings={lesson.headings}
            courseStages={lessonContext.course.stages}
          />
        </div>
      </section>

      {/* Mobile Syllabus Menu */}
      <MobileLessonMenu
        courseTitle={lessonContext.course.title}
        stage={lessonContext.stage.name}
        lessons={lessonContext.stage.lessons}
        currentSlug={lesson.slug}
        courseStages={lessonContext.course.stages}
      />

      {/* Footer */}
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
