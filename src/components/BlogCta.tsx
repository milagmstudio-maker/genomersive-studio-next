import Link from "next/link";

/** ブログ記事末尾の依頼導線。記事を読み終えた直後の温度感を逃さないためのCTA */
export function BlogCta() {
  return (
    <aside className="mt-16 border border-accent/40 bg-accent/[0.04] backdrop-blur-sm">
      <div className="border-b border-white/30 px-5 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/90">
        NEXT STEP
      </div>
      <div className="p-6">
        <p className="font-sans font-bold text-base md:text-lg leading-snug">
          読んで終わりにせず、音で結果を出したい人へ。
        </p>
        <p className="mt-3 text-xs md:text-sm leading-relaxed text-foreground/85">
          「自分でやるのは大変そう」と感じたら、まるごと任せることもできます。ボーカルMix・OBS音響調整のご相談はいつでもどうぞ。相談だけでも歓迎です。
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact"
            className="group flex items-center justify-center gap-3 border border-accent bg-accent/10 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)] transition-all"
          >
            相談・依頼する
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/services"
            className="group flex items-center justify-center gap-3 border border-white/35 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-foreground/90 hover:border-white/70 hover:text-foreground transition-all"
          >
            料金を確認する
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
