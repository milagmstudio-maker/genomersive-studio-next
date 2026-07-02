"use client";

/**
 * PostProcessingEffects
 *
 * Readability tradeoffs explained in answer.md — short version:
 *  - Bloom runs at luminanceThreshold 0.75 so only the neon-bright brand pixels
 *    (#b026ff, #ff2ac0 at full opacity) exceed the threshold and glow. Body text
 *    rendered in white/light-gray on the dark navy background stays below the
 *    threshold and is never bloomed.
 *  - ChromaticAberration uses a very small offset (0.0008) + radialModulation so
 *    the aberration grows toward screen edges and stays near-zero at the center
 *    where titles and body copy live. This gives a CRT-lens aesthetic without
 *    splitting letterforms.
 *  - Vignette darkens corners slightly, which focuses attention on center content
 *    and counteracts the bloom haze at the edges.
 *  - Noise at low opacity adds film grain to prevent banding in the dark bg.
 */

import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

export function PostProcessingEffects() {
  return (
    <EffectComposer>
      {/*
       * 1. BLOOM
       * intensity: 0.6 — subtle enough that non-neon elements don't wash out.
       * luminanceThreshold: 0.75 — only pixels whose luminance exceeds 75% white
       *   will bloom. Brand purple/magenta at full opacity hit ~0.3–0.5 luminance,
       *   so this threshold is intentionally set to catch only explicit neon/emissive
       *   materials in the Three.js scene (e.g., point lights coloured #b026ff,
       *   MeshStandardMaterial with emissive set high). It will NOT bloom regular
       *   white UI text, which sits at luminance ~1 but is rendered via HTML/CSS
       *   outside the Canvas — those layers are unaffected by EffectComposer.
       * luminanceSmoothing: 0.025 — sharp edge on the bloom gate to minimise spill.
       * mipmapBlur: true — higher-quality blur from @react-three/postprocessing v3+.
       * levels: 6 — enough octaves for a cinematic halo without performance hit.
       */}
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.75}
        luminanceSmoothing={0.025}
        mipmapBlur
        levels={6}
      />

      {/*
       * 2. CHROMATIC ABERRATION
       * offset: small Vector2 — 0.0008 in both axes is barely perceptible at
       *   centre and grows to ~0.0008 * radial factor at corners.
       * radialModulation: true — the aberration is multiplied by the fragment's
       *   distance from screen centre, so text/logos near centre are sharp while
       *   edges get the colour-split effect. This is the key readability guard.
       * modulationOffset: 0.15 — starts the modulation ramp a little inside the
       *   edge so the effect is confined to the outer 85% of the radius.
       *
       * Order matters: CA comes AFTER Bloom so the bloom halos also get
       * the subtle colour-split, matching how real-world lenses behave.
       */}
      <ChromaticAberration
        offset={new Vector2(0.0008, 0.0008)}
        radialModulation
        modulationOffset={0.15}
      />

      {/*
       * 3. VIGNETTE (optional but recommended)
       * Darkens screen corners, counteracting bloom haze at the periphery and
       * drawing the viewer's eye to centre content. Darkness 0.5 keeps it
       * cinematic rather than oppressive.
       */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />

      {/*
       * 4. NOISE (optional)
       * Very low opacity film grain prevents colour banding on the dark #08101e
       * background and gives a slight analog warmth to the scene.
       */}
      <Noise
        opacity={0.04}
        blendFunction={BlendFunction.ADD}
      />
    </EffectComposer>
  );
}

/**
 * Usage — drop <PostProcessingEffects /> inside your <Canvas>:
 *
 * import { Canvas } from "@react-three/fiber";
 * import { PostProcessingEffects } from "./post-processing-setup";
 *
 * export default function Scene() {
 *   return (
 *     <Canvas>
 *       <YourSceneContent />
 *       <PostProcessingEffects />
 *     </Canvas>
 *   );
 * }
 *
 * Make sure your neon brand elements in the Three.js scene have emissive
 * intensity set high enough to exceed the luminanceThreshold, for example:
 *
 *   <meshStandardMaterial
 *     color="#b026ff"
 *     emissive="#b026ff"
 *     emissiveIntensity={2.5}   // pushes luminance above 0.75 threshold
 *   />
 *
 * HTML/CSS content rendered outside the Canvas is never processed by
 * EffectComposer and retains full legibility regardless of these settings.
 */
