"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

// ロゴもトップへのリンクだが、ロゴ＝ホームを知らない人のためと、どのページでも
// 必ず1つ「今いる場所」が光るように HOME も置く。
// 5項目になるので 768px 未満はロゴと重なる → そこは三本線メニュー（MobileNav）に任せる
const SECTIONS = [
  { href: "/", label: "HOME", match: (p: string) => p === "/" },
  { href: "/works", label: "WORKS", match: (p: string) => p.startsWith("/works") },
  { href: "/services", label: "SERVICES", match: (p: string) => p.startsWith("/services") },
  { href: "/blog", label: "BLOG", match: (p: string) => p.startsWith("/blog") },
  { href: "/contact", label: "CONTACT", match: (p: string) => p.startsWith("/contact") },
];

// ヘッダーは左にロゴ・右に文字だけのメニューを1本の線に揃える（箱や飾りは付けない）。
// 背景の網点が明るいので、画面の上端だけを暗くするグラデーションで文字を浮かせる
export function DotNav() {
  const pathname = usePathname();

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-background/90 via-background/55 to-transparent sm:h-36"
      />
      <nav
        aria-label="メインメニュー"
        className="hidden md:flex fixed top-6 right-10 z-30 h-[37px] items-center gap-6 lg:top-8 lg:h-[47px] lg:gap-10"
      >
        {SECTIONS.map((s) => {
          const isActive = s.match(pathname);
          return (
            <Link
              key={s.href}
              href={s.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative font-mono text-[15px] whitespace-nowrap transition-colors duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] lg:text-[19px]",
                isActive ? "text-accent" : "text-foreground hover:text-accent"
              )}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
