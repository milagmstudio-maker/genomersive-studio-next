const STEPS = [
  {
    no: "01",
    en: "CONTACT",
    jp: "お問い合わせ",
    body: "フォームから気軽にご連絡ください。相談だけ・見積もりだけでも大丈夫です。",
  },
  {
    no: "02",
    en: "HEARING",
    jp: "ヒアリング",
    body: "仕上がりの方向性・納期・金額をすり合わせて確定します。",
  },
  {
    no: "03",
    en: "DATA",
    jp: "音源のご共有",
    body: "Google Drive / Dropbox / ギガファイル便などの共有リンクでお送りください。",
  },
  {
    no: "04",
    en: "WORK",
    jp: "Mix・調整作業",
    body: "確定した方向性をもとに作業します。進行中の質問もいつでもどうぞ。",
  },
  {
    no: "05",
    en: "CHECK",
    jp: "ご確認・修正",
    body: "仕上がりを確認していただき、気になる点があれば調整します。",
  },
  {
    no: "06",
    en: "DELIVERY",
    jp: "納品",
    body: "完成データをお渡しして完了。OBS音響調整はアフターサポート2ヶ月付きです。",
  },
];

export function Flow() {
  return (
    <section
      id="flow"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>004</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>FLOW / 依頼の流れ</span>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.no}
              className="border border-white/30 bg-black/30 backdrop-blur-sm p-5"
            >
              <div className="flex items-baseline gap-4">
                <span
                  className="font-serif italic text-3xl"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  {s.no}
                </span>
                <div>
                  <p className="font-mono text-[9px] tracking-[0.3em] text-foreground/70">
                    {s.en}
                  </p>
                  <h3 className="font-sans font-bold text-base">{s.jp}</h3>
                </div>
              </div>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-foreground/85">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
