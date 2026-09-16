import type { Metadata } from "next";
import PageShell from "@/components/brand/PageShell";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `About`,
    description: `${brand.name} is a first-principles knowledge studio for AI systems and the infrastructure that runs them.`,
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
          A studio for understanding systems
        </h1>
        {brand.lineage ? (
          <p className="mt-5 font-serif italic text-xl text-cream/50">{brand.lineage}</p>
        ) : null}
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-cream/60">
          {brand.name} publishes first-principles writing and curricula on artificial intelligence
          and the infrastructure that runs it. The work is for engineers who want to understand
          systems, not collect certificates.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="dual-rule mb-12" />
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["Learn", "From first principles", "Skip surface tutorials. Start with the mechanisms — then the tools make sense."],
            ["Build", "In public", "Labs and working systems. The engineering half of the mark."],
            ["Stay ahead", "Without the mill", "Follow what actually changes. No invented media. Nothing ships empty."],
          ].map(([kicker, title, body], i) => (
            <div key={title} className="border-t border-hairline pt-6">
              <p className={`font-mono text-[12px] tracking-[0.18em] uppercase ${i === 1 ? "text-circuit-bright" : "text-gold"}`}>
                {kicker}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-cream">{title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/50">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
