import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import DestinationLinks from "@/components/brand/DestinationLinks";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
  getAboutConfig,
} from "@/lib/config";
import { getProgram } from "@/lib/programs";
import { canonicalAlternates } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description: "Why I created The AI Rishi, why DevOps comes first, and how I want to learn and teach.",
    alternates: canonicalAlternates("/about"),
  };
}

export default function AboutPage() {
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const about = getAboutConfig();
  const program = getProgram();

  const title = about?.title || "Why I built this";
  const intro =
    about?.intro ||
    "I wanted to get better at engineering without hopping randomly between tools.";
  const sections = about?.sections || [];

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-8 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker text-gold/80">{about?.kicker || "About"}</p>
        <h1 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[0.01em] text-cream sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/65 sm:text-[18px]">
          {intro}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="dual-rule mb-10" />
        <div className="space-y-10">
          {sections.map((block) => (
            <article key={block.id}>
              <h2 className="font-serif text-2xl text-cream sm:text-3xl">{block.title}</h2>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-cream/55">{block.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-2xl font-mono text-[13px] leading-relaxed text-cream/40">
          The current program is {program.title}: {program.durationLabel}.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <Link href="/learn/day-01" className="btn-primary">
            Start Day 1
          </Link>
          <Link href="/learn" className="link-editorial font-mono text-[14px] text-gold">
            Explore the 120-day plan →
          </Link>
        </div>
        <div className="mt-10">
          <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-cream/35">Elsewhere</p>
          <div className="mt-3">
            <DestinationLinks surface="about" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
