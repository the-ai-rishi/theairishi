import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PageShell from "@/components/brand/PageShell";
import ProgramOverview from "@/components/learning/ProgramOverview";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
} from "@/lib/config";
import {
  getFeaturedProgramId,
  getProgramBySlug,
  getPublicPrograms,
  isProgramPublic,
} from "@/lib/programs";
import { canonicalAlternates } from "@/lib/urls";

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const featured = getFeaturedProgramId();
  const slugs = getPublicPrograms()
    .filter((program) => program.id !== featured)
    .map((program) => ({ slug: program.slug || program.id }));
  slugs.push({ slug: "devops" });
  return slugs;
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program || !isProgramPublic(program)) {
    return { title: "Not found" };
  }
  if (program.id === getFeaturedProgramId()) {
    return { title: program.title };
  }
  return {
    title: program.title,
    description: program.description,
    alternates: canonicalAlternates(`/programs/${program.slug || program.id}`),
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program || !isProgramPublic(program)) notFound();
  if (program.id === getFeaturedProgramId()) redirect("/learn");

  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      <ProgramOverview program={program} />
    </PageShell>
  );
}
