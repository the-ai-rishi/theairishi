"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/config";

export default function RouteDock({ items }: { items: NavItem[] }) {
  const pathname = usePathname() || "/";
  if (pathname === "/" || pathname.startsWith("/learn/")) return null;
  const links = items.filter((item) => item.href && item.href !== "/").slice(0, 4);
  if (!links.length) return null;

  return (
    <nav className="route-dock" aria-label="Sections">
      {links.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.id} href={item.href} aria-current={current ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
