"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { SplitText } from "./SplitText";

export function Hero() {
  // Mouse-driven 3D parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 70, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 70, damping: 20, mass: 0.6 });

  const rotateY = useTransform(smx, [-0.5, 0.5], [8, -8]);
  const rotateX = useTransform(smy, [-0.5, 0.5], [-6, 6]);
  const titleX = useTransform(smx, [-0.5, 0.5], [-30, 30]);
  const titleY = useTransform(smy, [-0.5, 0.5], [-15, 15]);
  const subX = useTransform(smx, [-0.5, 0.5], [-10, 10]);
  const tagX = useTransform(smx, [-0.5, 0.5], [-18, 18]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
      style={{ perspective: 1200 }}
    >
      {/* 肩書き */}
      <motion.div
        style={{ x: subX }}
        className="font-mono text-[11px] text-foreground/80 text-center"
      >
        {/* 経歴の順（音の職人 → 活動全体を見る人）。スマホでは SOUND ENGINEER を1行目に単独で置く */}
        <SplitText text="SOUND ENGINEER" delay={0.15} stagger={0.015} rise={12} />
        <span className="hidden whitespace-pre sm:inline">{"  /  "}</span>
        <br className="sm:hidden" />
        <SplitText text="DIRECTOR  /  PRODUCER" delay={0.4} stagger={0.015} rise={12} />
      </motion.div>

      {/* スタジオ名 — 元の筆記体ロゴ（網点の質感はそのまま）。左から右へ書かれていくように現れ、マウスで少し傾く */}
      <motion.h1
        style={{
          rotateX,
          rotateY,
          x: titleX,
          y: titleY,
          transformStyle: "preserve-3d",
        }}
        className="relative mt-8 w-[min(90vw,1100px)] will-change-transform"
      >
        <span className="sr-only">Genomersive Studio</span>
        {/* ロゴの後ろに敷く楕円の光（ロゴ自体に影を付けると網点ごとに光って四角い帯になるため） */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-[6%] -inset-y-[45%] -z-10 bg-[radial-gradient(closest-side,rgba(176,38,255,0.22),rgba(42,54,255,0.08)_60%,transparent)] blur-2xl"
        />
        <motion.img
          src="/brand/genomersive-studio-logo.webp"
          alt=""
          aria-hidden="true"
          width={2200}
          height={340}
          fetchPriority="high"
          draggable={false}
          // 完全に隠すと表示計測（LCP）が演出の分だけ遅れるので、2%だけ見せた状態から始める
          initial={{ clipPath: "inset(0 98% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.6, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
          className="block h-auto w-full select-none"
        />
      </motion.h1>

      {/* Service message — existing reveal and parallax are preserved */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.5 }}
        style={{ x: tagX }}
        className="mt-9 max-w-3xl text-center"
      >
        <p
          className="font-mincho text-xl leading-relaxed md:text-2xl"
          style={{ color: "var(--accent-cream)" }}
        >
          音を整え、活動の次の一歩まで。
        </p>
        <p className="mt-4 font-mono text-[11px] text-foreground/90">
          SOUND STUDIO FOR EVERY VOICE
        </p>
        <p className="mt-1.5 font-mincho text-sm leading-relaxed text-foreground/75">
          声と音で活動する、すべての人へ
        </p>

        {/* 行動は大きく・中央に。主（実績）は塗り、副（料金）は枠線 */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/works"
            data-track="hero_works"
            className="group inline-flex min-h-12 items-center gap-2 bg-foreground px-6 font-mono text-[11px] text-background transition-colors hover:bg-accent-cream"
          >
            実績を聴く
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/services"
            data-track="hero_services"
            className="group inline-flex min-h-12 items-center gap-2 border border-white/60 px-6 font-mono text-[11px] text-foreground transition-colors hover:border-white hover:bg-white/10"
          >
            料金を見る
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
