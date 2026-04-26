"use client";

import { useState } from "react";
import { type Work } from "@/data/works";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";

export function WorksGrid({ works }: { works: Work[] }) {
  const [open, setOpen] = useState<Work | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {works.map((w, i) => (
          <WorkCard key={w.id} work={w} index={i} onOpen={setOpen} />
        ))}
      </div>
      <WorkModal work={open} onClose={() => setOpen(null)} />
    </>
  );
}
