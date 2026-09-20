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
    if (!nav.length || typeof IntersectionObserver === "undefined") return;
    const ids = nav.map((item) => item.href.replace("#", "")).filter(Boolean);
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive("#" + visible.target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0.15, 0.4, 0.7] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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
        <nav aria-label="On this day" className="workspace-chips flex gap-0.5 overflow-x-auto px-3 pb-1.5 sm:px-6 lg:px-8">
          {nav.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.nav}
                href={item.href}
                className={`shrink-0 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  isActive ? "text-cream" : "text-cream/38 hover:text-gold"
                }`}
                aria-current={isActive ? "location" : undefined}
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
