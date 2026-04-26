"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 200, damping: 25, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 200, damping: 25, mass: 0.5 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive =
        !!target?.closest("a, button, [role='button'], input, textarea, label");
      setHovering(interactive);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Inner dot — instant follow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full bg-accent mix-blend-screen"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 8px rgba(176,38,255,0.9)",
        }}
      />
      {/* Outer ring — springy delay */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99] rounded-full border border-accent/60 mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          boxShadow: "0 0 12px rgba(176,38,255,0.35)",
          transition: "width 180ms ease, height 180ms ease",
        }}
      />
    </>
  );
}
