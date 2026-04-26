---
name: shader-bg-fx
description: Build and maintain GLSL/Three.js shader-based background effects for this Next.js 16 + React 19 + @react-three/fiber v9 site (deployed on Cloudflare Workers via OpenNext). Use this skill whenever the user asks to add, replace, tweak, or debug a shader-driven background, full-screen plane visual, fragment shader, GLSL noise/glitch/grain effect, post-processing chain, Three.js Canvas wrapper, or anything in `BackgroundFX`. Also use when the user mentions "WebGL", "shader", "GLSL", "uniforms", "fbm", "simplex", "ChromaticAberration", "Bloom", "scanlines shader", "post-processing", or asks to migrate CSS/SVG background to a shader-driven one. The skill knows the site's stack constraints, Cloudflare Workers + OpenNext gotchas, hydration-safety rules, mobile performance targets, and contains drop-in snippets for the Canvas wrapper, shader BG component, GLSL utility chunks, and the post-processing chain.
---

# Shader Background FX — Site-Specific Build Guide

You are working on **mila-site** (Genomersive Studio): Next.js 16 (Turbopack) + React 19.2 + Tailwind v4 + Framer Motion 12, deployed to Cloudflare Workers via `@opennextjs/cloudflare`. The current `BackgroundFX.tsx` uses Framer Motion + SVG patterns + CSS noise for a urban-night/glitch atmosphere. This skill is for adding or migrating to **GLSL shader-driven backgrounds** without breaking SSR, hydration, or mobile performance.

## When you use this skill

1. **Read the relevant reference file first.** The body of this SKILL.md is a map. Don't try to remember everything — load the right reference before generating code.
2. **Check the site's existing visual language** in `src/components/BackgroundFX.tsx` and `src/app/globals.css`. The shader version should preserve the brand: dark navy (#08101e) base, accent purple (#b026ff), accent-hot magenta (#ff2ac0), accent-cream (#f4d9a6), accent-cyan (#2effd5). Keep the urban-night/glitch/chain-link/film-grain mood.
3. **Always isolate the Canvas behind `next/dynamic` with `ssr: false`.** This is non-negotiable on this stack — see `references/hydration-safety.md`.

## Pick the right reference

| If you're doing… | Read |
|---|---|
| First-time install of three / R3F / drei / postprocessing | `references/setup.md` |
| Wrapping a Canvas, mounting from a server component | `references/hydration-safety.md` |
| Worrying about FPS on phones, bundle size, drei imports | `references/performance.md` |
| Anything Cloudflare Workers / OpenNext-specific | `references/cloudflare-workers.md` |
| Chaining Bloom/Glitch/ChromaticAberration | `references/post-processing.md` |
| Shipping the change | `references/pre-deploy-checklist.md` |

## Pick the right snippet

| If you need… | Copy from |
|---|---|
| The Canvas wrapper with dynamic-import + Suspense | `snippets/canvas-wrapper.tsx` |
| A shader fullscreen-plane background with time/mouse/resolution uniforms | `snippets/shader-background.tsx` |
| GLSL noise (hash, value, simplex2D, fbm) | `snippets/glsl/noise.glsl` |
| GLSL film grain function | `snippets/glsl/grain.glsl` |
| GLSL RGB split / scanlines / glitch displacement | `snippets/glsl/glitch.glsl` |
| Post-processing chain (Bloom + ChromaticAberration + Noise) | `snippets/post-processing.tsx` |

These are starting points, not finished art. Always trim them to the exact uniforms / functions used — every byte counts in the GLSL string because it ships in the JS bundle.

## Versions to pin (verified compatible 2026-04)

```
"three": "^0.180",
"@react-three/fiber": "^9.0",
"@react-three/drei": "^10.0",
"@react-three/postprocessing": "^3.0"
```

⚠️ Do **not** install `@react-three/fiber` v8 — it doesn't support React 19. Verify with `npm ls @react-three/fiber` after install.

## Hard rules for this codebase

- The Canvas component **must** be imported via `next/dynamic({ ssr: false })`. The OpenNext Worker doesn't render WebGL on the server, and any non-deterministic value (Math.random, Date.now) in initial render breaks hydration. Details in `references/hydration-safety.md`.
- Never touch DOM directly during render — use `useFrame` (per-frame) or `useEffect` (once on mount).
- `frameloop="demand"` if the scene is static, `"always"` only when something is genuinely animating every frame. The current `BackgroundFX` runs continuously, so a shader replacement likely needs `"always"` — but reconsider if you can pause when off-screen.
- Respect `prefers-reduced-motion`: gate animation in `useFrame` against `useReducedMotion()` from framer-motion (already a dep).
- Keep total client JS payload under **4MB**. Shaders cost almost nothing; drei imports are the trap (always import individual components, never `import * from drei`).
- The shader BG must keep **z-index 0** with `pointer-events: none`. Vignette and edge masking belong in the shader, not as separate DOM layers.

## Workflow when adding a new shader background

1. Skim `BackgroundFX.tsx` and the page's existing layers — confirm what visual you're replacing or augmenting.
2. Install missing deps (see `references/setup.md`). Pin versions.
3. Drop in `snippets/canvas-wrapper.tsx` as `ShaderCanvas` and `snippets/shader-background.tsx` as `ShaderBackground`. Wire `<ShaderCanvas />` into `layout.tsx` (replacing or alongside `<BackgroundFX />`).
4. Compose the fragment shader from the GLSL utility chunks. Keep uniforms minimal (`uTime`, `uResolution`, `uMouse`, plus brand colors).
5. Profile on a real phone or DevTools mobile throttling — target ≥45 FPS, p95 ≤ 22ms frame time.
6. Run the `references/pre-deploy-checklist.md` before pushing.
7. Build + deploy with `npm run build:cf && npx wrangler deploy` (the project's manual deploy flow — there is no auto-deploy CI on this repo).

## When in doubt

- If you can express the same look with the existing CSS/SVG layers cheaper, **do that** — shaders are not automatically better. The current `BackgroundFX` is intentionally mobile-friendly; only replace it if the new look genuinely benefits from shader math (continuous gradients, fluid noise, displacement, real-time post-processing).
- If hydration errors appear after wiring up the Canvas, the cause is almost always (a) forgot `ssr: false` on dynamic, (b) computed something with `Math.random` / `Date.now` in initial JSX, or (c) `useThree`/`useFrame` called outside Canvas. Check those three first.
