import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import CourseCard from "@/components/learning/CourseCard";
import type { Course } from "@/lib/lessons";
import type { ResolvedHomepageSection } from "@/lib/homepage";

export default function CourseListSection({
  section,
  courses,
}: {
  section: ResolvedHomepageSection;
  courses: Course[];
}) {
  if (!courses.length) return null;
  const title = section.title ?? "Courses";
  const subtitle = section.subtitle ?? "Start here";
  const ctaLabel = section.ctaLabel;
  const ctaHref = section.ctaHref;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{subtitle}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              {title}
            </h2>
          </div>
          {ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white transition"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
        <div className="mt-8 space-y-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
