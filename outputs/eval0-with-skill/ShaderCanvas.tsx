// outputs/eval0-with-skill/ShaderCanvas.tsx
//
// Drop-in replacement for <BackgroundFX />.
// Lazy-loads _ShaderScene (Three.js / R3F) via next/dynamic with ssr:false
// so the Cloudflare Workers SSR pass never touches WebGL code.
//
// Usage in layout.tsx (Server Component):
//   import { ShaderCanvas } from "@/components/ShaderCanvas";
//   ...
//   <ShaderCanvas />
//
// z-index and pointer-events match the original BackgroundFX exactly.

"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./_ShaderScene"), {
  ssr: false,
  loading: () => null, // no placeholder — avoids a visible "pop"
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
