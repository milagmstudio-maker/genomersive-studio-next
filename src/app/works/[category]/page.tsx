import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Works } from "@/components/Works";
import {
  ACTIVE_CATEGORIES,
  CATEGORY_SLUGS,
  categoryFromSlug,
  type WorkCategory,
} from "@/data/works";

// 実績があるカテゴリだけをビルド時に生成する。それ以外のURLはページ側の notFound() で404。
// ※ dynamicParams = false は使わない。このサイトのOpenNextにはキャッシュ設定が無く、
//   ビルド時に作ったページを読めないため、全カテゴリが404になる（2026-09-18に本番で発生）
export function generateStaticParams() {
  return ACTIVE_CATEGORIES.map((c) => ({ category: CATEGORY_SLUGS[c] }));
}

const META: Record<WorkCategory, { title: string; description: string }> = {
  "VOCAL MIX": {
    title: "ボーカルMix 制作実績｜歌ってみたMix Genomersive Studio",
    description:
      "VTuber・歌い手の歌ってみたボーカルMixの制作実績。サウンドエンジニア MiLa が手がけた作品を、YouTube動画でそのまま聴いて確かめられます。",
  },
  "PARA MIX": {
    title: "パラMix 制作実績｜弾き語り・バンド音源 Genomersive Studio",
    description:
      "弾き語り・バンド音源などパラMixの制作実績。サウンドエンジニア MiLa が手がけた作品を、YouTube動画でそのまま聴いて確かめられます。",
  },
  "OBS AUDIO": {
    title: "OBS音響調整・配信音響の実績｜VTuber配信 Genomersive Studio",
    description:
      "VTuber・配信者のOBS音響調整／配信音響設計の実績。歌枠や配信の音を、実際のアーカイブ動画で確かめられます。",
  },
  PRODUCTION: {
    title: "プロデュース実績｜Genomersive Studio",
    description:
      "Genomersive Studio のプロデュース実績。サウンドエンジニア MiLa が関わった作品を、YouTube動画で確かめられます。",
  },
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = categoryFromSlug(category);
  if (!c) return {};
  const { title, description } = META[c];
  const url = `/works/${category}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  };
}

export default async function WorksCategoryPage({ params }: Props) {
  const { category } = await params;
  const c = categoryFromSlug(category);
  if (!c || !ACTIVE_CATEGORIES.includes(c)) notFound();
  return <Works key={c} category={c} />;
}
