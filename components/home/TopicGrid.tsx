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

const CARD_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

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
      className="scroll-mt-24 py-10 sm:py-12"
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
                  className={`group relative min-h-[220px] border-hairline px-6 py-8 sm:px-8 sm:py-10 ${CARD_FOCUS} ${
                    index === 0 ? "border-t lg:border-r" : "border-t"
                  }`}
                  style={{ background: `linear-gradient(160deg, ${tone.wash} 0%, transparent 55%)` }}
                >
                  <p
                    className="font-mono text-[13px] tracking-[0.18em] uppercase"
                    style={{ color: tone.accent }}
                  >
                    {topic.category}
                  </p>
                  <h3
                    className="mt-5 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-6xl"
                    style={{ color: tone.accentBright }}
                  >
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
                  <span className="link-editorial mt-7 inline-block font-mono text-[14px] tracking-[0.12em] text-cream/70 group-hover:text-cream">
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
              const featured = index === 0;
              const countLabel = publishedCountLabel(topic);
              return (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  className={`group bg-ink p-7 ${CARD_FOCUS} ${featured ? "sm:col-span-2 lg:row-span-2 lg:p-10" : ""}`}
                  style={{ background: `linear-gradient(165deg, ${tone.wash} 0%, #08080b 50%)` }}
                >
                  <p className="font-mono text-[12px] tracking-[0.16em] uppercase" style={{ color: tone.accent }}>
                    {topic.badge}
                  </p>
                  <h3
                    className={`mt-4 font-serif tracking-[0.01em] text-cream ${
                      featured ? "text-5xl sm:text-6xl" : "text-3xl"
                    }`}
                  >
                    {topic.shortName}
                  </h3>
                  {countLabel ? (
                    <p className="mt-2 font-mono text-[12px] tracking-[0.08em] text-cream/45">
                      {countLabel}
                    </p>
                  ) : null}
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/50">
                    {topic.description}
                  </p>
                  <span className="mt-6 inline-block font-mono text-[13px]" style={{ color: tone.accent }}>
                    Enter {topic.shortName} →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
