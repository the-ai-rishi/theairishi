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
      <div className="poster-index">
        {guides.length === 0 ? (
          <p className="border-t border-hairline py-16 text-cream/50">Essays are being written. Check back soon.</p>
        ) : (
          <>
            <Link href={`/guides/${guides[0].slug}`} className="poster-feature">
              <p className="field-kicker">
                Essay 01 <span>{guides[0].metadata.category}</span>
              </p>
              <h1>{guides[0].metadata.title}</h1>
              <p className="max-w-xl text-[17px] leading-relaxed text-cream/70">{guides[0].metadata.description}</p>
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-cream/50">Read</p>
            </Link>
            {guides.length > 1 ? (
              <ol className="poster-list">
                {guides.slice(1).map((guide, index) => (
                  <li key={guide.slug}>
                    <Link href={`/guides/${guide.slug}`}>
                      <span className="font-mono text-[12px] text-cream/45">{String(index + 2).padStart(2, "0")}</span>
                      <span>
                        <h2>{guide.metadata.title}</h2>
                        <p className="mt-2 text-[15px] text-cream/60">{guide.metadata.description}</p>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : null}
          </>
        )}
      </div>
    </PageShell>
  );
}
