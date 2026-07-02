import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // SEO: workers.dev への流入を正規ドメインへ恒久リダイレクトし、評価を一本化する
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "genomersive-studio-next.mila-gmstudio.workers.dev",
          },
        ],
        destination: "https://genomersivestudio.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
