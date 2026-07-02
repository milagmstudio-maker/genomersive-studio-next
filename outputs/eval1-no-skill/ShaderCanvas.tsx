/**
 * ShaderCanvas.tsx
 *
 * SSR を完全に無効化する薄いラッパー。
 *
 * なぜこのファイルが必要か:
 *   - "use client" だけではサーバー側でのプリレンダリングを防げない。
 *   - next/dynamic({ ssr: false }) を使うことで、このコンポーネントは
 *     サーバー（Cloudflare Workers）では一切レンダリングされず、
 *     クライアントの JS バンドルが読み込まれてから初めてマウントされる。
 *   - これにより window / WebGL などブラウザ専用 API への参照が
 *     サーバーで実行されることがなくなり、Hydration mismatch が解消される。
 *
 * 使い方:
 *   layout.tsx やページコンポーネントから import してそのまま配置するだけ。
 *   このファイル自体は Server Component として扱われる（"use client" 不要）。
 */

import dynamic from "next/dynamic";

// _ShaderScene はサーバーでは読み込まれない
const ShaderScene = dynamic(() => import("./_ShaderScene"), {
  ssr: false,
  // サーバー出力とクライアント出力を一致させるため、
  // ローディング中は何も表示しない（null）
  loading: () => null,
});

export function ShaderCanvas() {
  return <ShaderScene />;
}
