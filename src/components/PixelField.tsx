"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Pixel = {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
  glow: boolean;
};

// Deterministic pseudo-random so positions are stable across renders.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

export function PixelField({ count = 28 }: { count?: number }) {
  const pixels = useMemo<Pixel[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${seeded(i, 1) * 100}%`,
      left: `${seeded(i, 2) * 100}%`,
      size: seeded(i, 3) > 0.85 ? 12 : seeded(i, 3) > 0.5 ? 8 : 6,
      delay: seeded(i, 4) * 4,
      duration: 3 + seeded(i, 5) * 4,
      glow: seeded(i, 6) > 0.6,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {pixels.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block bg-accent"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            boxShadow: p.glow ? "0 0 10px rgba(176,38,255,0.7)" : undefined,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.85, 0.15] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
