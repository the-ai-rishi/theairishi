import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProject } from "@/lib/projects";
import LessonContent from "@/components/learning/LessonContent";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found | The AI Rishi" };
  }

  return {
    title: `${project.metadata.title} | Projects | The AI Rishi`,
    description: project.metadata.description,
  };
}

export default async function ProjectSinglePage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
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
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Projects</span>
          </Link>
        </nav>
      </header>

      {/* Project Header */}
      <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mb-6">
          <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-violet-300 font-mono">
            {project.metadata.category}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-emerald-300 font-mono">
            {project.metadata.status}
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl text-white">
          {project.metadata.title}
        </h1>

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/50">
          {project.metadata.description}
        </p>

        {/* Tech Stack & External Links */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/[0.08] py-4">
          <div className="flex flex-wrap gap-1.5">
            {project.metadata.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-white/[0.03] px-2.5 py-1 text-xs text-white/50 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs">
            {project.metadata.githubUrl && (
              <a
                href={project.metadata.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.metadata.demoUrl && (
              <a
                href={project.metadata.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-violet-300 hover:text-white transition"
              >
                <Globe className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <div className="pt-10">
          <LessonContent content={project.content} />
        </div>
      </article>
    </main>
  );
}
