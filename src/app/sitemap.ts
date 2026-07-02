import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/microcms";

const BASE = "https://genomersivestudio.com";

export const revalidate = 3600; // 1時間ごとに再生成

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/works`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/case/nijyuna`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/contact`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
  ];

  try {
    const { contents: posts } = await getPosts({ limit: 200 });
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    return [...staticRoutes, ...blogRoutes];
  } catch {
    // microCMS が取得できない場合は静的ルートだけ返す
    return staticRoutes;
  }
}
