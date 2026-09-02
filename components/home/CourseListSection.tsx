import Link from "next/link";
import FeaturedPath from "./FeaturedPath";
import SectionHeading from "@/components/brand/SectionHeading";
import type { Course } from "@/lib/lessons";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import { sectionAnchorId } from "@/lib/presentation";

export default function CourseListSection({
  section,
  courses,
}: {
  section: ResolvedHomepageSection;
  courses: Course[];
}) {
  if (!courses.length) return null;
  const title = section.title ?? "Learning paths";
  const subtitle = section.subtitle ?? "First principles";
  const featured = courses[0];
  const rest = courses.slice(1);

  return (
    <section
      id={sectionAnchorId("course-list")}
      className="scroll-mt-24 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={subtitle}
          title={title}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref}
        />
        <FeaturedPath course={featured} />
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
                  <Link
                    href={href}
                    className="group flex items-baseline gap-4 py-5 sm:gap-8"
                  >
                    <span className="w-8 font-mono text-[13px] text-cream/35">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-serif text-2xl tracking-[0.01em] text-cream group-hover:text-gold-bright sm:text-3xl">
                      {course.title}
                    </span>
                    <span className="hidden font-mono text-[13px] text-cream/40 sm:inline">
                      {total} lessons
                    </span>
                    <span className="font-mono text-[13px] text-cream/35 transition group-hover:text-gold">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
