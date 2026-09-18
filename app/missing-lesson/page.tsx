import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { getBrandConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Lesson not found",
  robots: { index: false, follow: false },
};

export default function MissingLessonPage() {
  const brand = getBrandConfig();
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-ink px-6 text-cream selection:bg-gold/25 selection:text-ink"
    >
      <div className="flex flex-col items-center text-center">
        <Logo brand={brand} variant="horizontal" />
        <p className="mt-8 kicker text-gold/70">404</p>
        <h1 className="mt-4 font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl">
          This day is not published yet
        </h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-cream/45">
          A day becomes a page only when its lesson file exists. Unpublished days stay titles on the 120-day plan.
        </p>
        <Link href="/learn" className="btn-primary mt-8">
          Back to 120 Days
        </Link>
      </div>
    </main>
  );
}
