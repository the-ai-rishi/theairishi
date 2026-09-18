import Link from "next/link";
import type { BrandConfig } from "@/lib/config";
import BrandMark from "./BrandMark";

interface LogoProps {
  brand?: BrandConfig;
  variant?: "horizontal" | "mark";
  className?: string;
  priority?: boolean;
}

export default function Logo({
  brand,
  variant = "horizontal",
  className = "",
}: LogoProps) {
  const name = brand?.name || "The AI Rishi";
  const label = brand?.logoAlt || name;

  if (variant === "mark") {
    return (
      <Link href="/" aria-label={`${label}, home`} className={`inline-flex items-center ${className}`}>
        <BrandMark className="h-8 w-8 text-gold" />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={`${label}, home`}
      className={`inline-flex min-w-0 items-center gap-2 sm:gap-2.5 ${className}`}
    >
      <BrandMark className="h-6 w-6 shrink-0 text-gold sm:h-7 sm:w-7" />
      <span className="truncate font-serif text-[15px] leading-none tracking-[0.02em] text-cream sm:text-xl">
        {name}
      </span>
    </Link>
  );
}
