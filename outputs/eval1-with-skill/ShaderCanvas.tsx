// src/components/ShaderCanvas.tsx
//
// このファイルは layout.tsx から import される薄いラッパー。
// 実際の Three.js Canvas シーンを next/dynamic + ssr:false で遅延ロードする。
//
// ポイント:
//   - このファイル自体は SSR でレンダリングされる (div の骨格のみ出力)
//   - <Scene /> は ssr:false なのでサーバーでは一切レンダリングされない
//   - loading: () => null によりローディングスピナーが表示されず
//     背景の「ポップイン」が発生しない

"use client";

import dynamic from "next/dynamic";

// _ShaderScene は Canvas を含む実コンポーネント。
// ブラウザ側でのみインポート・実行される。
const Scene = dynamic(() => import("./_ShaderScene"), {
  ssr: false,
  loading: () => null,
});

export function ShaderCanvas() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "strict" }}
    >
      <Scene />
    </div>
  );
}
