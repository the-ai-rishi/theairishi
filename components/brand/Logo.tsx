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
  const alt = brand?.logoAlt || brand?.name || "Home";

  if (variant === "mark") {
    return (
      <Link href="/" className={`inline-flex items-center bg-ink ${className}`}>
        <Image
          src={brand?.logoMark || "/brand/logo-mark.png"}
          alt={alt}
          width={512}
          height={512}
          className="h-8 w-8 object-contain"
          priority={priority}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center bg-ink ${className}`}>
      <Image
        src={brand?.logo || "/brand/logo-horizontal.png"}
        alt={alt}
        width={1200}
        height={630}
        className="h-11 w-auto object-contain sm:h-12"
        priority={priority}
      />
    </Link>
  );
}
