"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import SearchModal from "@/components/search/SearchModal";
import Logo from "@/components/brand/Logo";
import type { NavItem, BrandConfig, CopyConfig } from "@/lib/config";

interface HeaderProps {
  navItems: NavItem[];
  brand?: BrandConfig;
  copy?: CopyConfig;
  showSearch?: boolean;
}

export default function Header({
  navItems,
  brand,
  copy,
  showSearch = true,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerCta = copy?.headerCta || "Start";
  const headerCtaHref = copy?.headerCtaHref || "/learn";

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Logo brand={brand} variant="horizontal" priority />

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="link-editorial font-mono text-[13px] tracking-[0.14em] text-cream/60 hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {showSearch ? <SearchModal /> : null}

          <Link
            href={headerCtaHref}
            className="hidden font-mono text-[13px] tracking-[0.14em] text-gold hover:text-gold-bright sm:inline-flex"
          >
            {headerCta}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center text-cream/70 transition hover:text-cream lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-b border-hairline bg-ink px-4 py-6 lg:hidden"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-mono text-[14px] tracking-[0.16em] text-cream/75 hover:text-cream"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={headerCtaHref}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 font-mono text-[14px] tracking-[0.16em] text-gold"
            >
              {headerCta} →
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
