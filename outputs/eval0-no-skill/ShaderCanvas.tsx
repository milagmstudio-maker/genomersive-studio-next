"use client";

/**
 * ShaderCanvas.tsx
 *
 * Drop-in replacement for BackgroundFX.
 *
 * Uses next/dynamic with ssr:false so Three.js / WebGL is never loaded
 * on the server — critical for Cloudflare Workers (no WebGL runtime).
 *
 * Layout contract preserved from original BackgroundFX:
 *   - pointer-events-none
 *   - fixed inset-0
 *   - z-0
 *   - overflow-hidden
 *   - aria-hidden
 *
 * Usage:
 *   // Replace the old import:
 *   // import { BackgroundFX } from "@/components/BackgroundFX";
 *   import { ShaderCanvas } from "@/components/ShaderCanvas";
 *   // …and in JSX:
 *   <ShaderCanvas />
 */

import dynamic from "next/dynamic";

// Dynamically import the scene so Three.js is bundled only for client
const ShaderScene = dynamic(
  () => import("./_ShaderScene").then((m) => ({ default: m.ShaderScene })),
  {
    ssr: false,
    // Show nothing during SSR/hydration — the canvas appears after JS loads
    loading: () => null,
  }
);

export function ShaderCanvas() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <ShaderScene />
    </div>
  );
}
