import Link from "next/link";
import { CATEGORY_LIST, formatDate, getPosts, type BlogPost } from "@/lib/microcms";
import { BackgroundFX } from "@/components/BackgroundFX";
import { BrandMark } from "@/components/BrandMark";
import { Cursor } from "@/components/Cursor";
import { GlitchOverlay } from "@/components/GlitchOverlay";

export const revalidate = 60;

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function BlogIndex({ searchParams }: Props) {
  const { category, page } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  let posts: BlogPost[] = [];
  let totalCount = 0;
  let fetchError = false;
  try {
    const res = await getPosts({ category, limit: PAGE_SIZE, offset });
    posts = res.contents;
    totalCount = res.totalCount;
  } catch {
    fetchError = true;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const buildHref = (cat: string | undefined, p: number) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <main className="relative min-h-screen">
      <BackgroundFX />
      <GlitchOverlay />
      <Cursor />
      <BrandMark />

      {/* Top-right back link */}
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
              <span>004</span>
              <span className="h-px w-10 bg-foreground/30" />
              <span>JOURNAL & TIPS</span>
            </div>
            <h1 className="mt-5 font-serif italic text-5xl md:text-7xl lg:text-8xl tracking-tight">
              Blog.
            </h1>
          </header>

          {/* Category filter */}
          <div className="mb-12 flex flex-wrap gap-x-1 gap-y-2 border-b border-white/10 pb-1">
            <CategoryLink active={!category} label="ALL" href={buildHref(undefined, 1)} />
            {CATEGORY_LIST.map((c) => (
              <CategoryLink
                key={c}
                active={category === c}
                label={c}
                href={buildHref(c, 1)}
              />
            ))}
          </div>

          {fetchError ? (
            <p className="font-mono text-xs tracking-[0.2em] text-foreground/40">
              記事の読み込みに失敗しました
            </p>
          ) : posts.length === 0 ? (
            <p className="font-mono text-xs tracking-[0.2em] text-foreground/40 py-12 text-center">
              該当する記事がありません
            </p>
          ) : (
            <>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {posts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.id}`}
                      className="group grid grid-cols-1 md:grid-cols-[120px_120px_1fr_24px] items-center gap-4 md:gap-8 py-6 hover:bg-accent/[0.04] px-3 -mx-3 transition-colors"
                    >
                      <span className="font-mono text-[11px] tracking-[0.25em] text-foreground/45">
                        {formatDate(p.publishedAt)}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.25em] text-accent">
                        {p.category?.[0] ?? "—"}
                      </span>
                      <h2 className="font-sans font-medium text-base md:text-lg leading-snug">
                        {p.title}
                      </h2>
                      <span className="hidden md:block text-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  buildHref={(p) => buildHref(category, p)}
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
