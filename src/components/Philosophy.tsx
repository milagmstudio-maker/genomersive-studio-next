import { TopSectionHeading } from "./TopSectionHeading";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative z-10 px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <div className="mx-auto max-w-5xl">
        <TopSectionHeading index="005" en="PHILOSOPHY" ja="サービス思想" />

        <div className="relative overflow-hidden border border-white/30 bg-black/30 px-6 py-10 backdrop-blur-sm md:px-12 md:py-14">
          <span
            aria-hidden
            className="absolute right-0 top-0 h-px w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--accent-cyan))",
            }}
          />
          <h3
            className="max-w-3xl font-mincho text-2xl leading-relaxed md:text-4xl"
            style={{ color: "var(--accent-cream)" }}
          >
            納品して終わりではなく、
            <br className="hidden sm:block" />
            次の一歩が見えるところまで。
          </h3>
          <div className="mt-8 max-w-3xl space-y-5 text-base leading-loose text-foreground/95">
            <p>
              Genomersive Studioは、音を整えることだけをゴールにしていません。
            </p>
            <p>
              作品や配信が聞きやすく届く状態をつくり、必要に応じて投稿や次回制作への活かし方まで一緒に整理します。
            </p>
            <p>
              主役は、常に活動者本人。提案はしますが、決定は奪いません。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
