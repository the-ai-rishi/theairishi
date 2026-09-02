"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import SearchModal from "@/components/search/SearchModal";
import type { NavItem, BrandConfig, CopyConfig } from "@/lib/config";

interface HeaderProps {
  navItems: NavItem[];
  brand?: BrandConfig;
  copy?: CopyConfig;
}

export default function Header({ navItems, brand, copy }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logo = brand?.logo || "/brand/logo-horizontal.png";
  const logoAlt = brand?.logoAlt || "Home";
  const headerCta = copy?.headerCta || "Start";
  const headerCtaHref = copy?.headerCtaHref || "/learn";

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src={logo}
            alt={logoAlt}
            width={220}
            height={55}
            className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <SearchModal />

          {/* Header CTA */}
          <Link
            href={headerCtaHref}
            className="hidden sm:inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition duration-200 hover:bg-white/90"
          >
            {headerCta}
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-b border-white/10 bg-[#07070a] px-4 py-6 lg:hidden">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-white/80 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              {/* Mobile CTA */}
              <Link
                href={headerCtaHref}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex w-full justify-center rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
              >
                {headerCta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
