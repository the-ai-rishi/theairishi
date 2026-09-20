import type { ResolvedHomepageSection } from "@/lib/homepage";
import { getPlatformStory } from "@/lib/config";

export default function WhySection({ section }: { section: ResolvedHomepageSection }) {
  const story = getPlatformStory();
  const generate = story.whyGenerate || [];
  const stillNeed = story.whyStillNeed || [];
  const title = section.title || story.whyTitle || "Why DevOps before AI";
  const body = section.body || story.whyBody || "";

  return (
    <section className="scroll-mt-24 py-7 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="kicker text-gold/80">{section.subtitle || "The order"}</p>
        <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">{title}</h2>
        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {generate.length > 0 ? (
            <div className="panel p-5 sm:p-6">
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-cream/40">
                AI can generate
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {generate.map((item) => (
                  <li
                    key={item}
                    className="border border-hairline px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-cream/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {stillNeed.length > 0 ? (
            <div className="panel border-gold/25 p-5 sm:p-6">
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-gold/75">
                You still need to
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {stillNeed.map((item) => (
                  <li
                    key={item}
                    className="border border-gold/25 bg-gold/[0.04] px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-gold/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {body ? (
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-cream/50 sm:text-[16px]">{body}</p>
        ) : null}
      </div>
    </section>
  );
}
