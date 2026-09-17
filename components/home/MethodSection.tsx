import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";
import { getPlatformStory } from "@/lib/config";

const STEPS = [
  ["01", "Understand", "Read the day’s words. Predict before you run."],
  ["02", "Do", "Attempt the core task. On write days, no AI for v1."],
  ["03", "Break", "Break one thing safely. Write what you saw."],
  ["04", "Prove", "Evidence in a file. Chat is not evidence."],
  ["05", "Defend", "Seven questions out loud, including what fails and how you troubleshoot it."],
];

export default function MethodSection({ section }: { section: ResolvedHomepageSection }) {
  const story = getPlatformStory();
  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={section.subtitle || "Practice, not playback"}
          title={section.title || story.methodTitle || "What a day looks like"}
        />
        {story.methodBody ? (
          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-cream/60">{story.methodBody}</p>
        ) : null}
        <ol className="mt-10 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(([n, title, body]) => (
            <li key={n} className="bg-ink px-5 py-6">
              <p className="font-mono text-[12px] tracking-[0.18em] text-gold/70">{n}</p>
              <h3 className="mt-3 font-serif text-2xl text-cream">{title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-cream/45">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
