import type { Metadata } from "next";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProject } from "@/lib/projects";
import LessonContent from "@/components/learning/LessonContent";
import { getBrandConfig, getFooterNavigation, getMainNavigation, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  if (!isContentTypeRoutable("projects")) return [];
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  const brand = getBrandConfig();

  if (!project) {
    return { title: `Project Not Found | ${brand.name}` };
  }

  return {
    title: `${project.metadata.title} | Projects | ${brand.name}`,
    description: project.metadata.description,
  };
}

export default async function ProjectSinglePage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!isContentTypeRoutable("projects")) notFound();
  const project = await getProject(slug);
  const brand = getBrandConfig();

  if (!project) {
    notFound();
  }

  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const copy = getPlatformCopy();

  return (
    <main className="min-h-screen bg-ink text-cream selection:bg-gold/25 selection:text-ink pb-24">
      <Header navItems={mainNav} brand={brand} copy={copy} />

      {/* Project Header */}
      <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-cream/40 mb-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-circuit-bright">
            {project.metadata.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
            {project.metadata.status}
          </span>
        </div>

        <h1 className="font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl lg:text-6xl">
          {project.metadata.title}
        </h1>

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-cream/50">
          {project.metadata.description}
        </p>

        {/* Tech Stack & External Links */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-4">
          <div className="flex flex-wrap gap-1.5">
            {project.metadata.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-white/[0.03] px-2.5 py-1 text-xs text-cream/50 font-mono"
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
                className="inline-flex items-center gap-1.5 text-cream/60 hover:text-cream transition"
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
                className="inline-flex items-center gap-1.5 text-circuit-bright hover:text-cream transition"
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
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
