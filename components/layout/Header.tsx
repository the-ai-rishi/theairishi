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
  const headerCta = copy?.headerCta || "Start Day 1";
  const headerCtaHref = copy?.headerCtaHref || "/learn/day-01";
  const visible = navItems.filter((item) => item.href !== "/");
  const { primary, explore } = splitPrimaryNav(visible, PRIMARY_NAV_LIMIT);

  useEffect(() => {
    if (!exploreOpen && !mobileMenuOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExploreOpen(false);
        setMobileMenuOpen(false);
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
  }, [exploreOpen, mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-ink/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:px-8" aria-label="Primary">
        <Logo brand={brand} variant="horizontal" />

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
                className="inline-flex min-h-11 items-center gap-1 font-mono text-[13px] tracking-[0.14em] text-cream/60 hover:text-cream"
                aria-expanded={exploreOpen}
                aria-controls="header-explore-menu"
                aria-haspopup="menu"
                onClick={() => setExploreOpen((open) => !open)}
              >
                More
                <ChevronDown
                  className={`h-3.5 w-3.5 transition ${exploreOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {exploreOpen ? (
                <div
                  id="header-explore-menu"
                  role="menu"
                  className="absolute right-0 mt-3 min-w-[12rem] border border-hairline bg-ink py-2"
                >
                  {explore.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setExploreOpen(false)}
                      className="block px-4 py-2.5 font-mono text-[13px] tracking-[0.14em] text-cream/70 hover:bg-cream/[0.04] hover:text-cream"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {showSearch ? <SearchModal /> : null}

          <Link href={headerCtaHref} className="btn-primary hidden sm:inline-flex">
            {headerCta}
          </Link>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setExploreOpen(false);
            }}
            className="flex h-11 w-11 items-center justify-center text-cream/70 transition hover:text-cream lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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
          <div className="flex flex-col gap-1">
            {visible.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-12 items-center font-mono text-[15px] tracking-[0.16em] text-cream/80 hover:text-cream"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={headerCtaHref}
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary mt-4 self-start"
            >
              {headerCta}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
