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
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy} tone="brand">
      <div className="about-sheet">
        <nav className="about-index" aria-label="On this page">
          <p className="kicker text-gold/80">{about?.kicker || "About"}</p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40">On this page</p>
          <ol className="mt-3 space-y-2">
            {sections.map((block, index) => (
              <li key={block.id}>
                <a href={`#${block.id}`} className="font-serif text-lg text-cream/75 hover:text-cream">
                  <span className="mr-2 font-mono text-[11px] text-cream/35">{String(index + 1).padStart(2, "0")}</span>
                  {block.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div>
          <h1 className="font-serif text-4xl leading-[0.95] tracking-[0.01em] text-cream sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream/65">{intro}</p>
          <div className="mt-10 space-y-12">
            {sections.map((block) => (
              <article key={block.id} id={block.id} className="scroll-mt-28 border-t border-hairline pt-8">
                <h2 className="font-serif text-3xl text-cream sm:text-4xl">{block.title}</h2>
                <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-cream/60">{block.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-12 max-w-2xl border-t border-hairline pt-6 font-mono text-[13px] leading-relaxed text-cream/40">
            The current program is {program.title}: {program.durationLabel}.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
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
        </div>
      </div>
    </PageShell>
  );
}

