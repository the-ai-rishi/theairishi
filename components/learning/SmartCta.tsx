"use client";

import Link from "next/link";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { useLessonProgress } from "./useLessonProgress";

interface SmartCtaProps {
  catalog: LearnerCatalog;
  fallbackLabel?: string;
  fallbackHref?: string;
  className?: string;
  variant?: "primary" | "header";
}

export default function SmartCta({
  catalog,
  fallbackLabel = "Start Day 1",
  fallbackHref = "/learn/day-01",
  className,
  variant = "primary",
}: SmartCtaProps) {
  const { state, hasHydrated } = useLessonProgress();
  const target = hasHydrated ? resolveContinue(state, catalog) : null;
  const href = target?.href || fallbackHref;
  const label = target?.ctaLabel || fallbackLabel;
  const classes =
    className ||
    (variant === "header" ? "btn-primary hidden sm:inline-flex" : "btn-primary");

  return (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}
