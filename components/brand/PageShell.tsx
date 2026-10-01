import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AmbientField from "@/components/atmosphere/AmbientField";
import PointerHalo from "@/components/motion/PointerHalo";
import type { BrandConfig, CopyConfig, NavItem } from "@/lib/config";
import { getLearnerCatalog } from "@/lib/programs";

interface PageShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  footerNav: NavItem[];
  brand: BrandConfig;
  copy: CopyConfig;
  showSearch?: boolean;
}

export default function PageShell({
  children,
  navItems,
  footerNav,
  brand,
  copy,
  showSearch = true,
}: PageShellProps) {
  const catalog = getLearnerCatalog();
  return (
    <div className="relative flex min-h-screen flex-col bg-ink text-cream/90">
      <AmbientField />
      <div className="relative z-[1] flex min-h-screen flex-col">
        <PointerHalo />
        <Header navItems={navItems} brand={brand} copy={copy} showSearch={showSearch} catalog={catalog} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer navItems={footerNav} brand={brand} copy={copy} />
      </div>
    </div>
  );
}
