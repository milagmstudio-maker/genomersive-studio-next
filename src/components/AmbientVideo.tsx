"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const HALFTONE_MASK = "radial-gradient(circle at center, #000 51%, transparent 57%)";

export function AmbientVideo() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHome = pathname === "/";

  // 動画が初回表示の帯域を奪わないよう、ページ読み込み完了後にsrcを差す。
  // それまでは poster 画像(90KB)が背景を担う。null = まだ差さない
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // トップは網点で光の量が減るぶん、上にかける幕を薄くして明るさを保つ
  const overlayClass = isHome
    ? "from-background/20 via-background/10 to-background/30"
    : "from-background/80 via-background/70 to-background/85";

  // 背景の波は全ページ網点で見せる（5px 間隔の点で切り抜く）。
  // 点のすき間は何も映らず暗くなるので、点を大きめにし、明るさと彩度を上げて補う。
  // 明るさの差はページごとの幕（overlayClass）で付ける
  const halftoneStyle = {
    maskImage: HALFTONE_MASK,
    WebkitMaskImage: HALFTONE_MASK,
    maskSize: "5px 5px",
    WebkitMaskSize: "5px 5px",
    filter: "contrast(1.35) saturate(1.5) brightness(2)",
  };

  useEffect(() => {
    // データセーバー・低速回線では動画を読まず poster のままにする。
    // 背景は雰囲気を担うだけなので、静止画でも成立する
    const shouldLoadVideo = () => {
      const conn = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      if (conn?.saveData) return false;
      if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false;
      return true;
    };

    // スマホは縦長の画面で横長動画の中央しか映らないので、中央を縦に切り出した
    // 軽い版(0.7MB。PC版は2.3MB)を使う。網点で細部は消えるため画質を落としても見た目は変わらない
    const activate = () => {
      if (!shouldLoadVideo()) return;
      const isSmall = window.matchMedia("(max-width: 767px)").matches;
      setVideoSrc(isSmall ? "/videos/sound-wave-mobile.mp4" : "/videos/sound-wave.mp4");
    };

    if (document.readyState === "complete") {
      activate();
      return;
    }
    window.addEventListener("load", activate, { once: true });
    return () => window.removeEventListener("load", activate);
  }, []);

  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    // prefers-reduced-motion が有効な場合は動画を止める（アクセシビリティ対応）
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    // autoPlay 属性だけではインアプリブラウザ（X・LINE等）で再生されない場合があるため
    // JavaScript から直接 play() を呼ぶことで確実に再生させる
    const tryPlay = () => {
      video.play().catch(() => {
        // autoplay がブロックされた場合、ユーザーの最初のタッチ/クリックで再試行
        const onInteract = () => {
          video.play().catch(() => {});
          window.removeEventListener("touchstart", onInteract);
          window.removeEventListener("click", onInteract);
        };
        window.addEventListener("touchstart", onInteract, { passive: true });
        window.addEventListener("click", onInteract);
      });
    };

    // 即時実行 + 読み込み完了後も念のため実行
    tryPlay();
    video.addEventListener("canplay", tryPlay, { once: true });

    return () => {
      video.removeEventListener("canplay", tryPlay);
    };
  }, [videoSrc]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ contain: "strict" }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload={videoSrc ? "auto" : "none"}
        poster="/videos/sound-wave-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        style={halftoneStyle}
        src={videoSrc ?? undefined}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass}`} />
    </div>
  );
}
