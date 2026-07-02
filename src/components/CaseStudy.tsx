import Link from "next/link";

/** プロデュース業の証明を担う旗艦事例。Worksのタイルが「棚」、ここは「ショーケース」 */
export function CaseStudy() {
  return (
    <section
      id="case"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>003</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>CASE STUDY / プロデュース事例</span>
        </div>
        <p className="mb-12 font-mincho text-sm md:text-base leading-relaxed text-foreground/85">
          数を並べるより、一つの物語を深く。
        </p>

        <div className="grid md:grid-cols-[1fr_1.2fr] border border-white/30 bg-black/30 backdrop-blur-sm overflow-hidden">
          {/* Key visual */}
          <div className="relative aspect-video md:aspect-auto md:min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/case-nijyuna-kv.jpg"
              alt="にじゅな キービジュアル"
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
          </div>

          <div className="p-6 md:p-9">
            <p
              className="font-mono text-[9px] tracking-[0.28em]"
              style={{ color: "var(--accent-cream)" }}
            >
              PRODUCE / VOCAL MIX / OBS AUDIO / CHANNEL DESIGN
            </p>
            <h3 className="mt-3 font-sans font-bold text-xl md:text-2xl leading-snug">
              にじゅな — 「忘れられない歌手」を、設計する。
            </h3>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-foreground/85">
              歌ってみたのMixだけではなく、配信音響・チャンネル構造・リリース戦略まで。一人のVTuberの「声」を起点に、活動全体を設計している現在進行形のプロジェクト。
            </p>
            <p
              className="mt-4 border-l-2 pl-4 font-mincho text-xs md:text-sm leading-relaxed text-foreground/90"
              style={{ borderColor: "var(--accent-cream)" }}
            >
              2026年6月、歌のための新チャンネルが始動しました。
            </p>
            <Link
              href="/case/nijyuna"
              className="group mt-6 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] hover:text-foreground transition-colors"
              style={{ color: "var(--accent-cream)" }}
            >
              READ CASE
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
