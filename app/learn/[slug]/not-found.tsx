import Image from "next/image";
import Link from "next/link";
import { getBrandConfig } from "@/lib/config";

export default function LessonNotFound() {
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

        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-violet-300/60">
          {brand.name}
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl text-white">
          Lesson not found
        </h1>

        <p className="mt-3 text-sm text-white/40 max-w-sm">
          This lesson does not exist or is not available yet in the curriculum.
        </p>

        <Link
          href="/learn"
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-xs font-semibold text-black transition hover:bg-white/90"
        >
          Back to Learning Hub
        </Link>
      </div>
    </main>
  );
}
