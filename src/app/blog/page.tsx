import Link from "next/link";
import { CATEGORY_LIST, formatDate, getPosts, type BlogPost } from "@/lib/microcms";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogIndex({ searchParams }: Props) {
  const { category } = await searchParams;
  let posts: BlogPost[] = [];
  let fetchError = false;
  try {
    const res = await getPosts({ category });
    posts = res.contents;
  } catch {
    fetchError = true;
  }

  return (
    <>
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
            <CategoryLink active={!category} label="ALL" href="/blog" />
            {CATEGORY_LIST.map((c) => (
              <CategoryLink
                key={c}
                active={category === c}
                label={c}
                href={`/blog?category=${encodeURIComponent(c)}`}
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
          )}
        </div>
      </section>
    </>
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
