import Link from "next/link";

const SERVICES = [
  {
    en: "VOCAL MIX",
    jp: "ボーカルMix",
    price: "¥3,000〜",
    description:
      "歌ってみた・Shorts用のMix。ピッチ補正・ハモリ作成からマスタリングまで込み。",
  },
  {
    en: "PARA MIX",
    jp: "パラMix（ステム）",
    price: "¥12,000〜",
    description: "弾き語り・バンド・オリジナル曲のステムMix。",
  },
  {
    en: "OBS AUDIO",
    jp: "OBS音響調整",
    price: "¥25,000〜",
    description:
      "配信の声をプロ仕様に設計。アフターサポート2ヶ月付き。",
  },
  {
    en: "PRODUCTION",
    jp: "プロデュース",
    price: "個別見積",
    description:
      "Mixing・配信音響調整からチャンネル設計まで、活動をまるごと支えるプラン。",
  },
];

export function ServicesTeaser() {
  return (
    <section
      id="services-teaser"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>004</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>SERVICES / できること</span>
        </div>
        <p className="mb-12 font-mincho text-sm md:text-base leading-relaxed text-foreground/85">
          料金は隠しません。組み合わせて、その場で概算が出せます。
        </p>

        <ul className="divide-y divide-white/30 border-y border-white/30">
          {SERVICES.map((s) => (
            <li key={s.en}>
              <Link
                href="/services"
                className="group grid grid-cols-[1fr_auto] sm:grid-cols-[180px_1fr_110px_24px] items-center gap-x-4 gap-y-1 sm:gap-8 py-6 hover:bg-accent/[0.04] px-3 -mx-3 transition-colors"
              >
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] text-foreground/75">
                    {s.en}
                  </p>
                  <p className="font-sans font-bold text-base md:text-lg leading-snug">
                    {s.jp}
                  </p>
                </div>
                <p className="col-span-2 sm:col-span-1 row-start-2 sm:row-start-auto text-xs md:text-sm leading-relaxed text-foreground/85">
                  {s.description}
                </p>
                <p className="font-mono text-sm text-accent text-right tabular-nums">
                  {s.price}
                </p>
                <span className="hidden sm:block text-foreground/70 group-hover:text-accent group-hover:translate-x-1 transition-all text-right">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-end">
          <Link
            href="/services"
            className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-foreground/85 hover:text-accent transition-colors"
          >
            料金シミュレーターで概算を出す
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
