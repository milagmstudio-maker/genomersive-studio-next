// post-processing-setup.tsx
//
// EffectComposer chain for mila-site brand glow effect.
//
// READABILITY TRADEOFFS (see answer.md for full explanation):
//
// Bloom:
//   luminanceThreshold={0.8} means only pixels brighter than 80% of full
//   white will bloom. The brand purples (#b026ff, #ff2ac0) when rendered as
//   neon/lit elements exceed this threshold; body text (rendered on the dark
//   navy #08101e background) stays well below it and is NOT affected by bloom.
//   This protects readability while letting the accent colors glow.
//
// ChromaticAberration:
//   radialModulation + modulationOffset={0.75} means the RGB offset is
//   strongest at screen edges and approaches zero at the center — where
//   most headings and body copy live. Offset is capped at 0.001 (1/1000th
//   of screen width, ~1-2px on a 1440p display), which is perceptible as
//   a subtle fringe on edge elements but does not degrade center legibility.

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
import { useReducedMotion } from "framer-motion";
import { Vector2 } from "three";

// ---------------------------------------------------------------------------
// ShaderBackground placeholder — swap this import for the actual component
// once wired into the project (e.g. from snippets/shader-background.tsx).
// ---------------------------------------------------------------------------
import { ShaderPlane } from "../ShaderBackground";

// ---------------------------------------------------------------------------
// Main branded scene with full PP chain
// ---------------------------------------------------------------------------

export default function BrandedScene() {
  const prefersReducedMotion = useReducedMotion();

  return prefersReducedMotion ? <BrandedSceneCalm /> : <BrandedSceneFull />;
}

// ---------------------------------------------------------------------------
// Full animated PP chain (default for users without reduced-motion preference)
// ---------------------------------------------------------------------------

function BrandedSceneFull() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: false,           // EffectComposer handles AA; MSAA is wasted here
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Scene geometry — replace with actual ShaderBackground or mesh */}
      <ShaderPlane />

      {/*
       * EffectComposer order: Bloom → ChromaticAberration → Noise → Vignette
       *
       * Bloom runs first so it sees the raw HDR scene values, not yet
       * color-shifted by CA. CA runs second so the fringe effect sits on
       * top of the already-bloomed glow. Noise and Vignette are cosmetic
       * finishing passes and order between them is aesthetic preference.
       *
       * multisampling={0}   — disables MSAA on the PP targets (we do our own)
       * resolutionScale={0.5} — Bloom downsamples to half-res internally;
       *                         the blur is wide enough that half-res is fine
       *                         and saves ~25% GPU time on mobile.
       */}
      <EffectComposer multisampling={0} resolutionScale={0.5}>

        {/*
         * BLOOM
         * intensity={0.6}          — moderate glow; above 1.0 becomes garish
         * luminanceThreshold={0.8} — only pixels brighter than 80% bloom.
         *                            Neon brand colors (#b026ff, #ff2ac0) when
         *                            drawn as lit/emissive elements exceed this.
         *                            Body text on dark navy (#08101e) does not —
         *                            protecting readability.
         * luminanceSmoothing={0.1} — tight feathering; keeps the bloom crisp
         *                            rather than bleeding broadly into text areas.
         * mipmapBlur              — cheaper, higher-quality glow spread using
         *                            mip hierarchy instead of multiple passes.
         */}
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.1}
          mipmapBlur
        />

        {/*
         * CHROMATIC ABERRATION
         * offset ≤ [0.001, 0.001]  — 1/1000th of screen width (~1-2px at 1440p).
         *                            Visible as color fringe on bright edge elements
         *                            but sub-perceptible at center of screen.
         * radialModulation         — the offset scales from 0 at screen center
         *                            to full value at screen edges. Center text
         *                            (headings, body copy) receives near-zero shift.
         * modulationOffset={0.75}  — pushes the "zero-shift" zone wider, keeping
         *                            ~75% of the central area fully sharp.
         */}
        <ChromaticAberration
          offset={new Vector2(0.001, 0.001)}
          radialModulation
          modulationOffset={0.75}
        />

        {/*
         * NOISE (film grain)
         * opacity={0.16}           — light grain; reinforces the urban-night mood.
         * blendFunction=OVERLAY    — perceptual blend that adds grain without
         *                            uniformly darkening or brightening the image.
         *
         * NOTE: if the project's CSS already applies .bg-noise::after grain
         * (globals.css), disable that layer to avoid double-grain. The shader
         * chain grain is more controllable than the CSS texture approach.
         */}
        <Noise opacity={0.16} blendFunction={BlendFunction.OVERLAY} />

        {/*
         * VIGNETTE
         * Darkens screen edges, drawing focus to the center where content lives.
         * This complements radialModulation on CA — both effects concentrate
         * attention (and visual clarity) in the center of the viewport.
         * offset={0.15} / darkness={0.8} — subtle; don't let vignette eat
         * into the readable text margin.
         */}
        <Vignette eskil={false} offset={0.15} darkness={0.8} />

      </EffectComposer>
    </Canvas>
  );
}

// ---------------------------------------------------------------------------
// Calm variant for prefers-reduced-motion users
// Strips animated glow and chromatic shift; keeps a static render.
// ---------------------------------------------------------------------------

export function BrandedSceneCalm() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false }}
      frameloop="demand"            // renders once, then idles — zero battery drain
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ShaderPlane />
      {/* No EffectComposer — static background only */}
    </Canvas>
  );
}
