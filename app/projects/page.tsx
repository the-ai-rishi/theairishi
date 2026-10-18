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
      <div className="poster-index">
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
          <ol className="poster-list">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`}>
                  <span className="font-mono text-[12px] text-cream/45">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
                      {project.metadata.status}
                    </p>
                    <h2 className="mt-2">{project.metadata.title}</h2>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-cream/60">
                      {project.metadata.description}
                    </p>
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
