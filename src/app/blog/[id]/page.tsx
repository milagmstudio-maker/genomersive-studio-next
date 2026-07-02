import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost } from "@/lib/microcms";
import { BlogContent } from "@/components/BlogContent";
import { BlogCta } from "@/components/BlogCta";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPost(id);
    const description = post.excerpt?.slice(0, 120) || post.title;
    const image = post.thumbnail
      ? { url: `${post.thumbnail.url}?w=1200&fit=crop`, width: 1200, height: 630 }
      : { url: "/og-image.jpg", width: 1200, height: 630 };
    return {
      title: `${post.title} — Genomersive Studio`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        images: [image],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [image.url],
      },
    };
  } catch {
    return { title: "Blog — Genomersive Studio" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  let post;
  try {
    post = await getPost(id);
  } catch {
    notFound();
  }
  if (!post) notFound();

  return (
    <article className="relative z-10 px-6 md:px-12 pt-32 pb-32">
        <div className="mx-auto max-w-3xl">
          {/* Meta */}
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80 mb-6">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="h-px w-8 bg-foreground/30" />
            <span className="text-accent">{post.category?.[0] ?? ""}</span>
          </div>

          {/* Title */}
          <h1 className="font-sans font-bold text-3xl md:text-5xl leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 font-serif italic text-lg md:text-xl text-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.thumbnail && (
            <div className="mt-12 relative aspect-video overflow-hidden border border-white/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${post.thumbnail.url}?w=1200&fit=crop`}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Body — DOMPurify でサニタイズしてから描画 */}
          <BlogContent html={post.content} />

          <BlogCta />

          {/* Footer nav */}
          <div className="mt-20 pt-8 border-t border-white/30 flex justify-between font-mono text-[11px] tracking-[0.3em]">
            <Link href="/blog" className="text-foreground hover:text-accent transition-colors">
              ← BACK TO LIST
            </Link>
            <Link href="/" className="text-foreground hover:text-accent transition-colors">
              HOME →
            </Link>
          </div>
        </div>
      </article>
  );
}
