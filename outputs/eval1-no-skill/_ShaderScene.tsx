"use client";

/**
 * _ShaderScene.tsx
 *
 * 実際の WebGL / Three.js コードはここに書く。
 * このファイルは ShaderCanvas.tsx から next/dynamic({ ssr: false }) で
 * インポートされるため、サーバー（Cloudflare Workers）では一切実行されない。
 *
 * アンダースコアプレフィックス (_) はNext.jsのファイルベースルーティングから
 * 除外するための慣例（App Routerではprivateフォルダ規約）。
 */

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---- シェーダーコード（例: 全画面グラジエントシェーダー） ----
const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uResolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float t  = uTime * 0.3;

    // 例: ゆるやかに動くグラジェント
    vec3 col = 0.5 + 0.5 * cos(t + uv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(col * 0.15, 1.0); // 輝度を抑えて背景らしく
  }
`;

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock, size }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      {/* 画面全体を覆う平面 */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime:       { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
        }}
      />
    </mesh>
  );
}

export default function ShaderScene() {
  return (
    // fixed で全画面に敷き、z-index を低くして他UIの下に置く
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        // orthographic カメラで [-1, 1] の NDC 空間を使う
        orthographic
        camera={{ near: -1, far: 1 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]} // 高 DPI デバイスでも過負荷にならないよう上限を設定
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
