# Performance — Mobile, Bundle, Frame Rate

The site already targets mobile (DotNav and Hero use viewport-driven sizing). A shader BG can wreck that if you're not deliberate. Targets and the levers to hit them:

| Metric | Target | Why |
|---|---|---|
| Total client JS (post-gzip) | < 1.5MB on `/` | Cloudflare cold-start matters; first paint shouldn't wait on three.js |
| Three.js + R3F + drei chunk | < 600KB gzipped | drei is the swing factor — see below |
| FPS on mid-tier Android | ≥ 45 sustained | iPhone 15 baseline is fine; Snapdragon 7-series is the floor |
| Frame time p95 | ≤ 22ms | Anything spikier and the page feels janky during scroll |
| GPU memory | < 256MB | Older Androids OOM at ~512MB |

---

## Lever 1 — Import drei components individually

drei is the largest dep by far in this stack. Import only what you use.

❌ Don't:
```tsx
import * as drei from "@react-three/drei";
```
This pulls every helper into the bundle (3D text loaders, environment HDRIs, GLTF helpers, etc.) — easily 800KB.

✅ Do:
```tsx
import { ScreenQuad } from "@react-three/drei";
import { useDetectGPU } from "@react-three/drei";
```
Tree-shaking works fine when you name the imports. drei is structured so each helper is its own module.

For shader BGs you typically only need: `ScreenQuad`, `useDetectGPU`, occasionally `shaderMaterial`.

---

## Lever 2 — `frameloop` mode

`<Canvas frameloop="...">` controls how often the GPU re-renders.

| Mode | Use when |
|---|---|
| `"always"` (default) | The shader genuinely animates every frame (uTime-driven noise) |
| `"demand"` | Static scene that only changes on input |
| `"never"` | You're calling `gl.render` manually |

For the project's current `BackgroundFX` look (continuous noise/glitch) `"always"` is correct. But if a viewer is tabbed away, R3F still drains battery. Pause when not visible:

```tsx
import { useEffect, useState } from "react";

function VisibilityGate({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);
  return visible ? <>{children}</> : null;
}
```

Or use IntersectionObserver to only animate when the Canvas is on screen.

---

## Lever 3 — GPU tier fallback

Not every device should run shaders. drei ships `useDetectGPU`, which returns a tier 0–3 (0 = unsupported, 3 = high-end). Fall back to the CSS background for tier 0 or 1:

```tsx
"use client";
import { useDetectGPU } from "@react-three/drei";
import { ShaderCanvas } from "./ShaderCanvas";
import { BackgroundFX } from "./BackgroundFX";   // existing CSS-based fallback

export function AdaptiveBackground() {
  const gpu = useDetectGPU();
  if (!gpu || gpu.tier <= 1) return <BackgroundFX />;
  return <ShaderCanvas />;
}
```

Note: `useDetectGPU` itself uses `window`, so this component must be inside a `"use client"` boundary and ideally lazy-loaded. The result is cached, so it's cheap to call.

---

## Lever 4 — Pixel ratio cap

By default R3F uses `devicePixelRatio`. On a 3x retina phone that's 9× the pixels of a 1x render. Cap it:

```tsx
<Canvas dpr={[1, 1.75]}>   {/* min 1, max 1.75 — never the full 3x */}
```

For background visuals the user is barely paying attention to, 1.5 is plenty. This single change can double frame rate on iPhones.

---

## Lever 5 — Resolution-scaled targets for postprocessing

Post-processing passes (Bloom especially) operate per-pixel. Render the post-FX at half-res and upscale:

```tsx
import { EffectComposer } from "@react-three/postprocessing";

<EffectComposer multisampling={0} resolutionScale={0.5}>
  ...
</EffectComposer>
```

Visually nearly identical for soft glows; halves the GPU work.

---

## Lever 6 — Keep uniforms small and stable

Each uniform write costs CPU→GPU traffic. Fewer is better:

```tsx
// ❌ per-frame allocations create GC pressure
useFrame(({ clock, mouse }) => {
  material.uniforms.uTime.value = clock.elapsedTime;
  material.uniforms.uMouse.value = new THREE.Vector2(mouse.x, mouse.y);  // ← allocates
});

// ✅ mutate existing vector
useFrame(({ clock, mouse }) => {
  material.uniforms.uTime.value = clock.elapsedTime;
  material.uniforms.uMouse.value.set(mouse.x, mouse.y);
});
```

---

## Profiling

In dev:

```tsx
import { Stats } from "@react-three/drei";   // tree-shakeable
<Canvas>
  <Stats />     {/* FPS / MS panel — top-left by default */}
  ...
</Canvas>
```

Or for deeper inspection:

```bash
npm install --save-dev r3f-perf
```

```tsx
import { Perf } from "r3f-perf";
<Canvas>
  {process.env.NODE_ENV === "development" && <Perf position="bottom-right" />}
</Canvas>
```

Strip `r3f-perf` before shipping (or rely on the env check above).

---

## Bundle audit

```bash
npm run build
# Look at the .next/build output — Next reports first-load JS per route.
# / should stay under ~150KB excluding the dynamically-imported shader chunk.
```

To inspect the shader chunk:

```bash
npx @next/bundle-analyzer
```

If three.js + drei + postprocessing exceeds ~700KB gzipped, prune. Common culprits: `Environment` (drags in HDRIs), `Text3D` (font loaders), full `postprocessing` namespace import.
