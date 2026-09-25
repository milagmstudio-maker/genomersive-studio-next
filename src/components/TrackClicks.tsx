"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * data-track="名前" が付いたリンク・ボタンのクリックを GA4 に送る。
 * 各ボタンに処理を書かず、属性を付けるだけで計測できるようにするための共通の受け口。
 */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      window.gtag?.("event", "cta_click", {
        cta: el.dataset.track,
        page: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
