import Image from "next/image";
import Link from "next/link";
import type { BrandConfig } from "@/lib/config";

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
  priority = false,
}: LogoProps) {
  const name = brand?.name || "The AI Rishi";
  const label = brand?.logoAlt || name;
  const lockup = brand?.logo || "/brand/logo-horizontal.png";

  if (variant === "mark") {
    return (
      <Link
        href="/"
        aria-label={label}
        className={`inline-flex items-center ${className}`}
      >
        <Image
          src={lockup}
          alt=""
          width={1200}
          height={630}
          className="h-8 w-auto object-contain"
          priority={priority}
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={label}
      className={`inline-flex items-center ${className}`}
    >
      <span className="font-serif text-lg tracking-[0.02em] text-cream sm:text-xl">
        {name}
      </span>
    </Link>
  );
}
