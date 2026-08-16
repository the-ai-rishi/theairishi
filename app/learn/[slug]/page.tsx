import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import SearchModal from "@/components/search/SearchModal";

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

export async function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);

  if (!lesson) {
    return {
      title: "Lesson Not Found | The AI Rishi",
    };
  }

  const courseTitle = lesson.metadata.courseTitle || "Course";
  const title = `${lesson.metadata.title} · ${lesson.metadata.stage} | ${courseTitle} | The AI Rishi`;
  const description = lesson.metadata.description;

  return {
    title,
    description,
    keywords: [
      lesson.metadata.course,
      courseTitle,
      lesson.metadata.stage,
      lesson.metadata.title,
      "The AI Rishi",
      "Tutorial",
      ...(lesson.metadata.tags || []),
    ],
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "The AI Rishi",
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
  const lesson = await getLesson(slug);
  const lessonContext = getLessonContext(slug);

  if (!lesson || !lessonContext) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: lesson.metadata.title,
    description: lesson.metadata.description,
    articleSection: lesson.metadata.stage,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "The AI Rishi",
      description: "Ancient Wisdom · Modern Intelligence",
    },
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-20">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[150px]" />
        <div className="absolute right-[-150px] top-[400px] h-[450px] w-[450px] rounded-full bg-indigo-600/5 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="The AI Rishi"
              width={200}
              height={50}
              className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <SearchModal />
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Learning Hub</span>
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
      />

      {/* Lesson Content Area & Sidebar */}
      <section className="border-y border-white/[0.07] bg-white/[0.015]">
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
      <footer className="border-t border-white/[0.08] mt-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="text-sm font-semibold tracking-[0.18em]">
              THE AI RISHI
            </div>
            <p className="mt-1 text-xs text-white/30">
              Ancient Wisdom · Modern Intelligence
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/learn" className="hover:text-white transition">
              Learning Hub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
