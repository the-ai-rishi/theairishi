import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourses, getAllLessonSummaries } from "@/lib/lessons";
import ResumeLearningBanner from "@/components/learning/ResumeLearningBanner";
import FeaturedPath from "@/components/home/FeaturedPath";
import PageShell from "@/components/brand/PageShell";
import {
  getMainNavigation,
  getFooterNavigation,
  getComingSoonCourses,
  getBrandConfig,
  getPlatformCopy,
  isContentTypeRoutable,
} from "@/lib/config";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `Learning paths | ${brand.name}`,
    description: `First-principles courses that are actually published on this site.`,
    keywords: [brand.name, brand.tagline, "courses"],
    openGraph: {
      title: `Learning paths | ${brand.name}`,
      description: `First-principles courses that are actually published on this site.`,
      type: "website",
      siteName: brand.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Learning paths | ${brand.name}`,
      description: `First-principles courses that are actually published on this site.`,
    },
  };
}

export default function LearnPage() {
  if (!isContentTypeRoutable("learn")) notFound();
  const courses = getAllCourses();
  const allLessons = getAllLessonSummaries();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const comingSoonCourses = getComingSoonCourses();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const featured = courses[0];
  const rest = courses.slice(1);

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
        <p className="kicker text-gold/80">Curriculum</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          Learning paths
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/55 sm:text-lg">
          Structured paths for the courses that are live today.
        </p>
      </section>

      <ResumeLearningBanner allLessons={allLessons} />

      <section id="courses" className="scroll-mt-24 border-y border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {featured ? <FeaturedPath course={featured} /> : null}
          {rest.length > 0 ? (
            <ol className="divide-y divide-hairline">
              {rest.map((course, index) => {
                const total =
                  course.totalLessons ||
                  course.stages?.flatMap((s) => s.lessons).length ||
                  0;
                const first = course.stages?.flatMap((s) => s.lessons)[0];
                const href = first ? `/learn/${first.slug}` : "/learn";
                return (
                  <li key={course.id}>
                    <Link href={href} className="group flex items-baseline gap-4 py-5 sm:gap-8">
                      <span className="w-8 font-mono text-[13px] text-cream/35">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-serif text-2xl text-cream group-hover:text-gold-bright sm:text-3xl">
                        {course.title}
                      </span>
                      <span className="hidden font-mono text-[13px] text-cream/40 sm:inline">
                        {total} lessons
                      </span>
                      <span className="text-cream/35">→</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : null}

          {comingSoonCourses.length > 0 ? (
            <p className="mt-16 border-t border-hairline pt-10 text-sm leading-relaxed text-cream/40">
              More paths will appear here when they have published lessons.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <p className="kicker text-gold/80">Method</p>
        <h2 className="mt-4 font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl">
          {brand.tagline}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/50">
          {brand.description}
        </p>
        <div className="mx-auto mt-12 grid max-w-3xl gap-8 text-left sm:grid-cols-3">
          {[
            ["01", "First principles", "Master the foundations before the frameworks."],
            ["02", "Systems", "See how models, platforms, and pipelines fit together."],
            ["03", "Building", "Turn understanding into working software and open knowledge."],
          ].map(([n, t, d]) => (
            <div key={n} className="border-t border-hairline pt-5">
              <p className="font-mono text-[12px] tracking-[0.18em] text-gold/70">{n}</p>
              <h3 className="mt-2 font-serif text-xl text-cream">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/45">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
