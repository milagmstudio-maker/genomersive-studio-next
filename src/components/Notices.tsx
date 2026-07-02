import Link from "next/link";
import { formatDate, getPosts, type BlogPost } from "@/lib/microcms";

export const revalidate = 60;

export async function Notices() {
  let notices: BlogPost[] = [];
  try {
    const res = await getPosts({ limit: 3 });
    notices = res.contents;
  } catch {
    return null; // 取得失敗時は何も表示しない
  }

  if (notices.length === 0) return null;

  return (
    <section
      id="notices"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Label */}
        <div className="mb-12 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>006</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>NOTICES / お知らせ</span>
        </div>

        <ul className="divide-y divide-white/30 border-y border-white/30">
          {notices.map((n) => (
            <li key={n.id}>
              <Link
                href={`/blog/${n.id}`}
                className="group grid grid-cols-[100px_1fr_24px] md:grid-cols-[140px_1fr_24px] items-center gap-4 md:gap-8 py-6 hover:bg-accent/[0.04] px-3 -mx-3 transition-colors"
              >
                <span className="font-mono text-[11px] tracking-[0.25em] text-foreground/75">
                  {formatDate(n.publishedAt)}
                </span>
                <h3 className="font-sans font-medium text-sm md:text-base leading-snug">
                  {n.title}
                </h3>
                <span className="text-foreground/70 group-hover:text-accent group-hover:translate-x-1 transition-all text-right">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* View all link */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/blog"
            className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-foreground/85 hover:text-accent transition-colors"
          >
            VIEW ALL
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
