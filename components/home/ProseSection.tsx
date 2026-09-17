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
  const mapped = BODY_KEYS[key] ? story[BODY_KEYS[key]] : undefined;
  const body = section.body || (typeof mapped === "string" ? mapped : "") || "";
  if (!body) return null;
  const title = section.title || "Note";
  const kicker = section.subtitle;

  return (
    <section className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading kicker={kicker} title={title} />
        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-cream/55 sm:text-[17px]">{body}</p>
      </div>
    </section>
  );
}
