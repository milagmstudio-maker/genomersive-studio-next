"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, WORKS, type Work } from "@/data/works";
import { SectionLabel } from "./SectionLabel";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 6;

export function Works() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Work | null>(null);

  const list = useMemo(
    () =>
      filter === "ALL" ? WORKS : WORKS.filter((w) => w.category === filter),
    [filter]
  );

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = list.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const goToPage = (p: number) => {
    setPage(p);
    document
      .getElementById("works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
        {paginated.length === 0 ? (
          <p className="mt-12 text-center font-mono text-xs tracking-[0.3em] text-foreground/40">
            NO ITEMS IN THIS CATEGORY
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginated.map((w, i) => (
              <WorkCard key={w.id} work={w} index={i} onOpen={setOpen} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.25em]">
            {safePage > 1 ? (
              <button
                onClick={() => goToPage(safePage - 1)}
                className="px-3 py-2 text-foreground/70 hover:text-accent transition-colors"
              >
                ← PREV
              </button>
            ) : (
              <span className="px-3 py-2 text-foreground/20">← PREV</span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const active = p === safePage;
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center transition-colors",
                      active
                        ? "bg-accent/15 border border-accent text-foreground shadow-[0_0_12px_rgba(176,38,255,0.4)]"
                        : "border border-white/10 text-foreground/55 hover:text-foreground hover:border-white/30"
                    )}
                  >
                    {String(p).padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            {safePage < totalPages ? (
              <button
                onClick={() => goToPage(safePage + 1)}
                className="px-3 py-2 text-foreground/70 hover:text-accent transition-colors"
              >
                NEXT →
              </button>
            ) : (
              <span className="px-3 py-2 text-foreground/20">NEXT →</span>
            )}
          </nav>
        )}
      </div>

      <WorkModal work={open} onClose={() => setOpen(null)} />
    </section>
  );
}
