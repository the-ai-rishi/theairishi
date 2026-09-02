import Image from "next/image";
import Link from "next/link";
import { getBrandConfig } from "@/lib/config";

export default function NotFound() {
  const brand = getBrandConfig();
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white selection:bg-violet-500/30 selection:text-white">
      <div className="flex flex-col items-center text-center">
        <Image
          src={brand.logo}
          alt={brand.logoAlt}
          width={160}
          height={40}
          className="h-8 w-auto object-contain opacity-70"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-violet-300/60 font-mono">
          404 — Page Not Found
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl text-white">
          Beyond the Horizon
        </h1>

        <p className="mt-3 text-sm text-white/40 max-w-md leading-relaxed">
          The path or document you requested does not exist on this platform.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/learn"
            className="inline-flex rounded-full bg-white px-6 py-3 text-xs font-semibold text-black transition hover:bg-white/90"
          >
            Explore Learning Hub
          </Link>

          <Link
            href="/"
            className="inline-flex rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-xs text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
