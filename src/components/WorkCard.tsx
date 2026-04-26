"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Work } from "@/data/works";

type Props = {
  work: Work;
  index: number;
  onOpen: (work: Work) => void;
};

export function WorkCard({ work, index, onOpen }: Props) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 8, ry: px * 8 });
  };

  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.button
      ref={cardRef}
      onClick={() => onOpen(work)}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block w-full text-left"
      style={{ perspective: 1000 }}
      aria-label={`${work.title} — ${work.artist}`}
    >
      <motion.div
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${work.youtubeId}/maxresdefault.jpg`}
            alt={work.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] chromatic-hover"
            loading="lazy"
            onLoad={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              // YouTube returns a 120x90 placeholder (HTTP 200) when maxres doesn't exist
              if (img.naturalWidth <= 120) {
                img.src = `https://img.youtube.com/vi/${work.youtubeId}/hqdefault.jpg`;
              }
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${work.youtubeId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Hover play indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent bg-black/60 backdrop-blur-md shadow-[0_0_30px_rgba(176,38,255,0.5)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 3 L17 10 L5 17 Z" fill="#b026ff" />
              </svg>
            </div>
          </div>

          {/* Top-left category tag */}
          <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] text-foreground/90 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1">
            {work.category}
          </div>

          {/* Top-right index */}
          <div className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.25em] text-foreground/60">
            {work.id.toUpperCase()}
          </div>
        </div>

        {/* Caption */}
        <div className="p-4 border-t border-white/5">
          <p className="font-mono text-[10px] tracking-[0.25em] text-foreground/50">
            {work.artist} · {work.year}
          </p>
          <h3 className="mt-1.5 font-sans text-base md:text-lg font-medium leading-snug">
            {work.title}
          </h3>
        </div>
      </motion.div>
    </motion.button>
  );
}
