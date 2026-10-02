import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import { getAllGuideSummaries } from "@/lib/guides";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import { notFound } from "next/navigation";
import { canonicalAlternates } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Writing",
    description:
      "In-depth technical essays, architecture deep-dives, and practical engineering writing. Some notes predate FORGE-120.",
    alternates: canonicalAlternates("/guides"),
  };
}

export default function GuidesPage() {
  if (!isContentTypeRoutable("guides")) notFound();
  const guides = getAllGuideSummaries();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy} tone="editorial">
      <div className="contents-board">
        <header className="contents-mast">
          <p className="kicker text-gold/80">Essays</p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.92] tracking-[0.01em] text-cream sm:text-7xl">Writing</h1>
          <p className="mt-5 text-[16px] leading-relaxed text-cream/55">
            In-depth technical essays and architecture notes. Some of them predate FORGE-120.
          </p>
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-cream/35">
            {guides.length === 0 ? "None published" : `${guides.length} essays`}
          </p>
        </header>
        {guides.length === 0 ? (
          <p className="border-t border-hairline py-16 text-cream/40">Essays are being written. Check back soon.</p>
        ) : (
          <ol className="contents-index">
            {guides.map((guide, index) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`}>
                  <span className="font-mono text-[12px] text-gold/80">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-serif text-2xl text-cream sm:text-3xl">{guide.metadata.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-cream/50">{guide.metadata.description}</span>
                  </span>
                  <span className="font-mono text-[12px] text-cream/40">
                    {guide.metadata.category}
                    <span className="mt-1 block">{guide.metadata.date}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </PageShell>
  );
}
