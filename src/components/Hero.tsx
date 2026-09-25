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

      {/* Brand name — char-level reveal + 3D parallax */}
      <motion.h1
        style={{
          rotateX,
          rotateY,
          x: titleX,
          y: titleY,
          transformStyle: "preserve-3d",
        }}
        className="mt-6 text-center font-serif leading-[0.9] will-change-transform"
      >
        <span className="block text-[clamp(2.1rem,9.2vw,8.5rem)]" style={{ fontWeight: 900 }}>
          <SplitText
            text="GENOMERSIVE"
            delay={0.4}
            stagger={0.05}
            rise={60}
          />
        </span>
        <span className="block text-[clamp(2.1rem,9.2vw,8.5rem)]" style={{ fontWeight: 900 }}>
          <SplitText
            text="STUDI"
            delay={0.95}
            stagger={0.05}
            rise={60}
          />
          <motion.span
            initial={{ opacity: 0.02, y: 60, rotateX: -45 }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              color: ["#b026ff", "#ff2ac0", "#b026ff", "#5b1a8c", "#b026ff"],
            }}
            transition={{
              opacity: { duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] },
              rotateX: { duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] },
              color: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 },
            }}
            className="inline-block drop-shadow-[0_0_24px_rgba(176,38,255,0.7)]"
            style={{ transformOrigin: "50% 100%" }}
          >
            O
          </motion.span>
        </span>
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
