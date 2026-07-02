# iPhone SE で 15FPS — シェーダー背景 パフォーマンス改善チェックリスト

iPhone SE (2022) は GPU tier 1 相当の Hexa-core GPU を搭載し、画面解像度は 2x Retina。  
15FPS の主因は **① ピクセル数過多（dpr 2x）** + **② fbm オクターブ数** + **③ 毎フレーム描画の継続** がほぼ確定的。  
以下を優先度順に適用してください。

---

## 1. `dpr` を `[1, 1.5]` (または `[1, 1.25]`) にクランプする

**背景:** R3F はデフォルトで `devicePixelRatio` をそのまま使う。iPhone SE は 2x なので 4倍のピクセルをレンダリングしている。  
`dpr={[1, 1.5]}` にするだけで GPU 負荷が約 44% 削減できる。背景シェーダーなら `[1, 1.25]` でも視覚的な差はほぼない。

```diff
// src/components/ShaderBackground.tsx  （または ShaderCanvas を内包するファイル）

-<Canvas>
+<Canvas dpr={[1, 1.5]}>
```

iPhone SE 用にさらに絞る場合:

```diff
-<Canvas dpr={[1, 1.5]}>
+<Canvas dpr={[1, 1.25]}>
```

---

## 2. `frameloop="demand"` — マウス操作のみなら毎フレーム描画をやめる

**背景:** `frameloop="always"` (デフォルト) はタブが非表示でもバッテリーとGPUを消費し続ける。  
シェーダーが `uTime` で常時アニメーションしている場合は `"always"` のままだが、  
タブが隠れたときに停止する `VisibilityGate` を組み合わせるだけで大きな節約になる。  
マウス座標しか変化しない静的シーンなら `"demand"` に切り替え、`invalidate()` で手動更新する。

```diff
// 常時アニメーション + タブ非表示で停止する場合
// src/components/ShaderCanvas.tsx

+"use client";
+import { useEffect, useState } from "react";

+function VisibilityGate({ children }: { children: React.ReactNode }) {
+  const [visible, setVisible] = useState(true);
+  useEffect(() => {
+    const handler = () => setVisible(document.visibilityState === "visible");
+    document.addEventListener("visibilitychange", handler);
+    return () => document.removeEventListener("visibilitychange", handler);
+  }, []);
+  return visible ? <>{children}</> : null;
+}

 export function ShaderCanvas() {
   return (
     <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ contain: "strict" }}>
-      <Scene />
+      <VisibilityGate>
+        <Scene />
+      </VisibilityGate>
     </div>
   );
 }
```

マウスのみ更新でよい場合はさらに:

```diff
-<Canvas dpr={[1, 1.5]}>
+<Canvas dpr={[1, 1.5]} frameloop="demand">
```

```diff
// useFrame 内で invalidate を呼ぶ
+import { useThree } from "@react-three/fiber";

 function ShaderPlane() {
+  const { invalidate } = useThree();
   useFrame(({ clock, mouse }) => {
     mat.current.uniforms.uTime.value = clock.elapsedTime;
     mat.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
+    invalidate();
   });
 }
```

---

## 3. fbm オクターブ数を 5 → 2 に削減する

**背景:** `noise.glsl` のコストガイドより `fbm(N=5)` は `5 × simplex2D ≒ 150 ops/pixel`。  
iPhone SE の全ピクセル数は ~830K (1334×750)。5 octave = 約 1.25億 ops/frame。  
2 octave にすれば **60% 削減**。背景ノイズは低周波成分が視覚的に支配的なので劣化は最小限。

```diff
// GLSL フラグメントシェーダー内の fbm 定義（またはインライン展開箇所）

 float fbm(vec2 p) {
   float v = 0.0;
   float a = 0.5;
-  for (int i = 0; i < 5; i++) {
+  for (int i = 0; i < 2; i++) {
     v += a * simplex2D(p);
     p *= 2.02;
     a *= 0.5;
   }
   return v;
 }
```

さらに節約したい場合は `simplex2D` を `valueNoise` に差し替える (~12 ops vs ~30 ops):

```diff
 float fbm(vec2 p) {
   float v = 0.0;
   float a = 0.5;
   for (int i = 0; i < 2; i++) {
-    v += a * simplex2D(p);
+    v += a * valueNoise(p);
     p *= 2.02;
     a *= 0.5;
   }
   return v;
 }
```

---

## 4. `useDetectGPU` で tier-1 以下は CSS フォールバックに切り替える

**背景:** iPhone SE は GPU tier 1 判定になる可能性が高い。低性能デバイスにはシェーダーをそもそも出さず、既存の CSS/SVG ベースの `BackgroundFX` を使う。

```diff
// src/components/AdaptiveBackground.tsx  （新規ファイル）

+"use client";
+import { useDetectGPU } from "@react-three/drei";
+import { ShaderCanvas } from "./ShaderCanvas";
+import { BackgroundFX } from "./BackgroundFX";   // 既存 CSS ベース背景
+
+export function AdaptiveBackground() {
+  const gpu = useDetectGPU();
+  // gpu が null の間はフォールバック表示（SSR-safe）
+  if (!gpu || gpu.tier <= 1) return <BackgroundFX />;
+  return <ShaderCanvas />;
+}
```

```diff
// src/app/layout.tsx

-import { ShaderCanvas } from "@/components/ShaderCanvas";
+import { AdaptiveBackground } from "@/components/AdaptiveBackground";

-<ShaderCanvas />
+<AdaptiveBackground />
```

> `useDetectGPU` は `window` を使うので必ず `"use client"` 境界内かつ `next/dynamic({ ssr: false })` 配下に置くこと。

---

## 5. drei インポートをツリーシェイクする

**背景:** `import * from "@react-three/drei"` は 800KB 超のバンドルを引き込む。  
シェーダー背景で必要なのは `ScreenQuad` と `useDetectGPU` だけのことが多い。

```diff
-import * as drei from "@react-three/drei";
+import { ScreenQuad } from "@react-three/drei";
+import { useDetectGPU } from "@react-three/drei";
```

確認コマンド:

```bash
npm run build
# First Load JS のサイズを確認。/ ルートが 150KB 超なら drei の名前付きインポートを精査する
npx @next/bundle-analyzer
```

---

## 6. `gl.antialias = false` でアンチエイリアスを無効化する

**背景:** WebGL のデフォルト MSAA はモバイル GPU に重い。背景シェーダーは全画面ノイズなので AA の恩恵はほぼゼロ。

```diff
-<Canvas dpr={[1, 1.5]}>
+<Canvas
+  dpr={[1, 1.5]}
+  gl={{ antialias: false }}
+>
```

postprocessing を使っている場合は `EffectComposer` の `multisampling` も下げる:

```diff
-<EffectComposer>
+<EffectComposer multisampling={0} resolutionScale={0.5}>
```

---

## 7. `Suspense` で全アセットをプリロードし、ハイドレーション後の再描画を防ぐ

**背景:** `next/dynamic` と `Suspense` を組み合わせることで、Three.js チャンクのロード完了まで軽量フォールバックを出し、準備ができてから一度だけマウントする。中途半端なマウント→アンマウント→再マウントを防ぐ。

```diff
// src/components/ShaderCanvas.tsx

 import dynamic from "next/dynamic";
+import { Suspense } from "react";

 const Scene = dynamic(() => import("./ShaderBackground"), {
   ssr: false,
   loading: () => null,
 });

 export function ShaderCanvas() {
   return (
     <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ contain: "strict" }}>
-      <Scene />
+      <Suspense fallback={null}>
+        <Scene />
+      </Suspense>
     </div>
   );
 }
```

---

## 適用優先順位まとめ

| # | 対処 | 効果 | 難易度 |
|---|---|---|---|
| 1 | `dpr={[1, 1.5]}` | 高 (ピクセル数 -44%) | 1行 |
| 3 | fbm オクターブを 2 に | 高 (GLSL負荷 -60%) | 2行 |
| 4 | GPU tier-1 フォールバック | 根本解決 | 20行 |
| 2 | `frameloop="demand"` + VisibilityGate | 中 (バッテリー節約) | 15行 |
| 6 | `antialias: false` | 中 | 1行 |
| 5 | drei ツリーシェイク | 中 (バンドル削減) | import整理 |
| 7 | Suspense プリロード | 低 (安定性改善) | 5行 |

**まず 1 → 3 → 6 を適用**してリロードし、FPS を再計測してください。  
それでも 30FPS 未満なら 4 (GPU tier フォールバック) を適用するのが最も根本的な解決策です。
