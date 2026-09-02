import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getBrandConfig, getPlatformCopy } from "@/lib/config";

export default function CallToAction() {
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-950/30 via-black to-black p-8 sm:p-14 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{brand.name} Ecosystem</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-white">
              {brand.tagline}
            </h2>

            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              {brand.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={copy.heroPrimaryCtaHref || "/learn"}
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition duration-300 hover:bg-white/90 shadow-lg"
              >
                <span>{copy.heroPrimaryCta || "Start Learning"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/80 transition duration-300 hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
              >
                <span>Read Philosophy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
