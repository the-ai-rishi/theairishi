import { getPlatformStory, type StoryConfig } from "@/lib/config";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import SectionHeading from "@/components/brand/SectionHeading";

const BODY_KEYS: Record<string, keyof StoryConfig> = {
  what: "whatBody",
  why: "whyBody",
  method: "methodBody",
  path: "pathBody",
  community: "communityBody",
};

export default function ProseSection({ section }: { section: ResolvedHomepageSection }) {
  const story = getPlatformStory();
  const key = String(section.bodyKey || "");
  const body =
    section.body ||
    (BODY_KEYS[key] ? story[BODY_KEYS[key]] : undefined) ||
    "";
  if (!body) return null;
  const title = section.title || "Note";
  const kicker = section.subtitle;

  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading kicker={kicker} title={title} />
        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-cream/60">{body}</p>
      </div>
    </section>
  );
}
