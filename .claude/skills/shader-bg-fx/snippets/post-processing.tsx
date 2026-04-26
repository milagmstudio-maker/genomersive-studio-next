// post-processing.tsx — example PP chain wrapping ShaderBackground
//
// Use this if you want a Bloom glow on the brand purple beyond what the
// shader can do directly. For purely procedural shaders, prefer baking
// everything into the fragment shader — see references/post-processing.md
// for the rule of thumb.
//
// This file replaces ShaderBackground.tsx's default export. ShaderPlane
// itself is unchanged.

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
import { ShaderPlane } from "./ShaderBackground";  // re-export ShaderPlane from ShaderBackground

export default function ShaderBackgroundWithPP() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: false,         // EffectComposer does its own AA
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ShaderPlane />

      <EffectComposer multisampling={0} resolutionScale={0.5}>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ChromaticAberration
          offset={[0.0012, 0.0018]}
          radialModulation
          modulationOffset={0.5}
        />
        <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.18} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}

// ────────────────────────────────────────────────────────────
// Reduced-motion variant — strips animated effects so the page
// is calmer for users who've requested it. Wire this in via:
//
//   const prefersReduce = useReducedMotion();
//   return prefersReduce ? <ShaderBackgroundCalm /> : <ShaderBackgroundWithPP />;
// ────────────────────────────────────────────────────────────

export function ShaderBackgroundCalm() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false }}
      frameloop="demand"          // render once, then idle
      style={{ position: "absolute", inset: 0 }}
    >
      <ShaderPlane />
    </Canvas>
  );
}
