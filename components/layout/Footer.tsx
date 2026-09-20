import Link from "next/link";
import Logo from "@/components/brand/Logo";
import DestinationLinks from "@/components/brand/DestinationLinks";
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
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-12">
        <div className="flex items-start gap-4 lg:col-span-5">
          <Logo brand={brand} variant="mark" />
          <div>
            <p className="font-serif text-xl tracking-[0.02em] text-cream">{brand?.name}</p>
            {brand?.tagline ? (
              <p className="mt-1 font-mono text-[12px] tracking-[0.08em] text-cream/40">
                {brand.tagline}
              </p>
            ) : null}
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-cream/40">
              {brand?.description}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-start gap-x-6 gap-y-3 lg:col-span-4 lg:justify-center" aria-label="Footer">
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

        <div className="lg:col-span-3 lg:text-right">
          <DestinationLinks surface="footer" compact />
          {brand?.email ? (
            <a
              href={`mailto:${brand.email}`}
              className="link-editorial mt-4 inline-flex font-mono text-[12px] tracking-[0.12em] text-cream/50 hover:text-gold"
            >
              {brand.email}
            </a>
          ) : null}
          <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-cream/30">
            © {new Date().getFullYear()} {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
