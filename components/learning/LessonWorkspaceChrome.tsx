"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import SearchModal from "@/components/search/SearchModal";
import type { BrandConfig } from "@/lib/config";
import { formatDayLabel } from "@/lib/labels";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { useLessonProgress } from "./useLessonProgress";

interface LessonWorkspaceChromeProps {
  slug: string;
  day?: number;
  stage: string;
  catalog: LearnerCatalog;
  brand: BrandConfig;
  nav: Array<{ nav: string; href: string; label: string }>;
}

export default function LessonWorkspaceChrome({
  slug,
  day,
  stage,
  catalog,
  brand,
  nav,
}: LessonWorkspaceChromeProps) {
  const { state, hasHydrated, isCompleted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const count = hasHydrated ? target.completedCount : 0;
  const completedHere = hasHydrated && isCompleted(slug);
  const [active, setActive] = useState(nav[0]?.href || "");

  useEffect(() => {
    if (!nav.length) return;
    const onScroll = () => {
      const marker = 104;
      let current = nav[0]?.href || "";
      for (const item of nav) {
        const id = item.href.replace("#", "");
        const el = document.getElementById(id + "-block") || document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) current = item.href;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [nav]);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-ink/94 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        <Logo brand={brand} variant="horizontal" priority />
        <p className="min-w-0 truncate font-mono text-[11px] text-cream/55 sm:text-[12px]">
          {day ? (
            <>
              <span className="hidden sm:inline">
                {formatDayLabel(day)} of {catalog.totalDays}
                <span className="text-cream/30"> · {stage}</span>
              </span>
              <span className="sm:hidden">
                {formatDayLabel(day)} · {stage}
              </span>
            </>
          ) : (
            stage
          )}
        </p>
        <Link
          href="/learn"
          className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-cream/40 hover:text-gold sm:text-[12px]"
        >
          {count}/{catalog.totalDays}
          <span className="sr-only"> days complete. Open the 120-day plan.</span>
        </Link>
        {completedHere ? <span className="sr-only"> This day is complete.</span> : null}
        <SearchModal compact />
      </div>
      {nav.length > 0 ? (
        <nav aria-label="On this day" className="workspace-chips flex gap-0.5 overflow-x-auto px-3 sm:px-6 lg:px-8">
          {nav.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.nav}
                href={item.href}
                className={`inline-flex min-h-9 shrink-0 items-center px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  isActive ? "text-cream" : "text-cream/38 hover:text-gold"
                }`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
