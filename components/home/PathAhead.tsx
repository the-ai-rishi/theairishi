import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getFuturePath, getPlatformStory } from "@/lib/config";

export default function PathAhead({ section }: { section: ResolvedHomepageSection }) {
  const items = getFuturePath();
  const story = getPlatformStory();
  if (!items.length) return null;

  return (
    <section className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Later stages stay dark"}
          title={section.title || story.pathTitle || "Where this goes next"}
        />
        {story.pathBody ? (
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-cream/55 sm:text-[17px]">
            {story.pathBody}
          </p>
        ) : null}
        <ol className="mt-8 flex flex-col border-t border-hairline sm:flex-row sm:items-stretch">
          {items.map((item, index) => {
            const live = item.status === "active" && item.href;
            const inner = (
              <>
                <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-gold/70">
                  {item.note || (live ? "Now" : "Later")}
                </p>
                <p className="mt-2 font-serif text-2xl text-cream sm:text-3xl">{item.label}</p>
              </>
            );
            return (
              <li
                key={item.id}
                className={`flex-1 border-b border-hairline py-5 sm:border-b-0 sm:px-6 sm:py-7 ${
                  index === 0 ? "sm:pl-0" : "sm:border-l"
                }`}
              >
                {live ? (
                  <Link href={item.href!} className="block hover:text-gold-bright">
                    {inner}
                  </Link>
                ) : (
                  <div className="opacity-65">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
