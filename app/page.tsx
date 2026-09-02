import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionRenderer from "@/components/home/SectionRenderer";
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
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-350px] h-[850px] w-[850px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[170px]" />
        <div className="absolute right-[-200px] top-[500px] h-[550px] w-[550px] rounded-full bg-indigo-600/5 blur-[150px]" />
      </div>

      <Header navItems={mainNav} brand={brand} copy={copy} />

      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
