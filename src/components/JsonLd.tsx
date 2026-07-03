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
        "Vocal Mix・配信音響設計・整音を通じて、VTuber・歌い手・配信者の作品や配信を支えるサウンドエンジニア。",
      knowsAbout: [
        "Vocal Mix",
        "Para Mix",
        "Stem Mix",
        "OBS Audio",
        "Binaural Audio",
        "Audio Editing",
        "Creative Direction",
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
        "Vocal Mix・Para Mix・OBS Audio・Binaural・Audio Edit・Creative Directionを提供する音響制作スタジオ。",
      url: BASE,
      provider: { "@id": `${BASE}/#person` },
      areaServed: "JP",
      availableLanguage: "Japanese",
      serviceType: [
        "Vocal Mix",
        "Para Mix",
        "OBS Audio / 配信音響設計",
        "Binaural",
        "Audio Edit / 整音",
        "Creative Direction",
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
              name: "Vocal Mix",
              description:
                "歌ってみた、カバー、オリジナル楽曲の歌声が自然に届くように整えるVocal Mix。",
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
              name: "Para Mix",
              description: "弾き語り、バンド、複数トラック楽曲の音像とバランスを整えるMix。",
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
              name: "OBS Audio / 配信音響設計",
              description: "雑談、ゲーム配信、歌枠、ASMRに合わせて、聞きやすく届く配信音響を設計。",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "JPY",
              minPrice: 30000,
            },
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Binaural",
              description:
                "ボイス作品やシチュエーション音声の距離感・定位・空間の広がりを整える。",
            },
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Audio Edit / 整音",
              description:
                "整音、ノイズ除去、音量調整、素材修復で音声素材を使いやすい状態へ整える。",
            },
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Creative Direction",
              description:
                "投稿導線、企画整理、見せ方など、音を整えたあとの次の一歩を一緒に整理する。",
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
      description: "音を整え、活動の次の一歩まで。",
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
