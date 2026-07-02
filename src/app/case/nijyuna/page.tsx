import Link from "next/link";

export const metadata = {
  title: "CASE: にじゅな — Genomersive Studio",
  description:
    "VTuber・歌手「にじゅな」のプロデュース事例。ボーカルMix・OBS音響調整・チャンネル設計まで、声を起点に活動全体を設計するGenomersive Studioのケーススタディ。",
  openGraph: {
    title: "CASE: にじゅな — 「忘れられない歌手」を、設計する。",
    description:
      "ボーカルMix・OBS音響調整・チャンネル設計。声を起点に活動全体を設計するプロデュース事例。",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" as const, images: ["/og-image.jpg"] },
};

function Embed({
  id,
  title,
  vertical = false,
}: {
  id: string;
  title: string;
  vertical?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden border border-white/30 bg-black ${
        vertical ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        allowFullScreen
      />
    </div>
  );
}

function CaseSection({
  no,
  en,
  jp,
  children,
}: {
  no: string;
  en: string;
  jp: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20">
      <header className="flex items-baseline gap-5 border-b border-white/30 pb-4 mb-8">
        <span
          className="font-serif italic text-3xl md:text-4xl tracking-tight"
          style={{ color: "var(--accent-cyan)" }}
        >
          {no}
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[0.3em] text-foreground/95">
            {en}
          </span>
          <span className="font-sans text-[11px] text-foreground/75">{jp}</span>
        </div>
      </header>
      {children}
    </section>
  );
}

export default function NijyunaCasePage() {
  return (
    <article className="relative z-10 px-6 md:px-12 lg:px-20 pt-32 pb-32">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>CASE 001</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>PRODUCE / VOCAL MIX / OBS AUDIO / CHANNEL DESIGN</span>
        </div>
        <h1 className="mt-6 font-sans font-bold text-3xl md:text-5xl leading-tight tracking-tight">
          にじゅな
        </h1>
        <p className="mt-4 font-mincho text-lg md:text-2xl text-foreground/90">
          「忘れられない歌手」を、設計する。
        </p>

        {/* Key visual — 全体を見せる（クロップしない） */}
        <div className="mt-10 relative overflow-hidden border border-white/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/case-nijyuna-kv.jpg"
            alt="にじゅな キービジュアル"
            className="w-full h-auto"
          />
        </div>

        {/* Overview */}
        <div className="mt-12 border border-white/30 bg-black/30 backdrop-blur-sm">
          <div className="border-b border-white/30 px-5 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/90">
            OVERVIEW
          </div>
          <dl className="p-5 space-y-3 text-xs md:text-sm">
            {[
              ["TALENT", "にじゅな（個人勢VTuber・歌手）"],
              ["BRAND", "「声が、景色になる」"],
              ["ROLE", "ボーカルMix / OBS音響調整 / チャンネル設計 / プロデュース・マネジメント"],
              ["STATUS", "進行中 — 2026年6月、歌のための新チャンネル始動"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4">
                <dt className="font-mono text-[9px] tracking-[0.2em] text-foreground/70 w-20 shrink-0 pt-[3px]">
                  {k}
                </dt>
                <dd className="text-foreground/90 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-12 text-sm md:text-base leading-loose text-foreground/90">
          依頼の始まりは、一本の歌ってみたのMixでした。声を聴いて確信したのは、「整える」だけではもったいないということ。歌の音、配信の音、そして届け方——バラバラに最適化されがちな要素を、一人の耳でまとめて設計しているのがこのプロジェクトです。
        </p>

        {/* 01 歌 */}
        <CaseSection no="01" en="VOCAL" jp="歌の音 — 声が主役になるMix">
          <p className="mb-8 text-sm md:text-base leading-loose text-foreground/90">
            テンプレ設定のコピーではなく、にじゅなの声質を起点に設計したMix。オケに埋もれず、盛りすぎず。「この声を覚えて帰ってもらう」ための音作りです。
          </p>
          <div className="grid gap-6 sm:grid-cols-[1.78fr_1fr] items-start">
            <Embed id="V7IhaLDXk3E" title="アルジャーノン / ヨルシカ covered by にじゅな" />
            <Embed id="p3V71Y2zkrg" title="にじゅな — Shorts" vertical />
          </div>
        </CaseSection>

        {/* 02 配信 */}
        <CaseSection no="02" en="STREAM" jp="配信の音 — OBS音響設計">
          <p className="mb-8 text-sm md:text-base leading-loose text-foreground/90">
            「歌ってみたは良い音なのに、配信はいつもの音」という分断をなくすため、OBSの音響をマイクから設計。調整前と調整後の違いは、説明するより聴いたほうが早いはずです。
          </p>
          <Embed id="07jz4h_p7J0" title="OBS音響調整のbefore / after" />
        </CaseSection>

        {/* 03 設計 */}
        <CaseSection no="03" en="DESIGN" jp="活動の設計 — チャンネル再構築">
          <p className="text-sm md:text-base leading-loose text-foreground/90">
            音を良くするだけなら技術の仕事。このプロジェクトでは、「歌」を軸にしたチャンネル構造の再設計まで踏み込んでいます。歌のためのメインチャンネルと、素顔の見える既存チャンネル——役割を分けた二段構成へ。2026年6月、新チャンネルが始動しました。
          </p>
          <a
            href="https://www.youtube.com/@Nijyuna714"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-3 border border-white/35 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-foreground/90 hover:border-white/70 hover:text-foreground transition-all"
          >
            新チャンネルを見る
            <span className="transition-transform group-hover:translate-x-1">↗</span>
          </a>
          <p
            className="mt-8 border-l-2 pl-4 font-mincho text-sm md:text-base leading-relaxed text-foreground/90"
            style={{ borderColor: "var(--accent-cream)" }}
          >
            この物語は進行中です。結果は、このページで更新していきます。
          </p>
        </CaseSection>

        {/* CTA */}
        <aside className="mt-20 border border-accent/40 bg-accent/[0.04] backdrop-blur-sm">
          <div className="border-b border-white/30 px-5 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/90">
            NEXT STEP
          </div>
          <div className="p-6">
            <p className="font-sans font-bold text-base md:text-lg leading-snug">
              1曲のMixから、活動全体の設計まで。
            </p>
            <p className="mt-3 text-xs md:text-sm leading-relaxed text-foreground/85">
              「何から相談すればいいかわからない」段階で大丈夫です。一緒に言葉にするところから始めます。
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="group flex items-center justify-center gap-3 border border-accent bg-accent/10 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)] transition-all"
              >
                相談・依頼する
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/works"
                className="group flex items-center justify-center gap-3 border border-white/35 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-foreground/90 hover:border-white/70 hover:text-foreground transition-all"
              >
                他の実績を聴く
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Footer nav */}
        <div className="mt-20 pt-8 border-t border-white/30 flex justify-between font-mono text-[11px] tracking-[0.3em]">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            ← HOME
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="https://www.youtube.com/@Nijyuna714"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors"
            >
              YouTube ↗
            </a>
            <a
              href="https://x.com/Nijyuuu7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors"
            >
              X ↗
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
