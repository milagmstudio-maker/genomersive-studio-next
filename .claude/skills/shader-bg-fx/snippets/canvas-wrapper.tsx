// src/components/ShaderCanvas.tsx
//
// Drop-in Canvas wrapper for this site. Lazy-loads the actual Three.js
// scene via next/dynamic with ssr:false to keep hydration clean on the
// Cloudflare Worker. Render this from layout.tsx in place of (or alongside)
// <BackgroundFX />.
//
// Why this file is so thin: every line you add here ships in the initial
// JS chunk for every route. The actual shader code lives in
// ShaderBackground.tsx and only loads when the browser is ready.

"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./ShaderBackground"), {
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
