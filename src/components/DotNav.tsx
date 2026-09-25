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
    // 背景の網点が明るいので、メニュー全体を暗い半透明の帯で包み、後ろをぼかして文字を浮かせる。
    // タブレット縦（768px未満）は中央だと左上のロゴに重なるので右寄せ
    <nav className="hidden sm:flex fixed top-3 md:top-4 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 z-30 items-center gap-4 sm:gap-5 lg:gap-11 md:gap-8 rounded-2xl border border-white/10 bg-background/75 px-4 md:px-7 lg:px-9 py-2 md:py-2.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
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
                "hidden sm:block font-mono text-[10px] md:text-[14px] tracking-[0.15em] md:tracking-[0.22em] transition-all duration-300 whitespace-nowrap [text-shadow:0_1px_5px_rgba(0,0,0,0.95)]",
                isActive
                  ? "text-foreground font-medium"
                  : "text-foreground/85 group-hover:text-foreground"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "hidden md:block font-sans text-[11px] -mt-1 transition-all duration-300 whitespace-nowrap [text-shadow:0_1px_5px_rgba(0,0,0,0.95)]",
                isActive ? "text-foreground/90" : "text-foreground/70 group-hover:text-foreground/90"
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
