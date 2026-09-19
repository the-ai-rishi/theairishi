import type { Metadata } from "next";
import ProductHome from "@/components/product/ProductHome";
import PageShell from "@/components/brand/PageShell";
import { getResolvedHomepage } from "@/lib/homepage";
import {
  getMainNavigation,
  getFooterNavigation,
  getBrandConfig,
  getPlatformCopy,
} from "@/lib/config";
import { getProgram } from "@/lib/programs";
import { canonicalAlternates } from "@/lib/urls";

const program = getProgram();
const brand = getBrandConfig();

export const metadata: Metadata = {
  title: {
    absolute: `${program.title} | ${brand.name}`,
  },
  description: brand.description,
  alternates: canonicalAlternates("/"),
};

export default function Home() {
  const sections = getResolvedHomepage();
  const mainNav = getMainNavigation();
  const footerNav = getFooterNavigation();
  const brandConfig = getBrandConfig();
  const copy = getPlatformCopy();

  return (
    <PageShell navItems={mainNav} footerNav={footerNav} brand={brandConfig} copy={copy}>
      <ProductHome sections={sections} />
    </PageShell>
  );
}
