"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import SearchModal from "@/components/search/SearchModal";
import Logo from "@/components/brand/Logo";
import type { NavItem, BrandConfig, CopyConfig } from "@/lib/config";
import { PRIMARY_NAV_LIMIT, splitPrimaryNav } from "@/lib/visibility-core";

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
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const headerCta = copy?.headerCta || "Start";
  const headerCtaHref = copy?.headerCtaHref || "/learn";
  const { primary, explore } = splitPrimaryNav(navItems, PRIMARY_NAV_LIMIT);

  useEffect(() => {
    if (!exploreOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExploreOpen(false);
      }
    }

    function onPointer(event: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [exploreOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Logo brand={brand} variant="horizontal" priority />

        <div className="hidden items-center gap-8 lg:flex">
          {primary.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="link-editorial font-mono text-[13px] tracking-[0.14em] text-cream/60 hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
          {explore.length > 0 ? (
            <div className="relative" ref={exploreRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1 font-mono text-[13px] tracking-[0.14em] text-cream/60 hover:text-cream"
                aria-expanded={exploreOpen}
                aria-controls="header-explore-menu"
                aria-haspopup="true"
                onClick={() => setExploreOpen((open) => !open)}
              >
                Explore
                <ChevronDown
                  className={`h-3.5 w-3.5 transition ${exploreOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {exploreOpen ? (
                <div
                  id="header-explore-menu"
                  role="menu"
                  className="absolute right-0 mt-3 min-w-[12rem] border border-hairline bg-ink py-2 shadow-lg"
                >
                  {explore.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setExploreOpen(false)}
                      className="block px-4 py-2 font-mono text-[13px] tracking-[0.14em] text-cream/70 hover:bg-white/5 hover:text-cream"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
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
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setExploreOpen(false);
            }}
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
