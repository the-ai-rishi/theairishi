import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { getBrandConfig } from "@/lib/config";

export default function NotFound() {
  const brand = getBrandConfig();
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-ink px-6 text-cream selection:bg-gold/25 selection:text-ink">
      <div className="flex flex-col items-center text-center">
        <Logo brand={brand} variant="horizontal" />
        <p className="mt-8 kicker text-gold/70">404 — Beyond the field</p>
        <h1 className="mt-4 font-serif text-4xl tracking-[0.01em] text-cream sm:text-6xl">
          This path does not exist
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-cream/45">
          The document you requested is not on this platform.
        </p>
        <div className="mt-10 flex items-center gap-8">
          <Link href="/" className="link-editorial font-mono text-[14px] text-gold">
            Return home
          </Link>
          <Link
            href="/learn"
            className="bg-cream px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-ink"
          >
            Open paths
          </Link>
        </div>
      </div>
    </main>
  );
}
