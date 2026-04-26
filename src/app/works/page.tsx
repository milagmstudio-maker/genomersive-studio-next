import Link from "next/link";
import { CATEGORIES, WORKS } from "@/data/works";
import { BackgroundFX } from "@/components/BackgroundFX";
import { BrandMark } from "@/components/BrandMark";
import { Cursor } from "@/components/Cursor";
import { GlitchOverlay } from "@/components/GlitchOverlay";
import { WorksGrid } from "@/components/WorksGrid";

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function WorksIndex({ searchParams }: Props) {
  const { category, page } = await searchParams;

  const activeCategory =
    category && (CATEGORIES as readonly string[]).includes(category)
      ? category
      : "ALL";

  const filtered =
    activeCategory === "ALL"
      ? WORKS
      : WORKS.filter((w) => w.category === activeCategory);

  const currentPage = Math.max(1, Number(page) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  const buildHref = (cat: string, p: number) => {
    const params = new URLSearchParams();
    if (cat !== "ALL") params.set("category", cat);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/works?${qs}` : "/works";
  };

  return (
    <main className="relative min-h-screen">
      <BackgroundFX />
      <GlitchOverlay />
      <Cursor />
      <BrandMark />

      <Link
        href="/"
        className="fixed top-5 right-6 z-30 font-mono text-[11px] tracking-[0.3em] text-foreground/70 hover:text-accent transition-colors"
      >
        ← BACK
      </Link>

      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-32 pb-32">
        <div className="mx-auto max-w-7xl">
          <header className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/50">
              <span>002</span>
              <span className="h-px w-10 bg-foreground/30" />
              <span>PORTFOLIO — ALL WORKS</span>
            </div>
            <h1
              className="mt-5 font-serif italic text-5xl md:text-7xl lg:text-8xl tracking-tight"
              style={{ color: "var(--accent-cream)" }}
            >
              Works
              <span style={{ color: "var(--accent-hot)" }}>.</span>
            </h1>
          </header>

          {/* Category filter */}
          <div className="mb-12 flex flex-wrap gap-x-1 gap-y-2 border-b border-white/10 pb-1">
            {CATEGORIES.map((c) => (
              <CategoryLink
                key={c}
                active={activeCategory === c}
                label={c}
                href={buildHref(c, 1)}
              />
            ))}
          </div>

          {paginated.length === 0 ? (
            <p className="font-mono text-xs tracking-[0.3em] text-foreground/40 py-12 text-center">
              NO ITEMS IN THIS CATEGORY
            </p>
          ) : (
            <>
              <WorksGrid works={paginated} />

              {totalPages > 1 && (
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  buildHref={(p) => buildHref(activeCategory, p)}
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function CategoryLink({
  active,
  label,
  href,
}: {
  active: boolean;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 font-mono text-[11px] tracking-[0.3em] transition-colors ${
        active
          ? "text-foreground"
          : "text-foreground/40 hover:text-foreground/80"
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(176,38,255,0.7)]" />
      )}
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (p: number) => string;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="mt-16 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.25em]">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-2 text-foreground/70 hover:text-accent transition-colors"
        >
          ← PREV
        </Link>
      ) : (
        <span className="px-3 py-2 text-foreground/20">← PREV</span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((p) => {
          const active = p === currentPage;
          return (
            <Link
              key={p}
              href={buildHref(p)}
              className={`flex h-9 w-9 items-center justify-center transition-colors ${
                active
                  ? "bg-accent/15 border border-accent text-foreground shadow-[0_0_12px_rgba(176,38,255,0.4)]"
                  : "border border-white/10 text-foreground/55 hover:text-foreground hover:border-white/30"
              }`}
            >
              {String(p).padStart(2, "0")}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-2 text-foreground/70 hover:text-accent transition-colors"
        >
          NEXT →
        </Link>
      ) : (
        <span className="px-3 py-2 text-foreground/20">NEXT →</span>
      )}
    </nav>
  );
}
