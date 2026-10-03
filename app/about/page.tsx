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
      <div className="story-reel">
        <section className="story-chapter">
          <p className="story-num">{about?.kicker || "About"}</p>
          <h1 className="path-stage-title">{title}</h1>
          <p>{intro}</p>
        </section>
        {sections.map((block, index) => (
          <section key={block.id} id={block.id} className="story-chapter">
            <p className="story-num">{String(index + 1).padStart(2, "0")}</p>
            <h2>{block.title}</h2>
            <p>{block.body}</p>
          </section>
        ))}
        <section className="story-chapter">
          <p className="story-num">{program.title}</p>
          <h2>{program.durationLabel}</h2>
          <p>The current program is {program.title}.</p>
          <div className="field-actions">
            <Link href="/learn/day-01">Start Day 1</Link>
            <Link href="/learn">Explore the 120-day plan</Link>
          </div>
          <div>
            <DestinationLinks surface="about" />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

