import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { getBrandConfig } from "@/lib/config";

export default function LessonNotFound() {
  const brand = getBrandConfig();
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-cream selection:bg-gold/25 selection:text-ink">
      <div className="flex flex-col items-center text-center">
        <Logo brand={brand} variant="horizontal" />
        <p className="mt-8 kicker text-gold/70">{brand.name}</p>
        <h1 className="mt-4 font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl">
          Lesson not found
        </h1>
        <p className="mt-3 max-w-sm text-sm text-cream/40">
          This lesson does not exist or is not available yet.
        </p>
        <Link href="/learn" className="mt-8 bg-cream px-6 py-3 text-[13px] font-medium text-ink">
          Back to paths
        </Link>
      </div>
    </main>
  );
}
