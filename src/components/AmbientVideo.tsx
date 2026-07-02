"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function AmbientVideo() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHome = pathname === "/";

  // 動画(2.3MB)が初回表示の帯域を奪わないよう、ページ読み込み完了後にsrcを差す。
  // それまでは poster 画像が背景を担う
  const [videoReady, setVideoReady] = useState(false);

  const overlayClass = isHome
    ? "from-background/30 via-background/15 to-background/45"
    : "from-background/80 via-background/70 to-background/85";

  useEffect(() => {
    if (document.readyState === "complete") {
      setVideoReady(true);
      return;
    }
    const onLoad = () => setVideoReady(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (!videoReady) return;
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
  }, [videoReady]);

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
        preload={videoReady ? "auto" : "none"}
        poster="/videos/sound-wave-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        src={videoReady ? "/videos/sound-wave.mp4" : undefined}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass}`} />
    </div>
  );
}
