type Props = {
  index: string;
  kicker: string;
  title: string;
  /** タイトル下に表示するリード文（1行）。セクションの役割を日本語で言い切る */
  lead?: string;
};

/**
 * Editorial section header: small index + mono kicker, large serif title.
 * Title uses warm cream tone for atmosphere; the trailing period is hot magenta.
 */
export function SectionLabel({ index, kicker, title, lead }: Props) {
  // Split title into base + trailing punctuation for a colored period.
  const match = title.match(/^(.*?)([.。!?]?)$/);
  const base = match?.[1] ?? title;
  const punct = match?.[2] ?? "";

  return (
    <header className="mb-16 md:mb-24">
      <div
        className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em]"
        style={{ color: "var(--accent-cream)", opacity: 0.6 }}
      >
        <span>{index}</span>
        <span
          className="h-px w-10"
          style={{ background: "rgba(244,232,193,0.4)" }}
        />
        <span>{kicker}</span>
      </div>
      <h2
        className="mt-5 font-serif italic text-5xl md:text-7xl lg:text-8xl tracking-tight"
        style={{ color: "var(--accent-cream)" }}
      >
        {base}
        {punct && (
          <span style={{ color: "var(--accent-hot)" }}>{punct}</span>
        )}
      </h2>
      {lead && (
        <p className="mt-6 font-mincho text-sm md:text-base leading-relaxed text-foreground/85">
          {lead}
        </p>
      )}
    </header>
  );
}
