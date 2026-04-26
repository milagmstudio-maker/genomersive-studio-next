# Setup — install deps and wire the Canvas in

## Install

From the project root (`mila-site/`):

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

Verify React 19 compatibility:

```bash
npm ls @react-three/fiber
# Must report v9.x.x — v8 will silently break with React 19
```

If `@react-three/fiber` is v8, force install v9:

```bash
npm install @react-three/fiber@^9
```

## Where things live in this project

```
src/
├── app/
│   ├── layout.tsx          ← global wrappers (BackgroundFX, GlitchOverlay, etc.)
│   └── globals.css         ← grain + scanlines CSS
├── components/
│   ├── BackgroundFX.tsx    ← current Framer Motion-based bg (the thing you may replace)
│   ├── GlitchOverlay.tsx   ← scanlines + dust-grain DOM overlays
│   └── (new) ShaderCanvas.tsx
│   └── (new) ShaderBackground.tsx
```

A shader BG replaces `<BackgroundFX />` and likely also subsumes some of `<GlitchOverlay />` (scanlines/grain become part of the fragment shader).

## Mounting from layout.tsx

The project's `layout.tsx` is a Server Component. Client components can be rendered from it without issue, but they need to be imported as components, not inline. The pattern:

```tsx
// src/app/layout.tsx (Server Component)
import { ShaderCanvas } from "@/components/ShaderCanvas";

// ...inside body:
<ShaderCanvas />     {/* This file internally uses next/dynamic with ssr:false */}
```

`ShaderCanvas` itself must be a client wrapper that lazy-loads the actual Three.js code. See `snippets/canvas-wrapper.tsx`.

## Quick sanity check after wiring

```bash
npm run dev
# Open http://localhost:3000
# 1. Open DevTools console — must be free of hydration errors
# 2. Network tab — confirm three.js bundle loads only on client (no SSR HTML containing <canvas>)
# 3. Resize the window — shader should respond if uResolution is wired correctly
```

If you see "Hydration failed because the server rendered HTML didn't match the client", jump to `references/hydration-safety.md`.
