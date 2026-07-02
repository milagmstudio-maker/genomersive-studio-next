"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { href: "/", label: "TOP", jp: "ホーム", match: (p: string) => p === "/" },
  { href: "/works", label: "WORKS", jp: "実績", match: (p: string) => p.startsWith("/works") },
  { href: "/services", label: "SERVICES", jp: "料金", match: (p: string) => p.startsWith("/services") },
  { href: "/blog", label: "BLOG", jp: "ブログ", match: (p: string) => p.startsWith("/blog") },
  { href: "/contact", label: "CONTACT", jp: "依頼・相談", match: (p: string) => p.startsWith("/contact") },
];

export function DotNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex fixed top-4 md:top-5 left-1/2 -translate-x-1/2 z-30 items-center gap-4 sm:gap-8 md:gap-12">
      {SECTIONS.map((s) => {
        const isActive = s.match(pathname);
        return (
          <Link
            key={s.href}
            href={s.href}
            className="group relative flex flex-col items-center gap-1.5 md:gap-2 py-1"
            aria-label={s.label}
          >
            <span
              className={cn(
                "block h-3 w-3 md:h-4 md:w-4 transition-all duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]",
                isActive
                  ? "bg-accent shadow-[0_0_14px_rgba(176,38,255,0.9)] scale-110"
                  : "bg-foreground/60 group-hover:bg-foreground/95"
              )}
            />
            <span
              className={cn(
                "hidden sm:block font-mono text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.22em] transition-all duration-300 whitespace-nowrap [text-shadow:0_1px_5px_rgba(0,0,0,0.95)]",
                isActive
                  ? "text-foreground font-medium"
                  : "text-foreground/70 group-hover:text-foreground"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "hidden md:block font-sans text-[9px] -mt-1 transition-all duration-300 whitespace-nowrap [text-shadow:0_1px_5px_rgba(0,0,0,0.95)]",
                isActive ? "text-foreground/85" : "text-foreground/55 group-hover:text-foreground/85"
              )}
            >
              {s.jp}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
