"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { href: "/", label: "TOP", match: (p: string) => p === "/" },
  { href: "/works", label: "WORKS", match: (p: string) => p.startsWith("/works") },
  { href: "/services", label: "SERVICES", match: (p: string) => p.startsWith("/services") },
  { href: "/blog", label: "BLOG", match: (p: string) => p.startsWith("/blog") },
  { href: "/contact", label: "CONTACT", match: (p: string) => p.startsWith("/contact") },
];

export function DotNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-12 md:gap-16">
      {SECTIONS.map((s) => {
        const isActive = s.match(pathname);
        return (
          <Link
            key={s.href}
            href={s.href}
            className="group relative flex flex-col items-center py-2"
            aria-label={s.label}
          >
            <span
              className={cn(
                "block h-3 w-3 transition-all duration-300",
                isActive
                  ? "bg-accent shadow-[0_0_14px_rgba(176,38,255,0.9)] scale-110"
                  : "bg-foreground/25 group-hover:bg-foreground/70"
              )}
            />
            <span
              className={cn(
                "absolute top-7 font-mono text-[11px] tracking-[0.3em] transition-opacity duration-300 whitespace-nowrap",
                isActive
                  ? "opacity-100 text-foreground"
                  : "opacity-0 group-hover:opacity-70"
              )}
            >
              {s.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
