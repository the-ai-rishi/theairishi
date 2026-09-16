"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[theairishi] unhandled render error", error.digest || error.message);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-ink px-6 text-cream"
    >
      <div className="flex max-w-lg flex-col items-center text-center">
        <p className="kicker text-gold/70">Something went wrong</p>
        <h1 className="mt-4 font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl">
          The page could not be rendered
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-cream/45">
          This is a platform error, not a missing document. You can retry or return home.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-cream px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-ink hover:bg-gold-bright"
          >
            Try again
          </button>
          <Link href="/" className="link-editorial font-mono text-[14px] text-gold">
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
