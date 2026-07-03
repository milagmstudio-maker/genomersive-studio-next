const FAQS = [
  {
    q: "ボーカルMix（歌ってみた）の料金はいくらですか？",
    a: "ボーカルMixは¥3,000から、歌ってみた・Shorts用なら1曲から承ります。ハモリの量・パート数・特急納期などで変わるので、Servicesの料金シミュレーターで組み合わせれば、依頼前に概算がその場で出せます。",
  },
  {
    q: "歌ってみたのMixだけでも依頼できますか？",
    a: "もちろんです。1曲のボーカルMixだけのご依頼を一番多くいただいています。ピッチ補正・ハモリ作成・マスタリングまで込みで仕上げます。配信やチャンネルの相談はなくても大丈夫です。",
  },
  {
    q: "依頼の進め方がわからないのですが、大丈夫ですか？",
    a: "大丈夫です。フォームから「相談だけ」「見積もりだけ」のご連絡でも歓迎しています。方向性が言葉にならない段階でも、ヒアリングで一緒に整理します。",
  },
  {
    q: "音源（パラデータ）はどうやって渡せばいいですか？",
    a: "Google Drive / Dropbox / ギガファイル便などの共有リンクでお送りください。お問い合わせフォームに共有URL欄があります。書き出し設定がわからない場合もご案内します。",
  },
  {
    q: "Mixの納期はどれくらいかかりますか？",
    a: "通常は1〜2週間です。お急ぎの場合は「5日以降指定」「72時間以内」「24時間以内」の特急オプションがあります（料金シミュレーターで確認できます）。",
  },
  {
    q: "修正には対応してもらえますか？",
    a: "はい。仕上がり確認後の調整に対応しています。範囲や回数の詳細は、ご依頼内容に応じてヒアリング時にご案内します。",
  },
  {
    q: "スマホや安いマイクで録った音源でもMix依頼できますか？",
    a: "できます。ノイズ除去や補正も込みで対応します。ただし素材の状態によって調整できる範囲は変わるので、不安があれば録音前のご相談もどうぞ。なお、スマホ録音の音源は状態の差が大きいため、まず一度ご相談ください。",
  },
  {
    q: "OBS Audio / 配信音響設計では何をしてくれますか？",
    a: "雑談、ゲーム配信、歌枠、ASMRなど、配信内容とお使いの環境に合わせて、声・BGM・ゲーム音・効果音が聞きやすく届くように設計します。対応後は2ヶ月のアフターサポート付きです。",
  },
];

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      id="faq"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>005</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>FAQ / よくある質問</span>
        </div>

        <div className="divide-y divide-white/30 border-y border-white/30">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 px-3 -mx-3 hover:bg-accent/[0.04] transition-colors list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans font-medium text-sm md:text-base leading-snug">
                  {f.q}
                </h3>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 px-3 -mx-3 text-xs md:text-sm leading-relaxed text-foreground/85">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
