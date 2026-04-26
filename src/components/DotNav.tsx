"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { id: "top", label: "TOP" },
  { id: "works", label: "WORKS" },
  { id: "services", label: "SERVICES" },
  { id: "blog", label: "BLOG" },
  { id: "contact", label: "CONTACT" },
];

export function DotNav() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-12 md:gap-16">
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group relative flex flex-col items-center py-2"
            aria-label={s.label}
          >
            <span
              className={cn(
                "block h-3 w-3 transition-all duration-300",
                isActive
                  ? "bg-accent shadow-[0_0_14px_rgba(176,38,255,0.9)] scale-110"
                  : "bg-foreground/25 group-hover:bg-foreground/70"
              )}
            />
            <span
              className={cn(
                "absolute top-7 font-mono text-[11px] tracking-[0.3em] transition-opacity duration-300 whitespace-nowrap",
                isActive
                  ? "opacity-100 text-foreground"
                  : "opacity-0 group-hover:opacity-70"
              )}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
