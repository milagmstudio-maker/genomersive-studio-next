import { Services } from "@/components/Services";
import { Flow } from "@/components/Flow";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";

export const metadata = {
  title: "音響制作サービス・料金｜Genomersive Studio",
  description:
    "Vocal Mix、Para Mix、OBS Audio、Binaural、Audio Edit、Creative Directionのサービス内容と受付の流れをご案内します。",
  openGraph: {
    title: "音響制作サービス — Genomersive Studio",
    description: "作品や配信が届く状態になるところまでサポートします。",
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
            音響制作サービスと、ご依頼の進め方。
          </h1>
          <p className="mt-6 font-mincho text-sm md:text-base leading-relaxed text-foreground/85">
            Vocal Mix、Para Mix、配信音響、バイノーラル、整音、投稿導線の相談まで。まず内容や素材を確認し、対応可否・金額・納期をご案内します。価格が決まっている項目は、このページで概算を確認できます。
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
