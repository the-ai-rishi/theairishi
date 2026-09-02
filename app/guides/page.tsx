import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import { getAllGuideSummaries } from "@/lib/guides";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy, getContentTypeRecord } from "@/lib/config";
import { notFound } from "next/navigation";
import * as vis from "@/lib/visibility-core";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `Writing | ${brand.name}`,
    description:
      "In-depth technical essays, architecture deep-dives, and practical engineering writing.",
  };
}

export default function GuidesPage() {
  const contentType = getContentTypeRecord("guides");
  if (!contentType || contentType.enabled === false) notFound();
  const status = vis.normalizeStatus(contentType.status);
  if (["planned", "paused", "disabled", "archived"].includes(status)) notFound();
  const guides = getAllGuideSummaries();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();
  const [feature, ...rest] = guides;

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker text-gold/80">Essays</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          Writing
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream/55">
          First-principles essays, mental frameworks, and architectural deep dives.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {guides.length === 0 ? (
          <p className="border-t border-hairline py-16 text-cream/40">
            Essays are being written. Check back soon.
          </p>
        ) : (
          <>
            {feature ? (
              <article className="border-t border-hairline pt-10">
                <p className="font-mono text-[13px] tracking-[0.14em] text-cream/40">
                  {feature.metadata.category} · {feature.metadata.date}
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[1.08] tracking-[0.01em] text-cream sm:text-5xl">
                  <Link href={`/guides/${feature.slug}`} className="hover:text-gold-bright">
                    {feature.metadata.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream/50">
                  {feature.metadata.description}
                </p>
                <Link
                  href={`/guides/${feature.slug}`}
                  className="link-editorial mt-6 inline-block font-mono text-[14px] text-gold"
                >
                  Read the essay →
                </Link>
              </article>
            ) : null}
            {rest.length > 0 ? (
              <ol className="mt-12 divide-y divide-hairline border-t border-hairline">
                {rest.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="group grid gap-2 py-5 sm:grid-cols-[7.5rem_1fr] sm:items-baseline"
                    >
                      <span className="font-mono text-[13px] text-cream/40">{guide.metadata.date}</span>
                      <span className="font-serif text-2xl text-cream group-hover:text-gold-bright">
                        {guide.metadata.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : null}
          </>
        )}
      </section>
    </PageShell>
  );
}
