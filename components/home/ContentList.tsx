import type { ReactNode } from "react";
import Link from "next/link";
import SectionHeading from "@/components/brand/SectionHeading";
import type { UniversalContentItem } from "@/lib/content";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import {
  presentationForContentList,
  sectionAnchorId,
  type ContentPresentation,
} from "@/lib/presentation";

function formatDate(value?: string): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(parsed));
}

function MagazineFeature({
  items,
}: {
  items: UniversalContentItem[];
}) {
  const [feature, ...rest] = items;
  return (
    <div className="mt-10">
      <article className="border-t border-hairline pt-10">
        <p className="kicker text-gold/80">Essay</p>
        <h3 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.08] tracking-[0.01em] text-cream sm:text-5xl lg:text-6xl">
          <Link href={feature.url} className="hover:text-gold-bright">
            {feature.title}
          </Link>
        </h3>
        {feature.description ? (
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/55 sm:text-lg">
            {feature.description}
          </p>
        ) : null}
        <p className="mt-6 font-mono text-[13px] tracking-[0.08em] text-cream/40">
          {[feature.author, formatDate(feature.publishedAt), feature.readTime ? `${feature.readTime} min` : ""]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
        <Link
          href={feature.url}
          className="link-editorial mt-8 inline-block font-mono text-[14px] tracking-[0.12em] text-gold hover:text-gold-bright"
        >
          Read the essay →
        </Link>
      </article>
      {rest.length > 0 ? (
        <ol className="mt-12 divide-y divide-hairline border-t border-hairline">
          {rest.map((item) => (
            <JournalRow key={item.id} item={item} />
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function LabShowcase({ items }: { items: UniversalContentItem[] }) {
  return (
    <div className="mt-10 border-t border-hairline">
      {items.map((item, index) => (
        <article
          key={item.id}
          className={`grid gap-6 border-b border-hairline py-10 lg:grid-cols-12 ${
            index % 2 === 1 ? "lg:text-right" : ""
          }`}
        >
          <div className={`lg:col-span-2 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
            <span className="font-mono text-[13px] text-circuit-bright">
              Lab {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className={`lg:col-span-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
            <h3 className="font-serif text-3xl tracking-[0.01em] text-cream sm:text-4xl">
              {item.title}
            </h3>
            {item.description ? (
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-cream/50 lg:inline-block">
                {item.description}
              </p>
            ) : null}
            <div className="mt-6">
              <Link
                href={item.url}
                className="link-editorial font-mono text-[14px] tracking-[0.12em] text-circuit-bright hover:text-cream"
              >
                Open the lab →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function JournalRow({ item }: { item: UniversalContentItem }) {
  return (
    <li>
      <Link
        href={item.url}
        className="group grid grid-cols-1 items-baseline gap-2 py-4 sm:grid-cols-[7.5rem_5.5rem_1fr] sm:gap-6"
      >
        <span className="font-mono text-[13px] text-cream/40">
          {formatDate(item.publishedAt) || "—"}
        </span>
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold/70">
          {item.type}
        </span>
        <span className="font-serif text-xl tracking-[0.01em] text-cream group-hover:text-gold-bright sm:text-2xl">
          {item.title}
        </span>
      </Link>
    </li>
  );
}

function JournalIndex({ items }: { items: UniversalContentItem[] }) {
  return (
    <ol className="mt-8 divide-y divide-hairline border-t border-hairline">
      {items.map((item) => (
        <JournalRow key={item.id} item={item} />
      ))}
    </ol>
  );
}

function TimelineFeed({ items }: { items: UniversalContentItem[] }) {
  return (
    <ol className="mt-10 border-l border-hairline pl-6 sm:pl-8">
      {items.map((item) => (
        <li key={item.id} className="relative pb-10 last:pb-0">
          <span className="absolute -left-[1.6rem] top-1.5 h-2 w-2 rounded-full bg-signal sm:-left-[2.1rem]" />
          <p className="font-mono text-[12px] tracking-[0.12em] text-cream/40">
            {formatDate(item.publishedAt)}
          </p>
          <h3 className="mt-2 font-serif text-2xl text-cream">
            <Link href={item.url} className="hover:text-gold-bright">
              {item.title}
            </Link>
          </h3>
          {item.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/50">
              {item.description}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function ConversationList({ items }: { items: UniversalContentItem[] }) {
  return (
    <div className="mt-10 space-y-12 border-t border-hairline pt-10">
      {items.map((item) => (
        <article key={item.id} className="max-w-3xl">
          <blockquote className="font-serif text-3xl leading-snug tracking-[0.01em] text-cream sm:text-4xl">
            “{item.description || item.title}”
          </blockquote>
          <p className="mt-4 font-mono text-[13px] tracking-[0.1em] text-cream/45">
            {item.author || item.title}
          </p>
          <Link
            href={item.url}
            className="link-editorial mt-4 inline-block font-mono text-[13px] text-lotus"
          >
            Read the conversation →
          </Link>
        </article>
      ))}
    </div>
  );
}

function MediaStrip({ items }: { items: UniversalContentItem[] }) {
  return (
    <div className="mt-8 flex gap-5 overflow-x-auto pb-2">
      {items.map((item) => (
        <Link key={item.id} href={item.url} className="group w-[280px] shrink-0 sm:w-[320px]">
          <div className="relative aspect-video border border-hairline bg-field">
            <span className="absolute inset-0 m-auto h-10 w-10 border border-cream/30" />
            <span className="absolute inset-0 m-auto h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-cream/80" style={{ left: "52%" }} />
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
            {item.type}
          </p>
          <h3 className="mt-1 font-serif text-xl text-cream group-hover:text-gold-bright">
            {item.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}

const PRESENTATIONS: Record<
  ContentPresentation,
  (items: UniversalContentItem[]) => ReactNode
> = {
  magazine: (items) => <MagazineFeature items={items} />,
  lab: (items) => <LabShowcase items={items} />,
  journal: (items) => <JournalIndex items={items} />,
  timeline: (items) => <TimelineFeed items={items} />,
  conversation: (items) => <ConversationList items={items} />,
  media: (items) => <MediaStrip items={items} />,
};

export default function ContentList({
  section,
  items,
}: {
  section: ResolvedHomepageSection;
  items: UniversalContentItem[];
}) {
  if (!items.length) return null;
  const presentation = presentationForContentList(section.source, items);
  const title = section.title ?? "Latest";
  const subtitle = section.subtitle ?? "Published";
  const body = PRESENTATIONS[presentation](items);

  return (
    <section
      id={sectionAnchorId("content-list", section.source, items)}
      className="scroll-mt-24 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={subtitle}
          title={title}
          actionLabel={section.ctaLabel}
          actionHref={section.ctaHref}
        />
        {body}
      </div>
    </section>
  );
}
