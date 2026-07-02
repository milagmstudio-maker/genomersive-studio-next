# Shader-based BackgroundFX — approach notes

## Goal

Replace the Framer Motion + SVG + CSS-noise stack with a single fullscreen
WebGL shader that reproduces the visual identity of the original:

- Night-sky navy base (#0a0d1a)
- Purple aurora accent (#b026ff)
- Cream city-warmth glow (#f4d9a6)
- Film grain / photographic roughness
- Chain-link fence motif (very faint)
- Flickering city light points at the horizon
- Smooth mouse parallax

## File map

```
outputs/eval0-no-skill/
├── ShaderCanvas.tsx        ← drop-in <BackgroundFX /> replacement (z-0, pointer-events-none, fixed)
├── _ShaderScene.tsx        ← Three.js Canvas + ScreenQuad + uniforms + shader inline
├── nightsky.frag.glsl      ← standalone copy of the fragment shader (for reference / editing in a GLSL IDE)
├── package-deps.patch      ← unified diff for package.json additions
└── notes.md                ← this file
```

## Architecture

### ShaderCanvas (wrapper)

Uses `next/dynamic` with `ssr: false` to ensure Three.js never executes in the
Cloudflare Workers runtime (no WebGL available server-side). The outer `<div>`
preserves the exact layout contract from the original component:

```tsx
<div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
  <ShaderScene />   {/* dynamic, client-only */}
</div>
```

### _ShaderScene (scene)

`@react-three/fiber` Canvas wraps a single `<ScreenQuad>` (from `@react-three/drei`).
ScreenQuad is a clip-space triangle that exactly covers the viewport without a
projection matrix — ideal for fullscreen fragment shaders.

Three uniforms are updated every frame via `useFrame`:

| Uniform       | Type    | Update cadence |
|---------------|---------|----------------|
| `uTime`       | float   | every frame (`+= delta`) |
| `uMouse`      | vec2    | every frame (exponential smoothing, τ ≈ 0.12 s) |
| `uResolution` | vec2    | on canvas resize (device pixels) |

Mouse smoothing uses `1 - exp(-delta / τ)` lerp which is frame-rate independent
and matches the feel of the original Framer Motion spring (stiffness 50, damping 18).

### Fragment shader technique

1. **Domain-warped fBm** — two levels of warp applied to 6-octave gradient
   noise. This produces the viscous, slowly-flowing aurora cloud without any
   branching. The warp speed is kept very low (0.015–0.04 time multiplier) to
   feel like a real long-exposure sky.

2. **Night palette** — four-stop gradient (navy → deep violet → purple → cream)
   sampled by the warped noise value, keeping the majority of the sky in the
   dark/mid range (`palT = warp * 0.55`).

3. **Aurora veil** — a second, slightly faster warp pass blended additively at
   30% opacity, restricted to the upper half of the screen, with a
   purple/pink mix driven by the base warp value.

4. **City horizon glow** — a simple `smoothstep` on UV.y fades warm cream
   colour into the bottom 25% of the frame, simulating the aggregate light
   pollution of the city.

5. **City light points** — 40 pseudo-random analytic point lights (no texture).
   Each is rendered as `sz² / (d² + sz²)` (a Lorentzian falloff) with a
   sinusoidal flicker. They live in the bottom 20% of UV space.

6. **Chain-link fence** — a rotated (45°) GLSL grid computed from `fract()`.
   `min(|cell.x|, |cell.y|)` gives distance to the nearest grid edge; a
   `smoothstep` threshold draws the wire at 10% opacity, faded by a radial
   gradient toward the edges.

7. **Film grain** — a per-frame high-frequency hash (`sin`-based) subtracted
   from a time-varying seed. Additive with ±2.25% swing — perceptually similar
   to photographic ISO noise.

8. **Edge vignette** — aspect-corrected radial darkening, same formula as the
   original CSS `radial-gradient`.

## How to integrate

1. Install new deps:
   ```bash
   npm install three @react-three/fiber @react-three/drei
   npm install -D @types/three
   ```

2. Copy `ShaderCanvas.tsx` and `_ShaderScene.tsx` into `src/components/`.

3. In your layout / page, swap:
   ```tsx
   // Before
   import { BackgroundFX } from "@/components/BackgroundFX";
   <BackgroundFX />

   // After
   import { ShaderCanvas } from "@/components/ShaderCanvas";
   <ShaderCanvas />
   ```

4. The original `BackgroundFX.tsx` can be kept or deleted — there are no
   shared exports between them.

## Performance notes

- `dpr={[1, 2]}` caps the canvas at 2× for retina without running at 3× on
  high-density displays.
- `antialias: false` — unnecessary for a fullscreen quad.
- The 40-point city-lights loop and 6-octave fBm are the heaviest parts. On
  a mid-range GPU both run comfortably at 60 fps. If performance is a concern,
  reduce the fBm octave count from 6 → 4 or the city light count from 40 → 20.
- Cloudflare Workers SSR: Three.js is in the dynamic chunk (ssr:false), so it
  never touches the server bundle. The outer `<div>` shell is server-rendered
  as a plain empty container.

## Preserved from original

| Property | Value |
|---|---|
| `position` | `fixed` |
| `inset` | `0` |
| `z-index` | `z-0` |
| `pointer-events` | `none` |
| `overflow` | `hidden` |
| `aria-hidden` | `true` |
