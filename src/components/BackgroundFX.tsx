"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo } from "react";

/**
 * Photographic urban-night background.
 * Inspired by long-exposure rooftop photography + chain-link fence + glitch artifacts.
 *
 * Layers (back → front):
 * 1. Distant city light points (bottom horizon, blurred)
 * 2. Long-exposure light streaks (horizontal trails)
 * 3. Large chain-link fence pattern (full screen, faded)
 * 4. Single soft purple aurora (atmospheric, restrained)
 * 5. Glitch pixel blocks (icon-style horizontal color shifts)
 * 6. Hooded silhouette (corner watcher)
 * 7. Edge vignette
 */
export function BackgroundFX() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.8 });
  const smy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.8 });

  const fenceX = useTransform(smx, [-0.5, 0.5], [10, -10]);
  const fenceY = useTransform(smy, [-0.5, 0.5], [10, -10]);
  const auroraX = useTransform(smx, [-0.5, 0.5], [-30, 30]);
  const auroraY = useTransform(smy, [-0.5, 0.5], [-20, 20]);
  const trailsX = useTransform(smx, [-0.5, 0.5], [25, -25]);
  const cityX = useTransform(smx, [-0.5, 0.5], [8, -8]);
  const glitchX = useTransform(smx, [-0.5, 0.5], [40, -40]);
  const glitchY = useTransform(smy, [-0.5, 0.5], [25, -25]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Distant city lights along the bottom horizon */}
      <motion.div
        style={{ x: cityX }}
        className="absolute inset-0"
      >
        <CityLights />
      </motion.div>

      {/* Long-exposure horizontal light streaks (mid-bottom) */}
      <motion.div
        style={{ x: trailsX }}
        className="absolute inset-0"
      >
        <LightTrails />
      </motion.div>

      {/* Single soft aurora — restrained */}
      <motion.div style={{ x: auroraX, y: auroraY }} className="absolute inset-0">
        <motion.div
          className="absolute top-[20%] left-[55%] -translate-x-1/2 h-[55vw] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(176,38,255,0.18), transparent 60%)",
            filter: "blur(80px)",
            mixBlendMode: "screen",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Large faded chain-link fence — full background */}
      <motion.div
        style={{ x: fenceX, y: fenceY }}
        className="absolute -inset-12"
      >
        <ChainlinkFull />
      </motion.div>

      {/* Glitch pixel blocks — like the broken figure in the brand icon */}
      <motion.div style={{ x: glitchX, y: glitchY }} className="absolute inset-0">
        <PixelGlitchBlocks />
      </motion.div>

      {/* Hooded silhouette — bottom right, faint watcher */}
      <HoodedSilhouette />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </div>
  );
}

/** Faint distant city lights along the bottom horizon */
function CityLights() {
  const points = useMemo(() => {
    const arr: { left: string; bottom: string; size: number; color: string; opacity: number; flicker: number }[] = [];
    const colors = [
      "#f4d9a6", // tungsten warm
      "#ffe4b0", // bright window
      "#ffffff", // cool light
      "#ffc278", // sodium vapor
    ];
    for (let i = 0; i < 60; i++) {
      const r = (n: number) => {
        const x = Math.sin(i * 13 + n) * 9301;
        return x - Math.floor(x);
      };
      arr.push({
        left: `${r(1) * 100}%`,
        bottom: `${r(2) * 22}%`,
        size: 1 + Math.floor(r(3) * 3),
        color: colors[Math.floor(r(4) * colors.length)],
        opacity: 0.35 + r(5) * 0.5,
        flicker: 2 + r(6) * 4,
      });
    }
    return arr;
  }, []);

  return (
    <>
      {/* Soft horizon glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(244,217,166,0.05) 60%, rgba(255,196,120,0.10) 100%)",
        }}
      />
      {/* Light points */}
      {points.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: p.opacity,
          }}
          animate={{ opacity: [p.opacity, p.opacity * 0.5, p.opacity] }}
          transition={{
            duration: p.flicker,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </>
  );
}

/** Long-exposure horizontal light trails (motion blur feel) */
function LightTrails() {
  const trails = useMemo(() => {
    const arr: { top: string; w: string; left: string; color: string; opacity: number; duration: number; delay: number }[] = [];
    const colors = ["#f4d9a6", "#ffe4b0", "#ffffff", "rgba(176,38,255,0.7)", "#ffc278"];
    for (let i = 0; i < 14; i++) {
      const r = (n: number) => {
        const x = Math.sin(i * 7 + n * 3) * 7777;
        return x - Math.floor(x);
      };
      arr.push({
        top: `${50 + r(1) * 42}%`,
        w: `${20 + r(2) * 60}vw`,
        left: `${r(3) * 80 - 10}%`,
        color: colors[Math.floor(r(4) * colors.length)],
        opacity: 0.25 + r(5) * 0.45,
        duration: 18 + r(6) * 24,
        delay: r(1) * -20,
      });
    }
    return arr;
  }, []);

  return (
    <>
      {trails.map((t, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px]"
          style={{
            top: t.top,
            width: t.w,
            background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`,
            opacity: t.opacity,
            filter: "blur(0.5px)",
            mixBlendMode: "screen",
          }}
          initial={{ left: "-100%" }}
          animate={{ left: ["-30%", "120%"] }}
          transition={{
            duration: t.duration,
            repeat: Infinity,
            ease: "linear",
            delay: t.delay,
          }}
        />
      ))}
    </>
  );
}

/** Full-screen chain-link fence — the main motif */
function ChainlinkFull() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern
          id="chainlink-full"
          patternUnits="userSpaceOnUse"
          width="36"
          height="36"
          patternTransform="rotate(2)"
        >
          <path
            d="M 0 18 L 18 0 L 36 18 L 18 36 Z"
            stroke="rgba(244,232,193,0.55)"
            strokeWidth="0.8"
            fill="none"
          />
        </pattern>
        {/* Mask: fade edges and top */}
        <radialGradient id="chainlink-fade" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="60%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="chainlink-mask">
          <rect width="100%" height="100%" fill="url(#chainlink-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#chainlink-full)"
        mask="url(#chainlink-mask)"
        opacity="0.18"
      />
    </svg>
  );
}

/** Glitch pixel blocks — staggered horizontal rectangles with color displacement */
function PixelGlitchBlocks() {
  const blocks = useMemo(() => {
    const colors = [
      "rgba(176, 38, 255, 0.5)",
      "rgba(255, 42, 192, 0.5)",
      "rgba(46, 255, 213, 0.4)",
      "rgba(91, 26, 140, 0.7)",
      "rgba(20, 30, 55, 0.85)",
    ];
    const arr: { top: string; left: string; w: number; h: number; color: string; delay: number; duration: number; }[] = [];
    for (let i = 0; i < 24; i++) {
      const r = (n: number) => {
        const x = Math.sin(i * 17 + n * 5) * 31337;
        return x - Math.floor(x);
      };
      arr.push({
        top: `${r(1) * 100}%`,
        left: `${r(2) * 100}%`,
        w: 24 + Math.floor(r(3) * 80),
        h: 4 + Math.floor(r(4) * 14),
        color: colors[Math.floor(r(5) * colors.length)],
        delay: r(6) * 6,
        duration: 6 + r(1) * 8,
      });
    }
    return arr;
  }, []);

  return (
    <>
      {blocks.map((b, i) => (
        <motion.span
          key={i}
          className="absolute mix-blend-screen"
          style={{
            top: b.top,
            left: b.left,
            width: b.w,
            height: b.h,
            background: b.color,
            boxShadow: `${b.w * 0.3}px 0 0 rgba(255,42,192,0.3), -${b.w * 0.3}px 0 0 rgba(46,255,213,0.25)`,
          }}
          initial={{ opacity: 0, x: 0 }}
          animate={{
            opacity: [0, 0.55, 0.55, 0],
            x: [0, -8, 12, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
    </>
  );
}

/** Faint hooded figure silhouette in the bottom-right area */
function HoodedSilhouette() {
  return (
    <div
      className="absolute bottom-0 right-[6%] w-[28vw] max-w-[420px] aspect-[3/4] opacity-[0.18] pointer-events-none"
      aria-hidden
    >
      <svg viewBox="0 0 300 400" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="hooded-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#000" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <filter id="hooded-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        {/* Hood shape */}
        <path
          d="M 90 110
             C 90 50, 210 50, 210 110
             L 220 200
             L 240 240
             L 250 380
             L 50 380
             L 60 240
             L 80 200
             Z"
          fill="url(#hooded-fade)"
          filter="url(#hooded-blur)"
        />
        {/* Face shadow */}
        <ellipse cx="150" cy="135" rx="55" ry="55" fill="#000" opacity="0.7" filter="url(#hooded-blur)" />
        {/* Glitch slice — magenta */}
        <rect x="80" y="155" width="140" height="6" fill="rgba(255,42,192,0.8)" opacity="0.7" />
        <rect x="60" y="200" width="180" height="3" fill="rgba(46,255,213,0.6)" opacity="0.5" />
      </svg>
    </div>
  );
}
