import { Services } from "@/components/Services";
import { Flow } from "@/components/Flow";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";

export const metadata = {
  title: "ボーカルMix・OBS音響調整の料金｜依頼前に概算がわかる Genomersive Studio",
  description:
    "ボーカルMix・パラMix・OBS音響調整の料金を、依頼する前にその場で確認。VTuber・歌い手向けのプラン・納期・オプションを組み合わせて概算見積もりが出せます。料金は¥3,000から、すべて公開。",
  openGraph: {
    title: "料金シミュレーター — ボーカルMix・OBS音響調整 Genomersive Studio",
    description: "ボーカルMix・OBS音響調整の料金を、依頼前にその場で。¥3,000から、すべて公開。",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" as const, images: ["/og-image.jpg"] },
};

export default function ServicesPage() {
  return (
    <>
      {/* SEO/導入見出し — 検索エンジンに「何の料金ページか」を伝え、読者の入口不安を先に消す */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-0">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-sans font-bold text-2xl md:text-4xl leading-tight">
            ボーカルMix・OBS音響調整の料金と、依頼の進め方。
          </h1>
          <p className="mt-6 font-mincho text-sm md:text-base leading-relaxed text-foreground/85">
            「いくらかかるか分からないと、相談すらしづらい」——その入口の不安を、先に消します。ボーカルMix・パラMix・OBS音響調整の料金を、依頼する前にこのページで組み立てて確認できます。VTuber・歌い手・配信者の歌ってみたから配信まで、必要なぶんだけ。
          </p>
        </div>
      </section>
      <Services />
      <Flow />
      <Faq />
      <CtaBand />
    </>
  );
}
