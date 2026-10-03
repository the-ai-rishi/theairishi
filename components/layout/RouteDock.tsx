"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/config";

/** Phone navigation. Every enabled main item, not a sliced desktop bar. */
export default function RouteDock({ items }: { items: NavItem[] }) {
  const pathname = usePathname() || "/";
  const links = items.filter((item) => item.href);
  if (!links.length) return null;

  return (
    <nav className="system-nav" aria-label="Sections">
      {links.map((item) => {
        const current = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
        return (
          <Link key={item.id} href={item.href} aria-current={current ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
