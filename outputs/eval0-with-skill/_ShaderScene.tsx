// outputs/eval0-with-skill/_ShaderScene.tsx
//
// Fullscreen GLSL background — urban-night / city-glow / film-grain mood.
// Loaded only by ShaderCanvas via next/dynamic (ssr: false), so this file
// and all Three.js imports are client-only and never execute on the server.
//
// Visual goals preserved from BackgroundFX.tsx:
//   • Deep navy base (#08101e) with subtle warmer navy at bottom
//   • Accent purple aurora drifting with mouse parallax
//   • Warm cream/tungsten city-glow at the horizon
//   • Magenta glitch horizontal displacement bands (periodic, sparse)
//   • Film grain (per-frame, time-offset so it never repeats)
//   • Heavy vignette drawing the eye inward
//
// Uniforms:
//   uTime        — clock seconds (continuous)
//   uResolution  — physical pixel size (width × dpr, height × dpr)
//   uMouse       — normalized [-1, 1] on each axis, smoothed in GLSL
//
// Architecture:
//   _ShaderScene (default export) → <Canvas> → <ShaderPlane>
//   ShaderPlane lives inside Canvas so useFrame / useThree are legal.

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// GLSL — Fragment shader
// All utility functions are inlined to avoid a build-time ?raw import step.
// ─────────────────────────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;  // physical pixels
uniform vec2  uMouse;       // -1..1 per axis, R3F mouse coords

// ── Brand palette ─────────────────────────────────────────────
// Night-sky navy (base top / bottom)
const vec3 BASE_TOP    = vec3(0.031, 0.063, 0.118);  // #081020
const vec3 BASE_BOT    = vec3(0.051, 0.086, 0.157);  // #0d1628
// Purple accent (aurora, noise tint)
const vec3 COL_PURPLE  = vec3(0.690, 0.149, 1.000);  // #b026ff
// Hot magenta (glitch streaks)
const vec3 COL_MAGENTA = vec3(1.000, 0.165, 0.753);  // #ff2ac0
// Cream / tungsten warmth (city horizon glow)
const vec3 COL_CREAM   = vec3(0.957, 0.851, 0.651);  // #f4d9a6
// Cyan accent (subtle glitch fringe)
const vec3 COL_CYAN    = vec3(0.180, 1.000, 0.831);  // #2effd5

// ── Hash & noise ──────────────────────────────────────────────
// 2D → 2D hash (used by simplex)
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// 2D → 1D hash (cheap)
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 234.34));
  p += dot(p, p + 34.45);
  return fract(p.x * p.y);
}

// Simplex noise 2D — smooth organic base
float simplex2D(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h*h*h*h * vec3(dot(a, hash22(i)), dot(b, hash22(i+o)), dot(c, hash22(i+1.0)));
  return dot(n, vec3(70.0));
}

// Fractal Brownian Motion — 5 octaves, balanced quality / cost
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * simplex2D(p);
    p *= 2.02;   // avoids axis-aligned artifacts vs exact 2.0
    a *= 0.5;
  }
  return v;
}

// Domain-warped fbm — more organic aurora shape, ~2× cost of plain fbm
float fbmWarp(vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)),
                fbm(p + vec2(5.2, 1.3)));
  return fbm(p + 3.5 * q);
}

// ── Film grain ────────────────────────────────────────────────
// Per-pixel, per-frame — time offset prevents visible looping
float grain(vec2 uv, float t) {
  vec2 p = uv * vec2(1024.0, 1024.0) + vec2(t * 91.0, t * 53.0);
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// ── Scanlines ─────────────────────────────────────────────────
float scanlines(vec2 uv, float res_y, float intensity) {
  float y    = uv.y * res_y;
  float band = 0.5 + 0.5 * cos(y * 3.14159 * 0.5);
  return mix(1.0, band, intensity);
}

// ── Horizontal glitch band displacement ───────────────────────
// Returns a UV x-offset applied *only* to the glitch color contribution.
float glitchBandOffset(vec2 uv, float t) {
  // Fires ~every 6 s for a fraction of a second
  float trigger = step(0.97, fract(t * 0.18));
  float row     = step(0.62, fract(uv.y * 11.0 + t * 0.3));
  return trigger * row * 0.035;
}

// ── Vignette ──────────────────────────────────────────────────
float vignette(vec2 cuv, float radius, float softness) {
  return smoothstep(radius, radius - softness, length(cuv));
}

// ─────────────────────────────────────────────────────────────
void main() {
  // UV coords: 0–1 (uv) and centered [-aspect, aspect] (cuv)
  vec2 uv  = gl_FragCoord.xy / uResolution.xy;
  vec2 cuv = (gl_FragCoord.xy - 0.5 * uResolution)
             / min(uResolution.x, uResolution.y);

  // ── 1. Base night-sky vertical gradient ───────────────────
  vec3 col = mix(BASE_BOT, BASE_TOP, smoothstep(0.0, 1.0, uv.y));

  // ── 2. Low-freq drifting noise — purple cloud layer ───────
  // Slow drift so it reads as atmosphere, not animation
  vec2 noiseCoord = cuv * 1.4 + vec2(uTime * 0.022, uTime * 0.011);
  float cloudN = fbm(noiseCoord);
  col += COL_PURPLE * smoothstep(0.10, 0.75, cloudN) * 0.20;

  // ── 3. Domain-warped aurora — follows mouse ────────────────
  // uMouse is in R3F space (-1..1). Scale down so it's a gentle parallax.
  vec2 mouseShift = uMouse * 0.25;
  vec2 auroraCoord = cuv * 2.2 - mouseShift + vec2(uTime * 0.033, uTime * 0.018);
  float aurora = fbmWarp(auroraCoord);
  // Concentrate aurora in upper-center (where a city sky would glow)
  float auroraMask = smoothstep(0.0, 0.6, 1.0 - uv.y);  // fade out at bottom
  col += COL_PURPLE  * smoothstep(0.35, 0.80, aurora) * auroraMask * 0.22;
  col += COL_MAGENTA * smoothstep(0.55, 0.90, aurora) * auroraMask * 0.09;

  // ── 4. Cream / tungsten city-horizon glow ─────────────────
  // Warm light pooling in the bottom ~25 % of the screen
  float horizonGlow = smoothstep(0.30, 0.0, uv.y);
  col += COL_CREAM * horizonGlow * 0.09;
  // Add a subtle warm haze band right at the horizon line
  float horizonBand = exp(-abs(uv.y - 0.06) * 28.0);
  col += COL_CREAM * horizonBand * 0.12;

  // ── 5. Glitch horizontal displacement streaks ─────────────
  // Instead of real UV re-sampling (no texture), we paint a magenta / cyan
  // fringe in the displaced rows. This echoes the PixelGlitchBlocks from
  // BackgroundFX without needing a render texture.
  float gOffset = glitchBandOffset(uv, uTime);
  if (gOffset > 0.0) {
    // Slight cyan left shadow, magenta right highlight
    float cyanMix    = clamp(gOffset * 18.0, 0.0, 1.0);
    float magentaMix = clamp(gOffset * 14.0, 0.0, 1.0);
    col += COL_CYAN    * cyanMix    * 0.28;
    col += COL_MAGENTA * magentaMix * 0.22;
  }

  // ── 6. Scanlines (subtle — CRT texture overlay) ───────────
  col *= scanlines(uv, uResolution.y, 0.14);

  // ── 7. Film grain ─────────────────────────────────────────
  float g = grain(uv, uTime);
  col += (g - 0.5) * 0.10;   // center on 0 so grain darkens and brightens

  // ── 8. Vignette — heavy corners, open center ──────────────
  float vig = vignette(cuv, 0.88, 0.62);
  col *= mix(0.42, 1.0, vig);

  // ── 9. Clamp & output ─────────────────────────────────────
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Minimal passthrough vertex shader — ScreenQuad positions are already in NDC
const vertexShader = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// ShaderPlane — must live inside <Canvas> so useFrame / useThree are valid
// ─────────────────────────────────────────────────────────────────────────────
function ShaderPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { size, viewport } = useThree();

  // Uniforms object is stable; we mutate .value in useFrame — no re-alloc
  const uniforms = useMemo(
    () => ({
      uTime:       { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse:      { value: new THREE.Vector2(0, 0) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // intentionally empty: we update via mutation
  );

  useFrame(({ clock, mouse }) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    // R3F mouse is already -1..1 per axis
    u.uMouse.value.set(mouse.x, mouse.y);
    // Account for device pixel ratio so the resolution matches gl_FragCoord
    u.uResolution.value.set(
      size.width  * viewport.dpr,
      size.height * viewport.dpr,
    );
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — what next/dynamic loads in ShaderCanvas.tsx
// ─────────────────────────────────────────────────────────────────────────────
export default function _ShaderScene() {
  return (
    <Canvas
      frameloop="always"          // shader animates every frame
      dpr={[1, 1.75]}             // cap at 1.75 × DPR for mobile perf
      gl={{
        antialias: false,         // fullscreen quad needs no MSAA
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ShaderPlane />
    </Canvas>
  );
}
