"use client";

import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

export function BlogContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // ブラウザのDOMが利用可能な状態でサニタイズして設定
    // リンクを新しいタブで開く + セキュリティ属性を付与
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });

    ref.current.innerHTML = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });

    DOMPurify.removeHooks("afterSanitizeAttributes");
  }, [html]);

  return <div ref={ref} className="prose-mila mt-12" />;
}
