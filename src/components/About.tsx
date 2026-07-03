import { ReasonCards } from "./ReasonCards";

export function About() {
  return (
    <section
      id="about"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-foreground/80">
          <span>006</span>
          <span className="h-px w-10 bg-foreground/30" />
          <span>ABOUT / MiLaについて</span>
        </div>
        <p className="mb-12 font-mincho text-sm md:text-base leading-relaxed text-foreground/85">
          「誰に頼むか」で音は変わります。だから先に、人の話をします。
        </p>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          {/* Profile */}
          <div>
            {/* Portrait — glitch aesthetic matches the site's visual language */}
            <div className="relative mb-8 w-full max-w-[280px] overflow-hidden border border-white/30">
              <div
                className="glitch-hover"
                style={{ ["--glitch-img" as string]: "url(/mila-portrait.jpg)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mila-portrait.jpg"
                  alt="MiLa portrait"
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/60 backdrop-blur-sm px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] text-foreground/85">
                <span>MILA / PORTRAIT</span>
                <span
                  className="inline-block h-[5px] w-[5px]"
                  style={{
                    background: "var(--accent-cyan)",
                    boxShadow: "0 0 8px rgba(46,255,213,0.7)",
                  }}
                />
              </div>
            </div>

            <h2 className="font-sans font-bold text-2xl md:text-3xl leading-snug">
              MiLa
              <span className="ml-3 font-mono text-[10px] tracking-[0.25em] font-normal text-foreground/70 align-middle">
                PRODUCER / DIRECTOR / SOUND ENGINEER
              </span>
            </h2>
            <p className="mt-6 text-sm md:text-base leading-loose text-foreground/90">
              ミキシングを軸に、録音・音響・PA——現場を自分の手でやってきました。だから音の判断に「たぶん」がありません。
            </p>
            <p className="mt-4 text-sm md:text-base leading-loose text-foreground/90">
              「なんかいい感じにしてほしい」を技術の言葉に翻訳して、技術の話はあなたの言葉で返す。エンジニアとあなたの間に壁を作らないのが、Genomersive Studio のやり方です。
            </p>
            <p className="mt-4 text-sm md:text-base leading-loose text-foreground/90">
              そして音を整えるのは手段で、目的は作品や配信が届くこと。投稿導線、企画の整理、見せ方など、音を整えたあとの次の一歩まで一緒に考えます。
            </p>

            {/* Produce */}
            <div className="mt-8 flex items-center justify-between gap-4 border border-white/30 bg-black/30 backdrop-blur-sm px-4 py-3">
              <span className="font-mono text-[9px] tracking-[0.3em] text-foreground/70 shrink-0">
                PRODUCE
              </span>
              <a
                href="https://x.com/Nijyuuu7"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm text-foreground/95 hover:text-accent transition-colors"
              >
                にじゅな
                <span className="font-mono text-[10px] text-foreground/70 group-hover:text-accent">
                  — VTuber ↗
                </span>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/30 pt-6">
              <div>
                <p className="font-sans text-2xl md:text-3xl font-bold tabular-nums">
                  500+
                </p>
                <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-foreground/70">
                  TOTAL WORKS
                </p>
              </div>
              <div>
                <p className="font-sans text-2xl md:text-3xl font-bold tabular-nums">
                  2022
                </p>
                <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-foreground/70">
                  EST.
                </p>
              </div>
              <div>
                <p className="font-sans text-2xl md:text-3xl font-bold tabular-nums">
                  2<span className="text-base font-normal">ヶ月</span>
                </p>
                <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-foreground/70">
                  OBS AFTER SUPPORT
                </p>
              </div>
            </div>
          </div>

          {/* Reasons */}
          <div className="space-y-6">
            <ReasonCards />

            {/* Setup */}
            <div className="border border-white/30 bg-black/30 backdrop-blur-sm">
              <div className="border-b border-white/30 px-5 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/90">
                SETUP / 使用環境
              </div>
              <dl className="p-5 space-y-3 text-xs md:text-sm">
                {[
                  ["DAW", "Pro Tools / REAPER / Logic Pro"],
                  ["PITCH & VOCAL", "Melodyne 5 Studio / Vovious / RePitch"],
                  ["RESTORATION", "iZotope RX 10"],
                  ["PLUGINS", "FabFilter / Slate Digital / Plugin Alliance, etc..."],
                  ["GENRE", "ポップス / ボカロ / ロック / バラード / メタル"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-4">
                    <dt className="font-mono text-[9px] tracking-[0.2em] text-foreground/70 w-28 shrink-0 pt-[3px]">
                      {k}
                    </dt>
                    <dd className="text-foreground/90 leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
