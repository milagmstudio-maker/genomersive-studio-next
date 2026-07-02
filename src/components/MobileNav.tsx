"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/",        label: "TOP",      sub: "ホーム",     match: (p: string) => p === "/" },
  { href: "/works",   label: "WORKS",    sub: "実績",       match: (p: string) => p.startsWith("/works") },
  { href: "/services",label: "SERVICES", sub: "料金",       match: (p: string) => p.startsWith("/services") },
  { href: "/blog",    label: "BLOG",     sub: "ブログ",     match: (p: string) => p.startsWith("/blog") },
  { href: "/contact", label: "CONTACT",  sub: "依頼・相談", match: (p: string) => p.startsWith("/contact") },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ページ遷移時に自動で閉じる
  useEffect(() => { setOpen(false); }, [pathname]);

  // 開いているときはbodyスクロールを無効化
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // 画面回転・リサイズでデスクトップ幅になったら強制クローズ（スクロールロック解除）
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.innerWidth >= 640) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <>
      {/* ハンバーガーボタン — スマホのみ表示 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="sm:hidden fixed top-4 right-5 z-50 flex h-10 w-10 flex-col items-center justify-center gap-[6px]"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={open}
      >
        <motion.span
          animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="block h-[2px] w-6 bg-foreground origin-center"
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2 }}
          className="block h-[2px] w-6 bg-foreground origin-center"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="block h-[2px] w-6 bg-foreground origin-center"
        />
      </button>

      {/* 全画面オーバーレイメニュー */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="sm:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {LINKS.map((link, i) => {
                const isActive = link.match(pathname);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "group flex flex-col items-center gap-1",
                        isActive ? "pointer-events-none" : ""
                      )}
                    >
                      <span
                        className={cn(
                          "font-sans text-[11px] tracking-[0.3em] transition-colors",
                          isActive ? "text-accent" : "text-foreground/50"
                        )}
                      >
                        {link.sub}
                      </span>
                      <span
                        className={cn(
                          "font-sans text-4xl font-bold tracking-tight transition-colors",
                          isActive
                            ? "text-foreground"
                            : "text-foreground/80 group-hover:text-foreground"
                        )}
                      >
                        {link.label}
                        {isActive && (
                          <span className="ml-2 inline-block h-2 w-2 bg-accent shadow-[0_0_10px_rgba(176,38,255,0.9)] align-middle" />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* フッターリンク */}
            <div className="absolute bottom-8 flex items-center gap-6 font-mono text-[10px] tracking-[0.3em] text-foreground/50">
              <a href="https://x.com/mila_mixstudio" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                X @mila_mixstudio
              </a>
              <span className="h-[1px] w-4 bg-foreground/30" />
              <a href="mailto:mila.gmstudio@gmail.com" className="hover:text-foreground transition-colors">
                MAIL
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
