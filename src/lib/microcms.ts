import { createClient } from "microcms-js-sdk";

export type BlogCategory =
  | "音響Tips"
  | "Mix"
  | "OBS設定"
  | "機材レビュー"
  | "お知らせ";

export type BlogPost = {
  id: string;
  title: string;
  category: string[]; // microCMS select field returns array
  thumbnail?: { url: string; height: number; width: number };
  excerpt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  // Don't throw at import time during build — let the request itself fail with a clearer message
  console.warn("[microcms] MICROCMS_SERVICE_DOMAIN or MICROCMS_API_KEY is not set");
}

export const microcms = createClient({
  serviceDomain: serviceDomain ?? "",
  apiKey: apiKey ?? "",
});

export async function getPosts(opts?: {
  limit?: number;
  category?: string;
}) {
  const queries: Record<string, string | number> = {
    orders: "-publishedAt",
    limit: opts?.limit ?? 100,
  };
  if (opts?.category) {
    queries.filters = `category[contains]${opts.category}`;
  }
  return microcms.getList<BlogPost>({
    endpoint: "blog",
    queries,
  });
}

export async function getPost(id: string) {
  return microcms.getListDetail<BlogPost>({
    endpoint: "blog",
    contentId: id,
  });
}

export const CATEGORY_LIST: BlogCategory[] = [
  "音響Tips",
  "Mix",
  "OBS設定",
  "機材レビュー",
  "お知らせ",
];

export function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
