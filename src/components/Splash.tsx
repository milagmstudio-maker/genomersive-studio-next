"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "gms_splash_shown";

export function Splash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setShow(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          aria-hidden
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050a16]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-6 px-8">
            <motion.div
              className="flex items-baseline gap-3 font-mono text-[10px] tracking-[0.4em] text-foreground/90"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="h-[6px] w-[6px] rounded-full bg-accent shadow-[0_0_10px_rgba(176,38,255,0.7)]" />
              <span>EST. 2022</span>
            </motion.div>

            {/* ヒーローと同じ筆記体ロゴを、左から右へ書かれるように出す */}
            <motion.img
              src="/brand/genomersive-studio-logo.webp"
              alt=""
              width={2200}
              height={341}
              draggable={false}
              className="block h-auto w-[min(78vw,560px)] select-none"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
            />

            {/* progress line */}
            <div className="relative mt-2 h-px w-48 overflow-hidden bg-white/25">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_8px_rgba(176,38,255,0.7)]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut", delay: 0.3 }}
              />
            </div>

            <motion.div
              className="font-mono text-[10px] tracking-[0.4em] text-foreground/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.5] }}
              transition={{ duration: 1.4, delay: 0.2, times: [0, 0.2, 0.85, 1] }}
            >
              LOADING
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
