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
  const label = brand?.logoAlt || brand?.name || "Home";
  const markSrc = brand?.logoMark || "/brand/logo-mark.png";

  if (variant === "mark") {
    return (
      <Link
        href="/"
        aria-label={label}
        className={`inline-flex items-center ${className}`}
      >
        <Image
          src={markSrc}
          alt=""
          width={512}
          height={512}
          className="h-8 w-8 object-contain"
          priority={priority}
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={label}
      className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <Image
        src={markSrc}
        alt=""
        width={512}
        height={512}
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
        priority={priority}
      />
      {brand?.name ? (
        <span className="font-serif text-lg tracking-[0.01em] text-cream sm:text-xl">
          {brand.name}
        </span>
      ) : null}
    </Link>
  );
}
