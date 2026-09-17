import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getFuturePath, getPlatformStory } from "@/lib/config";

export default function PathAhead({ section }: { section: ResolvedHomepageSection }) {
  const items = getFuturePath();
  const story = getPlatformStory();
  if (!items.length) return null;

  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Later stages stay dark"}
          title={section.title || story.pathTitle || "Where this is going"}
        />
        {story.pathBody ? (
          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-cream/60">{story.pathBody}</p>
        ) : null}
        <ol className="mt-10 flex flex-col gap-0 border-t border-hairline sm:flex-row sm:items-stretch">
          {items.map((item, index) => {
            const live = item.status === "active" && item.href;
            const inner = (
              <>
                <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-gold/70">
                  {item.note || (live ? "Now" : "Later")}
                </p>
                <p className="mt-3 font-serif text-3xl text-cream">{item.label}</p>
              </>
            );
            return (
              <li
                key={item.id}
                className={`flex-1 border-b border-hairline px-0 py-6 sm:border-b-0 sm:px-6 sm:py-8 ${
                  index === 0 ? "sm:pl-0" : "sm:border-l"
                }`}
              >
                {live ? (
                  <Link href={item.href!} className="block hover:text-gold-bright">
                    {inner}
                  </Link>
                ) : (
                  <div className="opacity-70">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
