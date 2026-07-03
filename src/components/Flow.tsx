const STEPS = [
  {
    no: "01",
    en: "CONTACT",
    jp: "お問い合わせ",
    body: "フォームから気軽にご連絡ください。相談だけ・見積もりだけでも大丈夫です。",
  },
  {
    no: "02",
    en: "CHECK",
    jp: "内容・環境の確認",
    body: "ご依頼内容、素材、配信環境を確認します。素材の状態や不足もこの段階で整理します。",
  },
  {
    no: "03",
    en: "PROPOSAL",
    jp: "対応可否・金額・納期のご案内",
    body: "確認した内容をもとに、対応可否、金額、納期の目安をご案内します。",
  },
  {
    no: "04",
    en: "ACCEPTANCE",
    jp: "正式受付・お支払い",
    body: "内容にご同意いただいた時点で正式受付となり、お支払いをお願いします。",
  },
  {
    no: "05",
    en: "START",
    jp: "作業開始",
    body: "お支払いと必要素材を確認後、確定した方向性に沿って作業を開始します。",
  },
  {
    no: "06",
    en: "FIRST CHECK",
    jp: "初稿共有 / 設定調整",
    body: "初稿または設定内容をご確認いただき、必要に応じて調整します。",
  },
  {
    no: "07",
    en: "DELIVERY",
    jp: "納品 / 完了",
    body: "完成データの納品、または配信設定の確認をもって対応完了となります。",
  },
  {
    no: "08",
    en: "NEXT STEP",
    jp: "次の一歩のご提案",
    body: "必要に応じて、次回の改善点や投稿・配信への活かし方をご提案します。",
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

        <div className="mt-12 border border-white/30 bg-black/30 p-6 backdrop-blur-sm md:p-8">
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-foreground/80">
            <span className="inline-block h-[6px] w-[6px] bg-accent shadow-[0_0_8px_rgba(176,38,255,0.9)]" />
            RECEPTION / PAYMENT / DEADLINE
          </div>
          <div className="grid gap-5 text-sm leading-loose text-foreground/90 md:grid-cols-3">
            <p>
              まずは内容や素材を確認したうえで、対応可否・金額・納期をご案内します。
            </p>
            <p>
              正式に受付となったタイミングでお支払いをお願いしています。お支払い確認後、作業開始となります。
            </p>
            <p>
              納期は必要素材がすべて揃ってからの目安です。素材不足や確認事項がある場合、後ろにずれる場合があります。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
