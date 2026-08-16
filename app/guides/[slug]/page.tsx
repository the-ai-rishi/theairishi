import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllGuideSlugs, getGuide } from "@/lib/guides";
import LessonContent from "@/components/learning/LessonContent";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return { title: "Guide Not Found | The AI Rishi" };
  }

  return {
    title: `${guide.metadata.title} | The AI Rishi`,
    description: guide.metadata.description,
  };
}

export default async function GuideSinglePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="The AI Rishi"
              width={200}
              height={50}
              className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
              priority
            />
          </Link>

          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Guides</span>
          </Link>
        </nav>
      </header>

      {/* Guide Header */}
      <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="flex items-center gap-3 text-xs text-white/40 mb-6">
          <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-violet-300 font-mono">
            {guide.metadata.category}
          </span>
          <span>{guide.metadata.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {guide.metadata.readTime || 5} min read
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl text-white">
          {guide.metadata.title}
        </h1>

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/50 border-b border-white/[0.08] pb-10">
          {guide.metadata.description}
        </p>

        <div className="pt-10">
          <LessonContent content={guide.content} />
        </div>
      </article>
    </main>
  );
}
