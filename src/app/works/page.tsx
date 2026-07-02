import { Works } from "@/components/Works";

export const metadata = {
  title: "制作実績・ボーカルMix作品集｜VTuber・歌い手の歌ってみた Genomersive Studio",
  description:
    "ボーカルMix・パラMix・OBS音響調整の制作実績。VTuber・歌い手・配信者の歌ってみた／配信を手がけたサウンドエンジニア MiLa の作品を、YouTube動画でそのまま聴いて確かめられます。",
  openGraph: {
    title: "制作実績 — ボーカルMix・OBS音響調整 Genomersive Studio",
    description: "VTuber・歌い手の歌ってみた／配信の実績を、動画でそのまま確認。",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" as const, images: ["/og-image.jpg"] },
};

export default function WorksPage() {
  return <Works />;
}
