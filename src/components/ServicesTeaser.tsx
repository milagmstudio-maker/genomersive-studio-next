import Link from "next/link";

const SERVICES = [
  {
    en: "VOCAL MIX",
    jp: "Vocal Mix",
    price: "¥3,000〜",
    description:
      "歌ってみた、カバー、オリジナル楽曲に対応。歌声の魅力が自然に届くように整えます。",
  },
  {
    en: "PARA MIX",
    jp: "Para Mix",
    price: "¥12,000〜",
    description: "弾き語り、バンド、複数トラック楽曲の音像とバランスを整えます。",
  },
  {
    en: "OBS AUDIO",
    jp: "OBS Audio",
    price: "¥30,000",
    description:
      "雑談、ゲーム配信、歌枠、ASMRに合わせて、聞きやすく届く配信音響を設計します。",
  },
  {
    en: "BINAURAL",
    jp: "Binaural",
    price: "個別相談",
    description:
      "ボイス作品やシチュエーション音声の距離感・定位・空間の広がりを整えます。",
  },
  {
    en: "AUDIO EDIT",
    jp: "Audio Edit",
    price: "個別相談",
    description:
      "整音、ノイズ除去、音量調整、素材修復で、音声を使いやすい状態へ整えます。",
  },
  {
    en: "CREATIVE DIRECTION",
    jp: "Creative Direction",
    price: "個別相談",
    description:
      "投稿導線、企画整理、見せ方など、音を整えたあとの次の一歩を一緒に整理します。",
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
          音響制作から、作品や配信を届けるための次の一歩まで。
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
