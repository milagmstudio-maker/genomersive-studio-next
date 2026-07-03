"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { WORKS, type Work } from "@/data/works";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";

// トップページに出す代表作。差し替えはこのID配列を編集するだけ
const FEATURED_IDS = ["w-025", "w-009", "w-013", "w-001"];

export function SelectedWorks() {
  const [open, setOpen] = useState<Work | null>(null);
  const handleClose = useCallback(() => setOpen(null), []);

  const featured = FEATURED_IDS.map((id) =>
    WORKS.find((w) => w.id === id)
  ).filter((w): w is Work => !!w);

  if (featured.length === 0) return null;

  return (
    <section
      id="selected-works"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>002</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>SELECTED WORKS / 代表作</span>
        </div>
        <p className="mb-12 font-mincho text-sm md:text-base leading-relaxed text-foreground/85">
          言葉より先に、耳で確かめてください。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featured.map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} onOpen={setOpen} />
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href="/works"
            className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-foreground/85 hover:text-accent transition-colors"
          >
            VIEW ALL WORKS
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      <WorkModal work={open} onClose={handleClose} />
    </section>
  );
}
