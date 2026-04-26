import Link from "next/link";
import { getPosts, formatDate, type BlogPost } from "@/lib/microcms";
import { SectionLabel } from "./SectionLabel";

export const revalidate = 60;

export async function BlogPreview() {
  let posts: BlogPost[] = [];
  let fetchError = false;
  try {
    const res = await getPosts({ limit: 4 });
    posts = res.contents;
  } catch {
    fetchError = true;
  }

  return (
    <section
      id="blog"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 md:mb-24">
          <SectionLabel index="004" kicker="JOURNAL & TIPS" title="Blog." />
          <Link
            href="/blog"
            className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-foreground/70 hover:text-accent transition-colors"
          >
            VIEW ALL
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {fetchError ? (
          <p className="font-mono text-xs tracking-[0.2em] text-foreground/40">
            記事の読み込みに失敗しました
          </p>
        ) : posts.length === 0 ? (
          <p className="font-mono text-xs tracking-[0.2em] text-foreground/40">
            COMING SOON — 最初の記事を準備中です
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  const cat = post.category?.[0] ?? "";
  return (
    <Link
      href={`/blog/${post.id}`}
      className="group block border border-white/10 hover:border-accent/60 transition-colors bg-black/40 backdrop-blur-sm"
    >
      <div className="relative aspect-video overflow-hidden bg-white/5">
        {post.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${post.thumbnail.url}?w=600&fit=crop`}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] tracking-[0.3em] text-foreground/30">
            NO THUMBNAIL
          </div>
        )}
        <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1">
          {cat}
        </div>
      </div>
      <div className="p-4 border-t border-white/5">
        <p className="font-mono text-[10px] tracking-[0.25em] text-foreground/45">
          {formatDate(post.publishedAt)}
        </p>
        <h3 className="mt-2 font-sans font-medium leading-snug line-clamp-2">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
