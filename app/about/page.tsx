import type { Metadata } from "next";
import PageShell from "@/components/brand/PageShell";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `About & Philosophy | ${brand.name}`,
    description:
      `${brand.name} is a field for understanding technology — learning from first principles, building in public, and following what changes.`,
  };
}

export default function AboutPage() {
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker text-gold/80">Colophon</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          Demystifying technology from first principles
        </h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-cream/60">
          Built for engineers and architects who want to understand systems, not collect certificates.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="dual-rule mb-12" />
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["Knowledge", "First-principles learning", "Skip surface-level tutorials. Learn how systems work underneath the abstraction."],
            ["Systems", "Build in public", "Labs, agents, and infrastructure blueprints — the engineering half of the mark."],
            ["Discovery", "Stay in the field", "Follow what is changing without turning the site into a content mill."],
          ].map(([kicker, title, body], i) => (
            <div key={title} className="border-t border-hairline pt-6">
              <p className={`font-mono text-[12px] tracking-[0.18em] uppercase ${i === 0 ? "text-gold" : i === 1 ? "text-circuit-bright" : "text-lotus"}`}>
                {kicker}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-cream">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/50">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
