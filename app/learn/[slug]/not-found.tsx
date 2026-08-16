import Image from "next/image";
import Link from "next/link";

export default function LessonNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white selection:bg-violet-500/30 selection:text-white">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/brand/logo-mark.png"
          alt="The AI Rishi logo mark"
          width={80}
          height={80}
          className="h-16 w-16 object-contain"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-violet-300/60">
          The AI Rishi
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
