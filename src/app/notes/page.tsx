import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ご依頼に関する留意事項｜Genomersive Studio",
  description: "Genomersive Studioへ制作をご依頼いただく前にご確認いただきたい留意事項です。",
  openGraph: {
    title: "ご依頼に関する留意事項 — Genomersive Studio",
    description: "制作のご相談前にご確認いただきたい内容をまとめています。",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
};

export default function NotesPage() {
  return (
    <section className="relative z-10 px-5 py-28 sm:px-8 md:py-36 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* 見出しは2列の上に置き、ページ幅いっぱいまで大きく（「Notes.」は字幅≒級数×4.0） */}
        <div className="@container mb-12 lg:mb-16">
          <p className="font-mono text-[10px] tracking-[0.34em] text-accent-cyan">POLICY / BEFORE INQUIRY</p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,24.3cqw,12rem)] font-medium leading-[0.9] tracking-[-0.055em] text-foreground">Notes.</h1>
        </div>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(560px,1.28fr)] lg:gap-20">
        <header className="self-start lg:sticky lg:top-24">
          <p className="font-mincho text-xl leading-[1.9] tracking-[0.06em] text-foreground md:text-2xl">ご依頼に対する留意事項</p>
          <p className="mt-5 max-w-md text-sm leading-8 text-foreground/70">ご相談前に確認していただきたい内容をまとめています。</p>
          <p className="mt-8 font-mono text-[10px] tracking-[0.18em] text-foreground/45">最終更新日：2026年8月31日</p>
          <Link href="/contact" className="mt-10 inline-flex min-h-11 items-center font-mono text-[10px] tracking-[0.2em] text-accent-cyan transition-colors hover:text-foreground">← CONTACTへ戻る</Link>
        </header>

        <div className="border border-white/15 bg-[#060b15]/90 px-5 py-3 shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:px-8 md:px-10">
          <NoteSection index="01" title="お支払いについて">
            <p>お見積もりと制作内容をご確認いただいた後に、お支払い方法と着手時期をご案内します。お見積もり内容へのご承諾とご入金の確認をもって、正式なご依頼成立となります。個別の条件はお見積もり時にお伝えします。</p>
          </NoteSection>

          <NoteSection index="02" title="音源や素材のご準備について">
            <p>ご共有いただく音源・映像などは、依頼者さまが必要な利用許諾を得ているものとして制作を進めます。持ち込み素材の権利関係により生じたトラブルについては、当スタジオでは責任を負いかねますので、あらかじめご了承ください。</p>
          </NoteSection>

          <NoteSection index="03" title="修正と納期について">
            <p>ご希望の納期、制作内容、素材の状態を確認したうえで進行をご案内します。修正範囲や追加作業が発生する場合は、作業前に確認します。</p>
          </NoteSection>

          <NoteSection index="04" title="ご連絡について">
            <p>通常24時間以内を目安にご返信します。内容の確認に時間が必要な場合や、休業日を挟む場合は返信が前後することがあります。</p>
          </NoteSection>

          <NoteSection index="05" title="作品の公開について">
            <ul className="space-y-3">
              <li>完成した作品をご投稿の際は、以下のクレジット表記をお願いいたします。表記が難しい場合は、事前にご相談ください。</li>
              <li className="border-l border-accent/60 pl-4 text-foreground">例：MiLa (Genomersive Studio)</li>
              <li>
                <a href="https://genomersivestudio.com/" target="_blank" rel="noopener noreferrer" className="break-all text-accent-cyan underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground">https://genomersivestudio.com/ ↗</a>
              </li>
            </ul>
          </NoteSection>

          <NoteSection index="06" title="制作実績への掲載について">
            <p>Genomersive StudioのサイトやXなどで、制作実績として紹介する場合があります。</p>
          </NoteSection>

          <NoteSection index="07" title="キャンセル・留意事項の改定について" last>
            <ul className="space-y-3">
              <li>ご入金後、お客様都合によるキャンセルは、原則として返金を承っておりません。</li>
              <li>当スタジオの都合により制作を継続できなくなった場合は、受領済みの金額を全額返金します。</li>
              <li>本留意事項は、必要に応じて改定する場合があります。改定後の内容は、掲載日以降に新たに受け付けたご依頼に適用します。</li>
            </ul>
          </NoteSection>
        </div>
      </div>
      </div>
    </section>
  );
}

function NoteSection({ index, title, children, last = false }: { index: string; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section className={last ? "py-9" : "border-b border-white/15 py-9"}>
      <div className="grid gap-4 sm:grid-cols-[40px_1fr] sm:gap-5">
        <span className="font-mono text-[10px] tracking-[0.16em] text-accent-text">{index}</span>
        <div>
          <h2 className="font-mincho text-lg leading-8 tracking-[0.04em] text-foreground md:text-xl">{title}</h2>
          <div className="mt-4 text-sm leading-8 text-foreground/72 md:text-[15px]">{children}</div>
        </div>
      </div>
    </section>
  );
}
