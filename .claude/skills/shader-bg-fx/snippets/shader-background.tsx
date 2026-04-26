// src/components/ShaderBackground.tsx
//
// Fullscreen shader background. Uses drei's <ScreenQuad> to draw a single
// triangle covering the viewport — no projection math, no scene graph.
// Uniforms updated per frame: uTime, uResolution, uMouse.
//
// Compose your fragment shader by inlining GLSL chunks from snippets/glsl/*.
// The version below is a worked example combining noise + grain + vignette
// + brand-tinted gradient. Tune to taste; remove what you don't need —
// every byte of GLSL ships in the JS bundle.

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ────────────────────────────────────────────────────────────
// Fragment shader (inlined; consider build-time ?raw imports
// if it grows past ~200 lines)
// ────────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;          // -1..1 on each axis

  // Brand palette
  const vec3 NIGHT_TOP    = vec3(0.020, 0.039, 0.086);  // #050a16
  const vec3 NIGHT_BOTTOM = vec3(0.055, 0.102, 0.188);  // #0e1a30
  const vec3 ACCENT       = vec3(0.690, 0.149, 1.000);  // #b026ff
  const vec3 ACCENT_HOT   = vec3(1.000, 0.165, 0.753);  // #ff2ac0
  const vec3 ACCENT_CREAM = vec3(0.957, 0.851, 0.651);  // #f4d9a6

  // ─── Hash & noise ────────────────────────────────────────
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float simplex2D(vec2 p) {
    const float K1 = 0.366025404;  // (sqrt(3)-1)/2
    const float K2 = 0.211324865;  // (3-sqrt(3))/6
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(
      dot(a, hash22(i)),
      dot(b, hash22(i + o)),
      dot(c, hash22(i + 1.0))
    );
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * simplex2D(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  // ─── Film grain ─────────────────────────────────────────
  float grain(vec2 uv, float t) {
    return fract(sin(dot(uv * 1000.0 + t, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv  = gl_FragCoord.xy / uResolution.xy;
    vec2 cuv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    // Base vertical gradient (night sky)
    vec3 col = mix(NIGHT_BOTTOM, NIGHT_TOP, smoothstep(0.0, 1.0, uv.y));

    // Drifting low-frequency noise tinted with accent purple
    float n = fbm(cuv * 1.6 + vec2(uTime * 0.03, uTime * 0.015));
    col += ACCENT * smoothstep(0.2, 0.8, n) * 0.18;

    // Subtle aurora following the mouse
    vec2 mouseOffset = uMouse * 0.3;
    float aurora = fbm(cuv * 2.5 - mouseOffset + uTime * 0.04);
    col += ACCENT_HOT * smoothstep(0.5, 0.9, aurora) * 0.10;

    // Cream warmth at the horizon (city glow)
    float horizon = smoothstep(0.18, 0.0, uv.y);
    col += ACCENT_CREAM * horizon * 0.08;

    // Film grain
    float g = grain(uv, uTime);
    col += (g - 0.5) * 0.08;

    // Vignette
    float vig = smoothstep(1.1, 0.45, length(cuv));
    col *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const vertexShader = /* glsl */ `
  void main() {
    // ScreenQuad already sets gl_Position; just pass through.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// ────────────────────────────────────────────────────────────
// Material — cached so material is created once
// ────────────────────────────────────────────────────────────
function ShaderPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    // size intentionally omitted — we mutate uResolution.value below
    []
  );

  useFrame(({ clock, mouse }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
    // Update resolution if it changed (cheap; no allocation)
    matRef.current.uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
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

// ────────────────────────────────────────────────────────────
// Default export = the Scene next/dynamic loads
// ────────────────────────────────────────────────────────────
export default function ShaderBackground() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ShaderPlane />
    </Canvas>
  );
}
