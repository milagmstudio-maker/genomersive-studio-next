type Props = {
  index: string;
  /** 大きく見せる英字見出し（例: SELECTED WORKS） */
  en: string;
  /** 小さく添える和文（例: 代表作）。見出し要素にも含めて検索エンジンに渡す */
  ja: string;
  /** 見出し下のリード文 */
  lead?: string;
};

/**
 * トップページ各セクションの見出し。
 * 小さな番号＋和文のラベルの下に、横長の極太英字を大きく置いてセクションの切れ目を作る。
 */
export function TopSectionHeading({ index, en, ja, lead }: Props) {
  return (
    <div className={lead ? "mb-12" : "mb-10"}>
      <div className="flex items-center gap-4 font-mono text-[11px] text-foreground/85" aria-hidden="true">
        <span>{index}</span>
        <span className="h-px w-10 bg-foreground/30" />
        <span>{ja}</span>
      </div>
      <h2 className="mt-3 font-serif text-[32px] leading-[1.02] sm:text-5xl md:text-6xl">
        {en}
        <span className="sr-only"> / {ja}</span>
      </h2>
      {lead && (
        <p className="mt-5 font-mincho text-base leading-relaxed text-foreground/90">{lead}</p>
      )}
    </div>
  );
}
