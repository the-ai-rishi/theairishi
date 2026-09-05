import Link from "next/link";
import Logo from "@/components/brand/Logo";
import type { NavItem, BrandConfig, CopyConfig } from "@/lib/config";

interface FooterProps {
  navItems: NavItem[];
  brand?: BrandConfig;
  copy?: CopyConfig;
}

export default function Footer({ navItems, brand, copy }: FooterProps) {
  const copyright = copy?.footerCopyright || brand?.name || "";

  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo brand={brand} variant="mark" />
          <div>
            <p className="font-serif text-lg tracking-[0.02em] text-cream/80">
              {brand?.name}
            </p>
            <p className="font-mono text-[12px] tracking-[0.08em] text-cream/35">
              © {new Date().getFullYear()} {copyright}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="link-editorial font-mono text-[12px] tracking-[0.14em] text-cream/55 hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
