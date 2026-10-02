import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RouteDock from "@/components/layout/RouteDock";
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
  tone?: "home" | "learn" | "editorial" | "engineering" | "brand";
}

export default function PageShell({
  children,
  navItems,
  footerNav,
  brand,
  copy,
  showSearch = true,
  tone = "home",
}: PageShellProps) {
  const catalog = getLearnerCatalog();
  return (
    <div className="relative flex min-h-screen flex-col bg-ink text-cream/90" data-tone={tone}>
      <div className="relative z-[1] flex min-h-screen flex-col">
        <PointerHalo />
        <Header navItems={navItems} brand={brand} copy={copy} showSearch={showSearch} catalog={catalog} />
        <main id="main-content" className="mode-room flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer navItems={footerNav} brand={brand} copy={copy} />
        <RouteDock items={navItems} />
      </div>
    </div>
  );
}
