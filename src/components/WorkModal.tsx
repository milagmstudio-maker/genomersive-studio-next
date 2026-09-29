"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Work } from "@/data/works";

type Props = {
  work: Work | null;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

const noopSubscribe = () => () => {};

const YT_ORIGINS = ["https://www.youtube-nocookie.com", "https://www.youtube.com"];
// プレイヤーから合図が来なくても、この時間が過ぎたら必ず映像を出す
const REVEAL_FALLBACK_MS = 6000;
// 準備完了の後、自動再生が始まらない（ブラウザに止められた）場合に再生ボタンを見せるまでの待ち
const REVEAL_AFTER_READY_MS = 1500;

// YouTubeの埋め込みは、枠の読み込みが終わってからも映像が出るまで数秒真っ黒になる。
// iframeのonLoadはその黒い時間より前に来るので使えない。プレイヤー自身の合図（IFrame APIのpostMessage）を待ち、
// それまではサムネイルと読み込み中の表示を見せる
function Player({ work }: { work: Work }) {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let afterReady: number | undefined;
    const onMessage = (e: MessageEvent) => {
      if (!YT_ORIGINS.includes(e.origin) || e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: { playerState?: number } } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      // 1=再生中 2=一時停止 5=頭出し済み。どれかになれば映像を見せてよい
      const state = data?.info?.playerState;
      if (state === 1 || state === 2 || state === 5) setLoaded(true);
      if (data?.event === "onReady" && afterReady === undefined) {
        afterReady = window.setTimeout(() => setLoaded(true), REVEAL_AFTER_READY_MS);
      }
    };
    window.addEventListener("message", onMessage);
    const fallback = window.setTimeout(() => setLoaded(true), REVEAL_FALLBACK_MS);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(fallback);
      window.clearTimeout(afterReady);
    };
  }, []);

  // 読み込み後に「状態を知らせて」と頼む（YouTube IFrame APIの取り決め）
  const listen = () =>
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: work.youtubeId, channel: "widget" }),
      "*"
    );

  return (
    <div className="relative aspect-video w-full border border-white/35 overflow-hidden bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${work.youtubeId}/hqdefault.jpg`}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover blur-sm scale-105 transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-50"}`}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="animate-pulse border border-white/35 bg-black/60 px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-foreground/90">
            LOADING
          </span>
        </div>
      )}
      <iframe
        ref={frameRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        src={`https://www.youtube-nocookie.com/embed/${work.youtubeId}?autoplay=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
        title={work.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
        allowFullScreen
        onLoad={listen}
      />
    </div>
  );
}

export function WorkModal({ work, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  // セクション内に置くと、そのセクションの重なり順に閉じ込められて固定ヘッダーの下に潜る。
  // body直下へ出して、常にヘッダーより前面に表示する
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  // 開く前にフォーカスしていた要素。閉じた時にここへ戻す
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!work) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      // Tabがモーダルの外へ抜けないよう先頭と末尾を繋ぐ
      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // 開いた直後はパネル内へフォーカスを移す
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [work, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {work && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-modal-title"
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar — file-style */}
            <div className="flex items-center justify-between border border-white/35 border-b-0 bg-black/70 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground">
              <span className="truncate">
                {work.id.toUpperCase()} / {work.title.replace(/\s+/g, "_")}.MP4
              </span>
              <button
                onClick={onClose}
                className="ml-4 px-2 py-0.5 hover:text-accent-text transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Player — 作品が替わったら読み込み状態を最初からやり直す */}
            <Player key={work.id} work={work} />

            {/* Caption */}
            <div className="border border-white/35 border-t-0 bg-black/70 px-4 py-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-foreground/90">
                    <span className="inline-block h-[3px] w-[3px] bg-accent shadow-[0_0_6px_rgba(176,38,255,0.8)]" />
                    <span>{work.category}</span>
                    <span>·</span>
                    <span>{work.year}</span>
                  </div>
                  <h3
                    id="work-modal-title"
                    className="mt-2 font-mincho text-2xl md:text-3xl"
                  >
                    {work.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground">{work.artist}</p>
                </div>
                {/* 「いい音だな」と思った瞬間を逃さない依頼導線 */}
                <Link
                  href="/contact"
                  className="group flex shrink-0 items-center justify-center gap-3 border border-accent bg-accent/10 px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)] transition-all"
                >
                  このクオリティで依頼する
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
