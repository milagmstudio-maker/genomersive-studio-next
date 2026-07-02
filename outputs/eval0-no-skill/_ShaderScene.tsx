"use client";

/**
 * _ShaderScene.tsx
 *
 * Inner scene component rendered only on the client (via ShaderCanvas → next/dynamic).
 * Uses @react-three/fiber Canvas + a fullscreen ScreenQuad (drei) driving our
 * night-sky GLSL fragment shader.
 *
 * Uniforms:
 *   uTime        — elapsed seconds (via useFrame)
 *   uMouse       — smoothed cursor position, normalized [0,1]
 *   uResolution  — canvas size in device pixels
 */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";

// ── Inline GLSL ─────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uMouse;
uniform vec2  uResolution;

varying vec2 vUv;

// ── Hash / noise ─────────────────────────────────────────────────────────────

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Gradient noise (Perlin-style)
float gnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
        dot(hash2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
        dot(hash2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x),
    u.y
  );
}

// fBm — 6 octaves
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2  shift = vec2(100.0);
  mat2  rot   = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 6; i++) {
    v += a * gnoise(p);
    p  = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

// Domain-warped fBm
float warpedFbm(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.04),
    fbm(p + vec2(5.2, 1.3) + t * 0.03)
  );
  vec2 r = vec2(
    fbm(p + 4.0*q + vec2(1.7, 9.2) + t * 0.025),
    fbm(p + 4.0*q + vec2(8.3, 2.8) + t * 0.02)
  );
  return fbm(p + 4.0*r + t * 0.015);
}

// ── Palette ──────────────────────────────────────────────────────────────────
// night-sky navy → deep violet → purple accent → cream warmth

vec3 nightPalette(float t) {
  vec3 navy  = vec3(0.039, 0.051, 0.102); // #0a0d1a
  vec3 deep  = vec3(0.071, 0.024, 0.157); // #120640
  vec3 purp  = vec3(0.690, 0.149, 1.000); // #b026ff
  vec3 cream = vec3(0.957, 0.851, 0.651); // #f4d9a6
  float s = clamp(t, 0.0, 1.0) * 3.0;
  if (s < 1.0) return mix(navy,  deep,  s);
  if (s < 2.0) return mix(deep,  purp,  s - 1.0);
               return mix(purp,  cream, s - 2.0);
}

// ── Grain ────────────────────────────────────────────────────────────────────

float grain(vec2 fc, float t) {
  return hash(fc * 0.5 + fract(t * 73.13) * 1000.0);
}

// ── City lights ──────────────────────────────────────────────────────────────

float cityLights(vec2 uv, float t) {
  float result = 0.0;
  for (int i = 0; i < 40; i++) {
    float fi  = float(i);
    float px  = fract(sin(fi * 13.71) * 43758.5);
    float py  = fract(sin(fi * 7.31 + 1.0) * 31337.0) * 0.20;
    float sz  = 0.003 + fract(sin(fi * 3.7) * 9999.0) * 0.006;
    vec2  d   = uv - vec2(px, py);
    float dist = length(d);
    float flicker = 0.6 + 0.4 * sin(t * (1.0 + fract(sin(fi) * 99.9)) + fi);
    result += (sz * sz) / (dist * dist + sz * sz) * flicker;
  }
  return clamp(result, 0.0, 1.0);
}

// ── Main ─────────────────────────────────────────────────────────────────────

void main() {
  vec2 uv        = vUv;
  vec2 fragCoord = uv * uResolution;
  float t        = uTime;

  // Mouse parallax offset (smooth drift)
  vec2 mouse     = (uMouse - 0.5) * 2.0; // [-1,1]
  vec2 pUv       = uv + mouse * 0.04;

  // Base sky via warped fBm
  float warp = warpedFbm(pUv * 2.5 + vec2(0.0, 0.3), t);
  warp = warp * 0.5 + 0.5;

  vec3 col = nightPalette(warp * 0.55);

  // Aurora veil
  float aurora = warpedFbm(pUv * 1.8 + vec2(3.0, 0.0) + mouse * 0.06, t * 1.3);
  aurora = smoothstep(0.35, 0.65, aurora * 0.5 + 0.5);
  aurora *= smoothstep(0.2, 0.7, uv.y); // upper half only

  vec3 purpCol  = vec3(0.690, 0.149, 1.000); // #b026ff
  vec3 pinkCol  = vec3(1.000, 0.165, 0.753); // #ff2ac0
  vec3 auroraC  = mix(purpCol, pinkCol, smoothstep(0.3, 0.7, warp));
  col = mix(col, auroraC, aurora * 0.30);

  // Horizon city glow (cream warmth at bottom)
  float horizonY = smoothstep(0.25, 0.0, uv.y);
  vec3  warmGlow = vec3(0.957, 0.851, 0.651); // #f4d9a6
  col = mix(col, warmGlow * 0.4, horizonY * 0.5);

  // City light points
  float lights = cityLights(uv, t);
  col += lights * warmGlow * 0.9;

  // Chain-link fence grid (45° diamond, very faint)
  {
    vec2 fUv   = uv + mouse * 0.015;
    vec2 rot45 = vec2(fUv.x + fUv.y, fUv.x - fUv.y);
    rot45.x   *= uResolution.x / uResolution.y;
    vec2 cell  = fract(rot45 * 14.0) - 0.5;
    float dEdge = min(abs(cell.x), abs(cell.y));
    float fence = smoothstep(0.04, 0.01, dEdge) * 0.10;
    float rv    = length(uv - 0.5);
    fence *= smoothstep(0.75, 0.3, rv);
    col = mix(col, vec3(0.957, 0.910, 0.757), fence);
  }

  // Grain
  col += (grain(fragCoord, t) - 0.5) * 0.045;

  // Edge vignette
  {
    vec2 vig = uv - 0.5;
    vig.x   *= uResolution.x / uResolution.y;
    float v  = 1.0 - smoothstep(0.35, 0.85, length(vig) * 1.5);
    col     *= v;
  }

  col = clamp(col, 0.0, 1.0);
  col = pow(col, vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}
`;

// ── Inner mesh component ─────────────────────────────────────────────────────

function NightSkyMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, gl } = useThree();

  // Smooth mouse tracking (exponential decay)
  const mouse = useRef<[number, number]>([0.5, 0.5]);
  const smoothMouse = useRef<[number, number]>([0.5, 0.5]);

  const uniforms = useMemo(
    () => ({
      uTime:       { value: 0 },
      uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Update resolution when canvas resizes
  useEffect(() => {
    const dpr = gl.getPixelRatio();
    uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
  }, [size, gl, uniforms]);

  // Mouse listener (attached to window for full-page coverage)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = [
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight, // flip Y for GL
      ];
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;

    // Exponential smoothing for mouse (τ ≈ 0.12s → feel similar to the spring)
    const lerpK = 1 - Math.exp(-delta / 0.12);
    smoothMouse.current[0] += (mouse.current[0] - smoothMouse.current[0]) * lerpK;
    smoothMouse.current[1] += (mouse.current[1] - smoothMouse.current[1]) * lerpK;
    uniforms.uMouse.value.set(smoothMouse.current[0], smoothMouse.current[1]);
  });

  return (
    <ScreenQuad ref={meshRef}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

// ── Exported scene (dynamic-loaded, no SSR) ───────────────────────────────────

/**
 * _ShaderScene renders a full-viewport Three.js Canvas with the night-sky shader.
 * Import via ShaderCanvas (next/dynamic ssr:false) — never import directly.
 */
export function ShaderScene() {
  return (
    <Canvas
      // Match fixed-inset container exactly
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      // Orthographic-like: no camera movement needed for a ScreenQuad
      camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
      // Prefer high DPR for grain resolution but cap at 2 for performance
      dpr={[1, 2]}
      gl={{
        alpha: false,
        antialias: false,         // no AA needed for fullscreen quad
        powerPreference: "default",
      }}
      // Disable r3f event system — we use our own mouse listener
      events={() => ({ connected: false, disconnect: () => {} })}
    >
      <NightSkyMesh />
    </Canvas>
  );
}
