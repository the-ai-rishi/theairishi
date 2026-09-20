import type { ResolvedHomepageSection } from "@/lib/homepage";
import { getPlatformStory } from "@/lib/config";

const FALLBACK_STEPS = [
  { n: "01", title: "Read", body: "Understand the words. Predict before you run." },
  { n: "02", title: "Try", body: "Do the core task. On write days, your v1 is yours." },
  { n: "03", title: "Break", body: "Break one thing safely. Write what you saw." },
  { n: "04", title: "Debug", body: "Evidence in a file. Chat is not evidence." },
  { n: "05", title: "Practise", body: "Questions out loud, including what fails." },
  { n: "06", title: "Review", body: "If you cannot explain it, you do not own it." },
];

export default function MethodSection({ section }: { section: ResolvedHomepageSection }) {
  const story = getPlatformStory();
  const steps = story.methodSteps?.length ? story.methodSteps : FALLBACK_STEPS;
  return (
    <section className="scroll-mt-24 py-7 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="kicker text-gold/80">{section.subtitle || "Practice, not playback"}</p>
        <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">
          {section.title || story.methodTitle || "How a day works"}
        </h2>
        {story.methodBody ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/50 sm:text-[16px]">
            {story.methodBody}
          </p>
        ) : null}
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="panel px-5 py-5">
              <p className="font-mono text-[11px] tracking-[0.18em] text-gold/70">{step.n}</p>
              <h3 className="mt-2 font-serif text-xl text-cream sm:text-2xl">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-cream/45">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
