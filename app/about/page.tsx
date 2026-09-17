import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy, getPlatformStory } from "@/lib/config";
import { getProgram } from "@/lib/programs";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description:
      "Why The AI Rishi exists: a public DevOps learning journey, written while I am still doing the work.",
  };
}

export default function AboutPage() {
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const story = getPlatformStory();
  const program = getProgram();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker text-gold/80">About</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          I am learning in public
        </h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-cream/60">
          I wanted to get better at engineering without hopping randomly between tools.
          I wanted to understand systems well enough to debug them, review them, and
          explain them. Writing it down is part of the work. Teaching it is how I find
          the holes.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="dual-rule mb-12" />
        <div className="space-y-10">
          <article>
            <h2 className="font-serif text-3xl text-cream">The current work</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/55">
              {story.whatBody} The program on this site right now is {program.title}: {program.durationLabel}.
            </p>
          </article>
          <article>
            <h2 className="font-serif text-3xl text-cream">The order</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/55">
              {story.whyBody}
            </p>
          </article>
          <article>
            <h2 className="font-serif text-3xl text-cream">What I am not claiming</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/55">
              I am not a finished expert. I do not have a student count to flash. I will
              not sell a certificate or a job. Content here is free. If that later becomes
              a paid group, it will be because the material has been proven in public first.
            </p>
          </article>
        </div>
        <div className="mt-12 flex flex-wrap gap-6">
          <Link href="/learn/day-01" className="btn-primary">
            Start Day 1
          </Link>
          <Link href="/learn" className="link-editorial font-mono text-[14px] text-gold">
            See the 120-day journey →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
