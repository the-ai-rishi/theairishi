import type { Metadata } from "next";
import PageShell from "@/components/brand/PageShell";
import ProgramOverview from "@/components/learning/ProgramOverview";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
  isContentTypeRoutable,
} from "@/lib/config";
import { getProgram } from "@/lib/programs";
import { canonicalAlternates } from "@/lib/urls";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const program = getProgram();
  return {
    title: program.title,
    description: program.description,
    alternates: canonicalAlternates("/learn"),
    openGraph: {
      title: program.title,
      description: program.description,
      type: "website",
    },
  };
}

export default function LearnPage() {
  if (!isContentTypeRoutable("learn")) notFound();
  const program = getProgram();
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
