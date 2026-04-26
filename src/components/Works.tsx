"use client";

import Link from "next/link";
import { useState } from "react";
import { WORKS, type Work } from "@/data/works";
import { SectionLabel } from "./SectionLabel";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";

const PREVIEW_COUNT = 6;

export function Works() {
  const [open, setOpen] = useState<Work | null>(null);
  const list = WORKS.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="works"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 md:mb-24">
          <SectionLabel index="002" kicker="PORTFOLIO" title="Works." />
          <Link
            href="/works"
            className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-foreground/70 hover:text-accent transition-colors"
          >
            VIEW ALL
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {list.map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <WorkModal work={open} onClose={() => setOpen(null)} />
    </section>
  );
}
