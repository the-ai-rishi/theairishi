import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import SearchModal from "@/components/search/SearchModal";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/brand/Logo";
import ExistingNotesNote from "@/components/content/ExistingNotesNote";
import { getBrandConfig, getFooterNavigation, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import { articleJsonLd } from "@/lib/seo";
import { canonicalAlternates, canonicalUrl } from "@/lib/urls";

import LessonHeader from "@/components/learning/LessonHeader";
import LessonNavigation from "@/components/learning/LessonNavigation";
import LessonSidebar from "@/components/learning/LessonSidebar";
import LessonContent from "@/components/learning/LessonContent";
import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import MobileLessonMenu from "@/components/learning/MobileLessonMenu";
import StartingAssessment from "@/components/learning/StartingAssessment";
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

export const dynamic = "force-static";

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
    notFound();
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
    alternates: canonicalAlternates(`/learn/${slug}`),
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
  const showStartingAssessment = lesson.metadata.exercise === "starting-assessment";
  const jsonLd = articleJsonLd({
    title: lesson.metadata.title,
    description: lesson.metadata.description,
    url: canonicalUrl(`/learn/${slug}`),
  });

  return (
    <main id="main-content" className="min-h-screen bg-ink text-cream selection:bg-gold/25 selection:text-ink pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true" />

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
              <span>120 Days</span>
            </Link>
          </div>
        </nav>
      </header>

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

      {lesson.metadata.topic ? (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ExistingNotesNote topicKey={lesson.metadata.topic} />
        </div>
      ) : null}

      <section className="border-y border-hairline">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1fr_280px] lg:px-8">
          <div className="space-y-12">
            {showStartingAssessment ? <StartingAssessment /> : null}

            <LessonContent content={lesson.content} />

            <LessonCompletionButton
              slug={lesson.slug}
              nextSlug={lessonContext.next?.slug ?? null}
            />

            <LessonNavigation
              previous={lessonContext.previous}
              next={lessonContext.next}
              currentStage={lessonContext.stage.name}
            />
          </div>

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

      <MobileLessonMenu
        courseTitle={lessonContext.course.title}
        stage={lessonContext.stage.name}
        lessons={lessonContext.stage.lessons}
        currentSlug={lesson.slug}
        courseStages={lessonContext.course.stages}
      />

      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
