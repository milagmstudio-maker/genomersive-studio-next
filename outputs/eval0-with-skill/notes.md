# Shader Background Replacement — Approach Notes

## What this replaces

`src/components/BackgroundFX.tsx` — a Framer Motion + SVG + CSS component
that layered city lights, light streaks, a chain-link fence SVG pattern,
glitch pixel blocks, a hooded silhouette SVG, and a vignette div.

The shader version collapses all of those into a single fullscreen fragment
shader pass with no DOM elements beyond a `<canvas>`.

---

## File structure

```
outputs/eval0-with-skill/
├── ShaderCanvas.tsx      ← thin "use client" wrapper; next/dynamic ssr:false
├── _ShaderScene.tsx      ← actual Three.js / R3F scene (Canvas + ScreenQuad)
├── package-deps.patch    ← deps to add + install command
└── notes.md              ← this file
```

To drop these into the real project:
1. Copy both `.tsx` files into `src/components/`.
2. In `src/app/layout.tsx`, replace `<BackgroundFX />` with `<ShaderCanvas />`.
3. Install deps per `package-deps.patch`.

---

## Architecture decisions

### ShaderCanvas / _ShaderScene split (hydration safety)

Cloudflare Workers runs the Next.js SSR pass. WebGL doesn't exist on the
server. The split follows the skill's Rule 1:

- `ShaderCanvas.tsx` is a tiny `"use client"` file — it carries `next/dynamic`
  with `ssr: false`. This is the only import `layout.tsx` (a Server Component)
  needs to know about.
- `_ShaderScene.tsx` contains all Three.js / R3F code. It is never executed
  during SSR; next/dynamic defers it entirely to the client.

The leading underscore on `_ShaderScene` is a visual signal that this file
should not be imported directly (only through ShaderCanvas's dynamic call).

### ScreenQuad instead of a mesh + PlaneGeometry

`@react-three/drei`'s `<ScreenQuad>` renders a single large triangle that
covers the viewport in NDC space — no camera, no projection matrix, no scene
graph traversal. This is the standard approach for fullscreen post-processing
shaders and saves a small amount of GPU overhead vs a camera-projected plane.

### Uniforms updated by mutation in useFrame

The uniforms object is created once with `useMemo([], [])`. Each frame,
`useFrame` mutates `.value` in-place — no React state, no re-renders, no
garbage collection pressure. This is the standard R3F pattern for
per-frame data.

---

## Visual language preserved from BackgroundFX

| Original layer | Shader equivalent |
|---|---|
| Deep navy base (`#08101e`) | `BASE_TOP` / `BASE_BOT` vertical gradient |
| Purple aurora (soft radial div) | `fbmWarp()` aurora layer, mouse-parallax via `uMouse` |
| Cream city-glow horizon | `horizonGlow` + `horizonBand` terms |
| Glitch pixel blocks (magenta/cyan) | `glitchBandOffset()` — sparse horizontal fringe |
| Chain-link fence SVG | Not reproduced — would need a procedural diamond pattern; the grain + noise carries enough texture. Add if needed. |
| Film grain (CSS) | `grain()` function, intensity 0.10, per-frame time offset |
| Edge vignette (radial-gradient div) | `vignette()` with 0.42 dark corners |
| Hooded silhouette SVG | Not reproduced — too illustrative for a procedural shader. Keep the original SVG layer if the silhouette is important to the brand. |

### Brand palette used in shader

```
#08101e  → BASE_TOP    (night sky top — slightly lighter than original for
                        room to add the purple without washing out)
#0d1628  → BASE_BOT    (bottom of sky)
#b026ff  → COL_PURPLE  (aurora, cloud tint)
#ff2ac0  → COL_MAGENTA (glitch fringe, aurora edge)
#f4d9a6  → COL_CREAM   (city horizon warmth)
#2effd5  → COL_CYAN    (glitch left-shadow fringe)
```

---

## Performance notes

- `dpr={[1, 1.75]}` — caps pixel ratio at 1.75×. On a 3× screen this halves
  fragment invocations vs native DPR with no visible quality loss on a
  fullscreen noise shader.
- `antialias: false` — no MSAA needed; the shader output is smooth noise.
- `frameloop="always"` — required because `uTime` drives the animation every
  frame. Consider `frameloop="demand"` + manual `invalidate()` if you add a
  pause-when-invisible optimization (Intersection Observer).
- `fbm()` uses 5 octaves. Drop to 3 if mobile frame time exceeds 22 ms
  (measure with DevTools CPU throttling at 4× slowdown).
- `fbmWarp()` for the aurora is the most expensive call (~2× fbm). Swap to
  plain `fbm()` for the aurora layer on mobile if needed.

---

## What's not included (and why)

- **`@react-three/postprocessing`** — not added. The grain, vignette, and
  scanlines are cheaper to implement in the fragment shader than to run a
  full post-processing chain. Add the dep only if you want Bloom or
  ChromaticAberration as a separate pass.
- **`prefers-reduced-motion` gate** — add this inside `useFrame` if you want
  to pause the clock when the user prefers reduced motion:
  ```ts
  import { useReducedMotion } from "framer-motion";
  // inside ShaderPlane:
  const reduced = useReducedMotion();
  useFrame(({ clock, mouse }) => {
    if (reduced) return;
    // ... uniform updates
  });
  ```
- **Chainlink fence pattern** — the original SVG diamond grid is a brand
  motif. If you want to keep it, layer the existing `<ChainlinkFull />` SVG
  component as a DOM sibling above `<ShaderCanvas />` (it's pointer-events-none
  already). That's cheaper than re-implementing it in GLSL.
- **Hooded silhouette** — same reasoning; keep as a DOM layer if needed.
