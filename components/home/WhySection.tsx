import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getPlatformStory } from "@/lib/config";

export default function WhySection({ section }: { section: ResolvedHomepageSection }) {
  const story = getPlatformStory();
  const generate = story.whyGenerate || [];
  const stillNeed = story.whyStillNeed || [];
  const title = section.title || story.whyTitle || "Why DevOps before AI";
  const body = section.body || story.whyBody || "";

  return (
    <section className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading kicker={section.subtitle} title={title} />
        <div className="mt-8 grid gap-8 border-t border-hairline pt-8 lg:grid-cols-2 lg:gap-12">
          {generate.length > 0 ? (
            <div>
              <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-cream/40">
                AI can generate
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {generate.map((item) => (
                  <li
                    key={item}
                    className="border border-hairline px-3 py-1.5 font-mono text-[13px] tracking-[0.08em] text-cream/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {stillNeed.length > 0 ? (
            <div>
              <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-gold/75">
                You still need to
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {stillNeed.map((item) => (
                  <li
                    key={item}
                    className="border border-gold/25 bg-gold/[0.04] px-3 py-1.5 font-mono text-[13px] tracking-[0.08em] text-gold/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {body ? (
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-cream/55 sm:text-[17px]">{body}</p>
        ) : null}
      </div>
    </section>
  );
}
