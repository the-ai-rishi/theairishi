import Link from "next/link";
import SectionHeading from "@/components/brand/SectionHeading";
import type { TopicConfig } from "@/lib/config";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import { topicTone } from "@/lib/palette";
import { sectionAnchorId } from "@/lib/presentation";

type TopicCard = TopicConfig & { contentCount?: number };

function publishedCountLabel(topic: TopicCard): string | null {
  const count = Number(topic.contentCount);
  if (!Number.isFinite(count) || count <= 0) return null;
  return `${count} published ${count === 1 ? "piece" : "pieces"}`;
}

export default function TopicGrid({
  section,
  topics,
}: {
  section: ResolvedHomepageSection;
  topics: TopicCard[];
}) {
  if (!topics.length) return null;
  const title = section.title ?? "The field";
  const subtitle = section.subtitle ?? "Where we work";
  const split = topics.length <= 2;

  return (
    <section
      id={sectionAnchorId("topic-grid")}
      className="scroll-mt-24 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={subtitle}
          title={title}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref}
        />

        {split ? (
          <div className={`mt-10 grid ${topics.length === 1 ? "" : "lg:grid-cols-2"}`}>
            {topics.map((topic, index) => {
              const tone = topicTone(topic.color, index, topics.length);
              const countLabel = publishedCountLabel(topic);
              return (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  className={`group relative min-h-[220px] border-hairline px-6 py-8 sm:px-8 sm:py-10 ${
                    index === 0 ? "border-t lg:border-r" : "border-t"
                  }`}
                >
                  <p
                    className="font-mono text-[13px] tracking-[0.18em] uppercase"
                    style={{ color: tone.accent }}
                  >
                    {topic.category}
                  </p>
                  <h3 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-6xl">
                    {topic.shortName}
                  </h3>
                  {countLabel ? (
                    <p className="mt-3 font-mono text-[13px] tracking-[0.08em] text-cream/45">
                      {countLabel}
                    </p>
                  ) : null}
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed text-cream/50">
                    {topic.description}
                  </p>
                  <span className="link-editorial mt-7 inline-block font-mono text-[14px] tracking-[0.12em] text-cream/70 group-hover:text-gold">
                    Enter {topic.shortName} →
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => {
              const tone = topicTone(topic.color, index, topics.length);
              const countLabel = publishedCountLabel(topic);
              const featured = index === 0;
              return (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  className={`group bg-ink px-6 py-8 ${featured ? "sm:col-span-2 lg:row-span-2" : ""}`}
                >
                  <p className="font-mono text-[12px] tracking-[0.16em] uppercase" style={{ color: tone.accent }}>
                    {topic.category}
                  </p>
                  <h3 className={`mt-4 font-serif tracking-[0.01em] text-cream ${featured ? "text-4xl sm:text-5xl" : "text-3xl"}`}>
                    {topic.shortName}
                  </h3>
                  {countLabel ? (
                    <p className="mt-2 font-mono text-[12px] text-cream/40">{countLabel}</p>
                  ) : null}
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-cream/50">
                    {topic.description}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
