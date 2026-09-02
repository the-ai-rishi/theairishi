import type { Metadata } from "next";
import SectionRenderer from "@/components/home/SectionRenderer";
import PageShell from "@/components/brand/PageShell";
import { getResolvedHomepage } from "@/lib/homepage";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
} from "@/lib/config";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function Home() {
  const sections = getResolvedHomepage();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brand = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brand} copy={copy}>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </PageShell>
  );
}
