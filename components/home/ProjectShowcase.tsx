import Link from "next/link";
import { ArrowRight, FolderCode } from "lucide-react";
import { getAllProjectSummaries } from "@/lib/projects";
import type { HomepageSection } from "@/lib/config";

interface ProjectShowcaseProps {
  section?: HomepageSection;
}

export default function ProjectShowcase({ section }: ProjectShowcaseProps) {
  const projects = getAllProjectSummaries();
  const title = section?.title ?? "Projects & Open-Source Labs";
  const subtitle = section?.subtitle ?? "Hands-On Build-In-Public";
  const ctaLabel = section?.ctaLabel ?? "Explore All Projects";
  const ctaHref = section?.ctaHref ?? "/projects";

  if (projects.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white/[0.01] border-y border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-300">
              <FolderCode className="h-3.5 w-3.5" />
              <span>{subtitle}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              {title}
            </h2>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-white transition"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 flex flex-col justify-between transition duration-300 hover:border-emerald-500/30 hover:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-[10px] uppercase font-mono tracking-wider text-emerald-300">
                    {project.metadata.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-white/40 font-mono">
                    {project.metadata.status}
                  </span>
                </div>

                <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white group-hover:text-emerald-200 transition">
                  {project.metadata.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-white/50 leading-relaxed">
                  {project.metadata.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                  {project.metadata.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/40 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
                >
                  <span>Read Architecture</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
