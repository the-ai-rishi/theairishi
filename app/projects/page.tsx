import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderCode, Sparkles } from "lucide-react";
import { getAllProjectSummaries } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects & Labs | The AI Rishi",
  description:
    "Real-world open source projects, AI agent labs, and cloud infrastructure implementations built in public.",
};

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

export default function ProjectsPage() {
  const projects = getAllProjectSummaries();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
      </div>

      {/* Navigation Header */}
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

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/learn" className="text-sm text-white/50 transition hover:text-white">
              Learning Hub
            </Link>
            <Link href="/guides" className="text-sm text-white/50 transition hover:text-white">
              Guides
            </Link>
            <Link href="/projects" className="text-sm text-white transition font-medium">
              Projects
            </Link>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-xs sm:text-sm text-white/80 transition hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
          >
            Home
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
          <FolderCode className="h-3.5 w-3.5 text-violet-300" />
          Build in Public · Open Source Labs
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl text-white">
          Projects & Hands-On Labs
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/50 max-w-2xl mx-auto">
          Real AI agent architectures, cloud deployment blueprints, and open-source lab projects built from first principles.
        </p>
      </section>

      {/* Projects List */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-12 text-center text-white/40">
            Open-source projects and labs are currently in development.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 flex flex-col justify-between transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-0.5 text-[10px] uppercase tracking-wider text-violet-300 font-mono">
                      {project.metadata.category}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-emerald-300 font-mono">
                      {project.metadata.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white group-hover:text-violet-200 transition">
                    {project.metadata.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
                    {project.metadata.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                    {project.metadata.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/35 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
                  >
                    <span>Read Architecture</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {project.metadata.githubUrl && (
                    <a
                      href={project.metadata.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/40 hover:text-white transition flex items-center gap-1"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
