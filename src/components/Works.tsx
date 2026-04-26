"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, WORKS, type Work } from "@/data/works";
import { SectionLabel } from "./SectionLabel";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";
import { cn } from "@/lib/cn";

export function Works() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [open, setOpen] = useState<Work | null>(null);

  const list = useMemo(
    () =>
      filter === "ALL" ? WORKS : WORKS.filter((w) => w.category === filter),
    [filter]
  );

  return (
    <section
      id="works"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="002" kicker="PORTFOLIO" title="Works." />

        {/* Filter tabs */}
        <div className="mb-12 flex flex-wrap gap-x-1 gap-y-2 border-b border-white/10 pb-1">
          {CATEGORIES.map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "relative px-4 py-2 font-mono text-[11px] tracking-[0.3em] transition-colors",
                  active
                    ? "text-foreground"
                    : "text-foreground/40 hover:text-foreground/80"
                )}
              >
                {c}
                {active && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(176,38,255,0.7)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {list.map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} onOpen={setOpen} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-12 text-center font-mono text-xs tracking-[0.3em] text-foreground/40">
            NO ITEMS IN THIS CATEGORY
          </p>
        )}
      </div>

      <WorkModal work={open} onClose={() => setOpen(null)} />
    </section>
  );
}
