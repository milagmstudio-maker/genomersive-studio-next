"use client";

import { motion, type Variants } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
  /** Per-char y-distance (px) when entering */
  rise?: number;
  /** Highlighted character index (0-based). Receives `accentClassName`. */
  accentIndex?: number;
  accentClassName?: string;
};

export function SplitText({
  text,
  className,
  charClassName,
  delay = 0,
  stagger = 0.04,
  rise = 40,
  accentIndex,
  accentClassName,
}: Props) {
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const child: Variants = {
    hidden: { y: rise, opacity: 0, rotateX: -45 },
    show: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: "inline-block", perspective: 800 }}
    >
      {Array.from(text).map((c, i) => (
        <motion.span
          key={i}
          variants={child}
          className={
            i === accentIndex
              ? `${charClassName ?? ""} ${accentClassName ?? ""}`
              : charClassName
          }
          style={{
            display: "inline-block",
            transformOrigin: "50% 100%",
            whiteSpace: "pre",
          }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </motion.span>
  );
}
