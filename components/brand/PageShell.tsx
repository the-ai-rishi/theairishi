import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { BrandConfig, CopyConfig, NavItem } from "@/lib/config";

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
  return (
    <div className="flex min-h-screen flex-col bg-ink text-cream/90">
      <Header navItems={navItems} brand={brand} copy={copy} showSearch={showSearch} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </div>
  );
}
