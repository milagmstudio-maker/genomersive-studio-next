// src/components/_ShaderScene.tsx
//
// 実際の WebGL Canvas とシェーダーシーンを保持するクライアント専用コンポーネント。
// ShaderCanvas.tsx 経由でのみロードされ、直接 layout.tsx から import しない。
//
// ブランドカラー:
//   base navy   : #08101e
//   accent purple: #b026ff
//   accent magenta: #ff2ac0
//   accent cream: #f4d9a6
//   accent cyan : #2effd5

"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Fragment shader — urban night / glitch mood
// フラグメントシェーダーのみ変更し、頂点シェーダーは固定の全画面平面を使用
// ---------------------------------------------------------------------------
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;

  // -- hash / value noise --
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),           hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.1; a *= 0.5;
    }
    return v;
  }

  // -- film grain --
  float grain(vec2 uv, float t) {
    return hash(uv * 600.0 + t * 0.05) * 0.08;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // base navy
    vec3 col = vec3(0.031, 0.063, 0.118);

    // fbm cloud layer
    float t = uTime * 0.08;
    float n = fbm(uv * aspect * 3.0 + t);
    float n2 = fbm(uv * aspect * 5.5 - t * 0.7 + 10.0);

    // purple accent
    col = mix(col, vec3(0.69, 0.149, 1.0), n * 0.25);
    // magenta edge
    col = mix(col, vec3(1.0, 0.165, 0.753), n2 * 0.12);
    // cyan glow near mouse
    vec2 m = uMouse * 0.5 + 0.5;
    float md = 1.0 - smoothstep(0.0, 0.5, length((uv - m) * aspect));
    col = mix(col, vec3(0.18, 1.0, 0.835), md * 0.08);

    // vignette
    float v = 1.0 - smoothstep(0.3, 1.4, length((uv - 0.5) * aspect));
    col *= v;

    // film grain
    col += grain(uv, uTime);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Inner scene component — useFrame/useThree は必ず Canvas 子孫で呼ぶ
// ---------------------------------------------------------------------------
function ShaderPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const shouldReduce = useReducedMotion();

  const uniforms = useRef({
    uTime:       { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMouse:      { value: new THREE.Vector2(0, 0) },
  });

  useFrame(({ clock, size, mouse }) => {
    if (!matRef.current) return;

    // prefers-reduced-motion: 時間を止めてアニメーションを停止
    if (!shouldReduce) {
      uniforms.current.uTime.value = clock.getElapsedTime();
    }

    uniforms.current.uResolution.value.set(size.width, size.height);
    uniforms.current.uMouse.value.set(mouse.x, mouse.y);
  });

  return (
    <mesh>
      {/* 全画面をカバーする平面。カメラは orthographic でも perspective でも可 */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        depthWrite={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Export — ShaderCanvas.tsx が dynamic import するエントリ
// ---------------------------------------------------------------------------
export default function ShaderScene() {
  return (
    <Canvas
      className="!h-full !w-full"
      frameloop="always"
      gl={{ antialias: false, alpha: false }}
      camera={{ near: 0.1, far: 10, position: [0, 0, 1] }}
    >
      <ShaderPlane />
    </Canvas>
  );
}
