import Link from "next/link";

export function CtaBand() {
  return (
    <section className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-white/25">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-mono text-[10px] tracking-[0.35em] text-foreground/70">
          GET IN TOUCH
        </p>
        <h2
          className="mt-5 font-mincho text-4xl md:text-6xl tracking-tight"
          style={{ color: "var(--accent-cream)" }}
        >
          まずは、相談から<span style={{ color: "var(--accent-hot)" }}>。</span>
        </h2>
        <p className="mt-6 text-sm md:text-base leading-loose text-foreground/85">
          見積もりだけでも、相談だけでも大丈夫です。初めての依頼の方も多くいます。
          <br className="hidden sm:block" />
          「こんな音にしたい」がまだ言葉にならなくても、一緒に言葉にするところから始めます。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="group flex items-center justify-center gap-3 border border-accent bg-accent/10 px-10 py-4 font-mono text-[11px] tracking-[0.3em] text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)] transition-all w-full sm:w-auto"
          >
            相談・依頼する
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/services"
            className="group flex items-center justify-center gap-3 border border-white/35 px-10 py-4 font-mono text-[11px] tracking-[0.3em] text-foreground/90 hover:border-white/70 hover:text-foreground transition-all w-full sm:w-auto"
          >
            料金を確認する
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
