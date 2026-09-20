import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/layout/Footer";
import ExistingNotesNote from "@/components/content/ExistingNotesNote";
import { getBrandConfig, getFooterNavigation, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import { articleJsonLd, shareImages, shareTwitterImages } from "@/lib/seo";
import { canonicalAlternates, canonicalUrl } from "@/lib/urls";
import { indexRobots, isTopicIndexable } from "@/lib/indexing";

import LessonHeader from "@/components/learning/LessonHeader";
import LessonNavigation from "@/components/learning/LessonNavigation";
import LessonContent from "@/components/learning/LessonContent";
import DayCompletion from "@/components/learning/DayCompletion";
import LessonWorkspaceChrome from "@/components/learning/LessonWorkspaceChrome";
import DayRail from "@/components/learning/DayRail";
import StartingAssessment from "@/components/learning/StartingAssessment";
import {
  getAllLessonSlugs,
  getLesson,
  getLessonContext,
} from "@/lib/lessons";
import { getLearnerCatalog, getPublishedAdjacent } from "@/lib/programs";
import { firstContentHeading, firstPracticeHeading, navFromHeadings } from "@/lib/lesson-rhythm";

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
  const indexable = isTopicIndexable(lesson.metadata.topic);

  return {
    title,
    description,
    keywords: [
      courseTitle,
      lesson.metadata.stage,
      lesson.metadata.title,
      brand.name,
      "Tutorial",
      ...(lesson.metadata.tags || []),
    ],
    robots: indexRobots(indexable),
    openGraph: {
      title,
      description,
      type: "article",
      siteName: brand.name,
      locale: "en_US",
      images: shareImages(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareTwitterImages(),
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
  const catalog = getLearnerCatalog(lesson.metadata.program);
  const adjacent = getPublishedAdjacent(slug, lesson.metadata.program);
  const nav = navFromHeadings(lesson.headings);
  const practice = firstPracticeHeading(lesson.headings);
  const startAt = firstContentHeading(lesson.headings);
  const jsonLd = articleJsonLd({
    title: lesson.metadata.title,
    description: lesson.metadata.description,
    url: canonicalUrl(`/learn/${slug}`),
  });
  const phaseNumber =
    catalog.days.find((day) => day.slug === slug)?.phaseNumber ||
    lessonContext.stage.number;
  const isProgramDay = Boolean(lesson.metadata.day);

  const previous = adjacent.previous
    ? {
        slug: adjacent.previous.slug,
        metadata: {
          ...lesson.metadata,
          title: adjacent.previous.title,
          day: adjacent.previous.day,
        },
      }
    : lessonContext.previous;
  const next = adjacent.next
    ? {
        slug: adjacent.next.slug,
        metadata: {
          ...lesson.metadata,
          title: adjacent.next.title,
          day: adjacent.next.day,
        },
      }
    : adjacent.current
      ? null
      : lessonContext.next;

  return (
    <main className="min-h-screen bg-ink text-cream selection:bg-gold/25 selection:text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LessonWorkspaceChrome
        slug={lesson.slug}
        day={lesson.metadata.day}
        stage={lesson.metadata.stage}
        catalog={catalog}
        brand={brand}
        nav={nav}
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:grid-cols-[188px_minmax(0,1fr)]">
        {isProgramDay ? <DayRail catalog={catalog} currentSlug={lesson.slug} /> : <div className="hidden xl:block" />}

        <div id="main-content" tabIndex={-1} className="min-w-0 space-y-6 pb-16">
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
            phaseNumber={phaseNumber}
            outcomes={lesson.metadata.outcomes}
            estimatedMinutes={lesson.metadata.estimatedMinutes}
            startHref={showStartingAssessment ? "#starting-assessment" : startAt ? `#${startAt.id}` : "#lesson-body"}
            practiceHref={showStartingAssessment ? null : practice ? `#${practice.id}` : null}
            programTotal={catalog.totalDays}
          />

          {lesson.metadata.topic ? <ExistingNotesNote topicKey={lesson.metadata.topic} /> : null}

          {showStartingAssessment ? (
            <div id="starting-assessment" className="panel p-5 sm:p-6">
              <StartingAssessment />
            </div>
          ) : null}

          <div id="lesson-body">
            <LessonContent content={lesson.content} />
          </div>

          <DayCompletion
            slug={lesson.slug}
            day={lesson.metadata.day}
            title={lesson.metadata.title}
            outcomes={lesson.metadata.outcomes}
            catalog={catalog}
            nextPublished={adjacent.next}
          />

          <LessonNavigation
            previous={previous}
            next={next}
            currentStage={lessonContext.stage.name}
            waitTitle={
              !adjacent.next && adjacent.current
                ? catalog.days.find((day) => !day.published)?.title || null
                : null
            }
            waitDay={!adjacent.next && adjacent.current ? catalog.days.find((day) => !day.published)?.day : null}
          />
        </div>
      </div>

      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
