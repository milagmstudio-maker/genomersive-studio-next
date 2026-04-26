import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost } from "@/lib/microcms";
import { BackgroundFX } from "@/components/BackgroundFX";
import { BrandMark } from "@/components/BrandMark";
import { Cursor } from "@/components/Cursor";
import { GlitchOverlay } from "@/components/GlitchOverlay";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

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
    <main className="relative min-h-screen">
      <BackgroundFX />
      <GlitchOverlay />
      <Cursor />
      <BrandMark />

      <Link
        href="/blog"
        className="fixed top-5 right-6 z-30 font-mono text-[11px] tracking-[0.3em] text-foreground/70 hover:text-accent transition-colors"
      >
        ← BLOG
      </Link>

      <article className="relative z-10 px-6 md:px-12 pt-32 pb-32">
        <div className="mx-auto max-w-3xl">
          {/* Meta */}
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/50 mb-6">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="h-px w-8 bg-foreground/30" />
            <span className="text-accent">{post.category?.[0] ?? ""}</span>
          </div>

          {/* Title */}
          <h1 className="font-sans font-bold text-3xl md:text-5xl leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 font-serif italic text-lg md:text-xl text-foreground/70 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.thumbnail && (
            <div className="mt-12 relative aspect-video overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${post.thumbnail.url}?w=1200&fit=crop`}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div
            className="prose-mila mt-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer nav */}
          <div className="mt-20 pt-8 border-t border-white/10 flex justify-between font-mono text-[11px] tracking-[0.3em]">
            <Link href="/blog" className="text-foreground/70 hover:text-accent transition-colors">
              ← BACK TO LIST
            </Link>
            <Link href="/" className="text-foreground/70 hover:text-accent transition-colors">
              HOME →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
