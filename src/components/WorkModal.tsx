"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import type { Work } from "@/data/works";

type Props = {
  work: Work | null;
  onClose: () => void;
};

export function WorkModal({ work, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (work) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [work, onClose]);

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar — file-style */}
            <div className="flex items-center justify-between border border-white/35 border-b-0 bg-black/70 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground">
              <span className="truncate">
                {work.id.toUpperCase()} / {work.title.replace(/\s+/g, "_")}.MP4
              </span>
              <button
                onClick={onClose}
                className="ml-4 px-2 py-0.5 hover:text-accent transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Player */}
            <div className="relative aspect-video w-full border border-white/35 overflow-hidden bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${work.youtubeId}?autoplay=1&rel=0`}
                title={work.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                allowFullScreen
              />
            </div>

            {/* Caption */}
            <div className="border border-white/35 border-t-0 bg-black/70 px-4 py-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-foreground/90">
                    <span className="inline-block h-[3px] w-[3px] bg-accent shadow-[0_0_6px_rgba(176,38,255,0.8)]" />
                    <span>{work.category}</span>
                    <span>·</span>
                    <span>{work.year}</span>
                  </div>
                  <h3 className="mt-2 font-mincho text-2xl md:text-3xl">
                    {work.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground">{work.artist}</p>
                </div>
                {/* 「いい音だな」と思った瞬間を逃さない依頼導線 */}
                <Link
                  href="/contact"
                  className="group flex shrink-0 items-center justify-center gap-3 border border-accent bg-accent/10 px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)] transition-all"
                >
                  このクオリティで依頼する
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
