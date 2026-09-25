"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { WORKS, type Work } from "@/data/works";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";
import { TopSectionHeading } from "./TopSectionHeading";

// トップページに出す代表作。差し替えはこのID配列を編集するだけ
const FEATURED_IDS = ["w-036", "w-040", "w-009", "w-032"];

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
        <TopSectionHeading index="002" en="SELECTED WORKS" ja="代表作" lead="言葉より先に、耳で確かめてください。" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featured.map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} onOpen={setOpen} />
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href="/works"
            className="group inline-flex items-center gap-2 py-4 -my-3 font-mono text-xs tracking-[0.22em] text-foreground/90 hover:text-accent-text transition-colors"
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
