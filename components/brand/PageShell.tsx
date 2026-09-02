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
    <main className="flex min-h-screen flex-col bg-ink text-cream/90 selection:bg-gold/25 selection:text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-18%] h-[620px] w-[620px] rounded-full bg-gold/[0.055] blur-[150px]" />
        <div className="absolute right-[-16%] top-[28%] h-[540px] w-[540px] rounded-full bg-circuit/[0.07] blur-[150px]" />
      </div>
      <Header navItems={navItems} brand={brand} copy={copy} showSearch={showSearch} />
      <div className="flex-1">{children}</div>
      <Footer navItems={footerNav} brand={brand} copy={copy} />
    </main>
  );
}
