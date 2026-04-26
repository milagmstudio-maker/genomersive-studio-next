# Post-Processing Chain — Bloom, Glitch, Noise, ChromaticAberration

`@react-three/postprocessing` lets you stack screen-space effects on top of the scene render. For a background-only Canvas the savings are real — most "glitch" looks are cheaper as a postprocess than as fragment-shader logic on every plane.

## The available effects (most useful first)

| Effect | What it does | Cost |
|---|---|---|
| `Bloom` | Soft glow on bright pixels — perfect for the site's purple accents | High |
| `ChromaticAberration` | RGB channel offset around screen edges | Low |
| `Glitch` | Periodic horizontal displacement bands | Low (intermittent) |
| `Noise` | Animated film grain over the final image | Very low |
| `Scanline` | CRT scan band overlay | Very low |
| `Vignette` | Darken edges | Negligible |
| `DotScreen` | Halftone dot pattern | Low |
| `Pixelation` | Reduce resolution for chunky look | Low |

`Bloom` is the expensive one — it does multiple downsample/upsample passes. Use `resolutionScale={0.5}` to halve the work.

## Minimal chain example

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { ShaderBackground } from "./ShaderBackground";

export default function Scene() {
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: false, alpha: true }}>
      <ShaderBackground />

      <EffectComposer multisampling={0} resolutionScale={0.5}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ChromaticAberration offset={[0.001, 0.0015]} radialModulation modulationOffset={0.5} />
        <Noise opacity={0.18} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
```

Note `gl={{ antialias: false }}` — when post-processing is on, MSAA is wasted; the EffectComposer does its own AA pass.

## Brand-specific tuning for this site

The mila-site palette has high saturation (deep navy + neon purple/magenta + cyan punch). The temptation is to crank Bloom to 11. Resist:

- `Bloom intensity` between **0.4 and 0.8** for the moody effect; above 1 it goes EDM-music-video.
- `ChromaticAberration offset` ≤ **0.002** — anything more and text becomes unreadable when overlaid.
- `Noise opacity` between **0.12 and 0.22**. The site already has CSS `.bg-noise::after` grain at opacity 0.85 with a coarser `dust-grain` layer; **disable both** if you bring noise into the shader chain to avoid double-grain.

## Toggling effects from a config object

Useful when iterating:

```tsx
const FX = {
  bloom: true,
  chroma: true,
  noise: true,
  vignette: true,
  glitch: false,        // expensive perception-wise; reserve for transitions
} as const;

<EffectComposer multisampling={0} resolutionScale={0.5}>
  {FX.bloom && <Bloom intensity={0.6} luminanceThreshold={0.4} mipmapBlur />}
  {FX.chroma && <ChromaticAberration offset={[0.0015, 0.0015]} />}
  {FX.glitch && <Glitch delay={[3, 8]} duration={[0.05, 0.2]} strength={[0.1, 0.3]} />}
  {FX.noise && <Noise opacity={0.18} />}
  {FX.vignette && <Vignette offset={0.15} darkness={0.85} />}
</EffectComposer>
```

## When NOT to use post-processing

- If you're doing a **single shader** that paints the whole screen, the cheapest path is to bake grain/scanlines/vignette **into the fragment shader directly** (see `snippets/glsl/grain.glsl`, `glitch.glsl`). PP runs full-screen passes; the fragment shader already runs full-screen. Don't pay twice.
- For **mobile**, prefer fragment-shader-baked effects over a long PP chain. PP allocates render targets, which is GPU memory.
- If the only effect you need is `Vignette`, just multiply by a `smoothstep` of `length(uv - 0.5)` in the shader. Saves 1 pass.

## Rule of thumb

If your chain is `Bloom + Vignette` only, keep PP. If it's `Bloom + ChromaticAberration + Glitch + Noise + Vignette`, fold the cheap ones (CA, Noise, Vignette) into the fragment shader and keep PP just for Bloom.
