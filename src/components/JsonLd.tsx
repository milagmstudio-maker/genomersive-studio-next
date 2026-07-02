const BASE = "https://genomersivestudio.com";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${BASE}/#person`,
      name: "MiLa",
      alternateName: "Genomersive Studio",
      url: BASE,
      sameAs: ["https://x.com/mila_mixstudio"],
      jobTitle: "Sound Engineer / Music Producer / Director",
      description:
        "VTuber・歌い手・配信者向けサウンドエンジニア。ボーカルMix・パラMix・OBS音響調整・プロデュースを手がける。",
      knowsAbout: [
        "Vocal Mix",
        "Para Mix",
        "Stem Mix",
        "OBS Audio",
        "Audio Production",
        "VTuber Support",
        "Live Streaming Audio",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${BASE}/#service`,
      name: "Genomersive Studio",
      description:
        "MiLa主宰のサウンドプロダクション。ボーカルMix・Para(Stem)Mix・OBS音響調整・配信サポートまで。声をブランド化する音響設計。",
      url: BASE,
      provider: { "@id": `${BASE}/#person` },
      areaServed: "JP",
      availableLanguage: "Japanese",
      serviceType: [
        "ボーカルMix",
        "パラMix（ステムMix）",
        "OBS音響調整",
        "プロデュース",
        "配信サポート",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "サービス一覧",
        url: `${BASE}/services`,
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "ボーカルMix",
              description:
                "歌ってみた・Shorts用のボーカルMix。ピッチ補正・ハモリ作成からマスタリングまで込み。",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "JPY",
              minPrice: 3000,
            },
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "パラMix（ステムMix）",
              description: "弾き語り・バンド・オリジナル曲のステムMix。",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "JPY",
              minPrice: 12000,
            },
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "OBS音響調整",
              description: "配信の声をプロ仕様に設計。アフターサポート2ヶ月付き。",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "JPY",
              minPrice: 25000,
            },
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "プロデュース",
              description:
                "Mixing・配信音響調整からチャンネル設計まで、活動をまるごと支えるプラン。個別見積。",
            },
            availability: "https://schema.org/InStock",
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "Genomersive Studio",
      description: "Producer / Director / Sound Engineer",
      publisher: { "@id": `${BASE}/#person` },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
