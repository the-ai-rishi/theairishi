import Image from "next/image";
import Link from "next/link";
import type { NavItem, BrandConfig, CopyConfig } from "@/lib/config";

interface FooterProps {
  navItems: NavItem[];
  brand?: BrandConfig;
  copy?: CopyConfig;
}

export default function Footer({ navItems, brand, copy }: FooterProps) {
  const logo = brand?.logo || "/brand/logo-horizontal.png";
  const logoAlt = brand?.logoAlt || "Home";
  const copyright = copy?.footerCopyright || brand?.name || "";

  return (
    <footer className="border-t border-white/[0.08] bg-black/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src={logo}
            alt={logoAlt}
            width={180}
            height={45}
            className="h-8 w-auto object-contain opacity-85 transition-opacity duration-300 group-hover:opacity-100"
          />
        </Link>

        <div className="flex flex-wrap items-center gap-6 text-xs text-white/40">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} className="hover:text-white transition">
              {item.label}
            </Link>
          ))}
          <span className="text-white/20">|</span>
          <span className="text-xs text-white/30">
            © {new Date().getFullYear()} {copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}
