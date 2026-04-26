"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";
import { SplitText } from "./SplitText";

const TAGS = ["VOCAL MIX", "PARA MIX", "OBS AUDIO", "PRODUCTION"];

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
      {/* Brutalist file-style meta — top-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-6 right-6 font-mono text-[10px] tracking-[0.25em] hidden md:block"
        style={{ color: "var(--accent-cream)", opacity: 0.55 }}
      >
        [ EST. 2022 ] · [ TYO / JP ]
      </motion.div>

      {/* Subtitle */}
      <motion.div
        style={{ x: subX }}
        className="font-mono text-[11px] tracking-[0.45em] text-foreground/55"
      >
        <SplitText
          text="PRODUCER  /  DIRECTOR  /  SOUND ENGINEER"
          delay={0.15}
          stagger={0.015}
          rise={12}
        />
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
        className="mt-6 text-center font-sans font-bold leading-[0.92] tracking-tight will-change-transform"
      >
        <span className="block text-[clamp(2.5rem,8.5vw,7.5rem)]">
          <SplitText
            text="GENOMERSIVE"
            delay={0.4}
            stagger={0.05}
            rise={60}
          />
        </span>
        <span className="block text-[clamp(2.5rem,8.5vw,7.5rem)]">
          <SplitText
            text="STUDI"
            delay={0.95}
            stagger={0.05}
            rise={60}
          />
          <motion.span
            initial={{ opacity: 0, y: 60, rotateX: -45 }}
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

      {/* Service tags */}
      <motion.div
        style={{ x: tagX }}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.35em] text-foreground/65"
      >
        {TAGS.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 1.5 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center gap-6"
          >
            {i > 0 && (
              <span
                aria-hidden
                className="inline-block h-[3px] w-[3px] bg-accent shadow-[0_0_6px_rgba(176,38,255,0.8)]"
              />
            )}
            <span>{t}</span>
          </motion.span>
        ))}
      </motion.div>

      {/* File-style label — bottom-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="absolute bottom-8 left-6 font-mono text-[10px] tracking-[0.25em] hidden md:flex items-center gap-2"
        style={{ color: "var(--accent-cream)", opacity: 0.45 }}
      >
        <span
          className="inline-block h-[6px] w-[6px]"
          style={{
            background: "var(--accent-cyan)",
            boxShadow: "0 0 8px rgba(46,255,213,0.7)",
          }}
        />
        001 / INDEX.MIX
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1.3 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-8 right-6 font-mono text-[10px] tracking-[0.3em] text-foreground/50"
      >
        SCROLL ↓
      </motion.div>
    </section>
  );
}
