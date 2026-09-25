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
    // opacity 0.02: 目には見えないが「描画済み」扱いになり、LCP計測が
    // 演出の遅延分だけ悪化するのを防ぐ
    hidden: { y: rise, opacity: 0.02, rotateX: -45 },
    show: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // 単語と空白に分け、それぞれの先頭が全体の何文字目かを先に求める（accentIndex の判定用）
  const tokens = text.split(/(\s+)/).map((part, k, all) => ({
    part,
    start: all.slice(0, k).join("").length,
  }));

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: "inline-block", perspective: 800 }}
    >
      {/* 単語ごとに折り返し禁止でまとめ、改行は単語間の空白でだけ起こす（1文字ずつだと単語の途中で折れる） */}
      {tokens.map(({ part, start }, pi) => {
        if (/^\s+$/.test(part)) {
          return (
            <span key={pi} style={{ whiteSpace: "pre-wrap" }}>
              {part}
            </span>
          );
        }
        return (
          <span key={pi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(part).map((c, ci) => {
              const i = start + ci;
              return (
                <motion.span
                  key={ci}
                  variants={child}
                  className={
                    i === accentIndex
                      ? `${charClassName ?? ""} ${accentClassName ?? ""}`
                      : charClassName
                  }
                  style={{ display: "inline-block", transformOrigin: "50% 100%" }}
                >
                  {c}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.span>
  );
}
