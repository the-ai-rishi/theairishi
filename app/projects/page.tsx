import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/brand/PageShell";
import { getAllProjectSummaries } from "@/lib/projects";
import { getMainNavigation, getFooterNavigation, getBrandConfig, getPlatformCopy, isContentTypeRoutable } from "@/lib/config";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrandConfig();
  return {
    title: `Labs | ${brand.name}`,
    description:
      "Real-world labs, agent architectures, and infrastructure built in public.",
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
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker text-circuit-bright">Build</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          Labs
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream/55">
          Hands-on architectures and open labs — tangible work, not course tiles.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <p className="border-t border-hairline py-16 text-cream/40">
            Labs are currently in development.
          </p>
        ) : (
          <div className="border-t border-hairline">
            {projects.map((project, index) => (
              <article
                key={project.slug}
                className={`grid gap-6 border-b border-hairline py-10 lg:grid-cols-12 ${
                  index % 2 === 1 ? "lg:text-right" : ""
                }`}
              >
                <div className={`lg:col-span-2 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <span className="font-mono text-[13px] text-circuit-bright">
                    Lab {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className={`lg:col-span-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <p className="font-mono text-[12px] tracking-[0.14em] text-cream/40">
                    {project.metadata.category} · {project.metadata.status}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl">
                    {project.metadata.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-cream/50 lg:inline-block">
                    {project.metadata.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] text-cream/35">
                    {project.metadata.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="link-editorial mt-6 inline-block font-mono text-[14px] text-circuit-bright"
                  >
                    Open the lab →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
