import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { getBrandConfig } from "@/lib/config";

/**
 * Runtime fallback only. Unpublished /learn slugs 404 via middleware rewrite
 * to /missing-lesson with HTTP 404. Do not treat this file as that mechanism,
 * and do not restore `dynamicParams = false` (that 404'd published Day 1 on
 * OpenNext Workers).
 */
export default function LessonNotFound() {
  const brand = getBrandConfig();
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-cream selection:bg-gold/25 selection:text-ink">
      <div className="flex flex-col items-center text-center">
        <Logo brand={brand} variant="horizontal" />
        <p className="mt-8 kicker text-gold/70">404</p>
        <h1 className="mt-4 font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl">
          This day is not published yet
        </h1>
        <p className="mt-3 max-w-sm text-sm text-cream/40">
          A day becomes a page only when its lesson file exists. Unpublished days stay titles on the 120-day plan.
        </p>
        <Link href="/learn" className="mt-8 bg-cream px-6 py-3 text-[13px] font-medium text-ink">
          Back to 120 Days
        </Link>
      </div>
    </main>
  );
}
