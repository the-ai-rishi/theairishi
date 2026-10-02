import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import { getAllProjectSummaries } from "@/lib/projects";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import { notFound } from "next/navigation";
import { canonicalAlternates } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Labs",
    description: "Build write-ups and practical labs. Existing labs are earlier notes, not FORGE-120.",
    alternates: canonicalAlternates("/projects"),
  };
}

export default function ProjectsPage() {
  if (!isContentTypeRoutable("projects")) notFound();
  const projects = getAllProjectSummaries();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy} tone="engineering">
      <div className="artefact-index">
        <header className="mb-8 max-w-xl">
          <p className="kicker text-gold/80">Build</p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.92] tracking-[0.01em] text-cream sm:text-7xl">Labs</h1>
          <p className="mt-5 text-[16px] leading-relaxed text-cream/55">
            Build write-ups and practical labs. These notes are earlier work. They are not FORGE-120.
          </p>
        </header>
        {projects.length === 0 ? (
          <p className="border-t border-hairline py-16 text-cream/40">Labs are currently in development.</p>
        ) : (
          <ol className="artefact-ledger">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`}>
                  <span className="font-mono text-[12px] text-gold/80">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-serif text-2xl text-cream sm:text-3xl">{project.metadata.title}</span>
                    <span className="mt-1 block max-w-2xl text-[15px] leading-relaxed text-cream/50">
                      {project.metadata.description}
                    </span>
                    <span className="mt-2 block font-mono text-[12px] text-cream/35">
                      {project.metadata.technologies.join(" · ")}
                    </span>
                  </span>
                  <span className="artefact-meta">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream/45">
                      {project.metadata.category}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream/70">
                      {project.metadata.status}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </PageShell>
  );
}
