import type { Metadata } from "next";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProject } from "@/lib/projects";
import LessonContent from "@/components/learning/LessonContent";
import { getBrandConfig, getFooterNavigation, getMainNavigation, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import PageShell from "@/components/brand/PageShell";
import { canonicalAlternates } from "@/lib/urls";

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

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.metadata.title,
    description: project.metadata.description,
    alternates: canonicalAlternates(`/projects/${slug}`),
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
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy} tone="engineering">
      <article className="artefact-index">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-cream/40">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">{project.metadata.category}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/55">{project.metadata.status}</span>
        </div>

        <h1 className="max-w-3xl font-serif text-4xl tracking-[0.01em] text-cream sm:text-5xl lg:text-6xl">
          {project.metadata.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/50 sm:text-lg">{project.metadata.description}</p>

        <div className="mt-6 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-y border-hairline py-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {project.metadata.technologies.map((tech) => (
              <span key={tech} className="font-mono text-[12px] text-cream/50">
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
                className="inline-flex items-center gap-1.5 text-cream/60 hover:text-cream"
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
                className="inline-flex items-center gap-1.5 text-cream/70 hover:text-cream"
              >
                <Globe className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <div className="max-w-3xl pt-10">
          <LessonContent content={project.content} />
        </div>
      </article>
    </PageShell>
  );
}
