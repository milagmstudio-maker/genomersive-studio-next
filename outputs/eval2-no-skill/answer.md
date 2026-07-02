# iPhone SE 15FPS 問題 — BackgroundFX 軽量化チェックリスト

iPhone SE (A13 / 第3世代でも GPU は Mobile tier-1 相当) で 15FPS しか出ない原因は、主に「描画解像度が高すぎる」「毎フレーム再描画している」「FBM のオクターブが多い」の3点です。以下を上から順に対処すると効果が大きい順になっています。

---

## 1. DPR (Device Pixel Ratio) を上限クランプする

iPhone SE の DPR は 2.0。デフォルトでは Canvas サイズが CSS サイズの4倍ピクセルになり、シェーダーの実行回数が4倍になります。上限を 1.5（あるいは省電力重視なら 1.25）にクランプするだけでフィルレートが大幅に下がります。

```diff
- <Canvas>
+ <Canvas dpr={[1, 1.5]}>
    <BackgroundFX />
  </Canvas>
```

> `dpr={[min, max]}` と渡すと R3F が `Math.min(window.devicePixelRatio, max)` を自動適用します。

---

## 2. `frameloop="demand"` — マウス入力時だけ再描画する

背景アニメーションがマウス / タッチ位置にだけ反応する場合、毎フレーム描画は不要です。`frameloop="demand"` にして、ユニフォームを更新するときだけ `invalidate()` を呼ぶようにします。

```diff
- <Canvas>
+ <Canvas frameloop="demand">
    <BackgroundFX />
  </Canvas>
```

```diff
// BackgroundFX.tsx
- useFrame(({ clock }) => {
-   uniforms.uTime.value = clock.getElapsedTime();
- });
+ const { invalidate } = useThree();
+
+ useEffect(() => {
+   const handleMove = (e: PointerEvent) => {
+     uniforms.uMouse.value.set(
+       e.clientX / window.innerWidth,
+       1 - e.clientY / window.innerHeight
+     );
+     invalidate();
+   };
+   window.addEventListener("pointermove", handleMove);
+   return () => window.removeEventListener("pointermove", handleMove);
+ }, [invalidate]);
```

時間ベースのアニメーションが必要な場合は `frameloop="always"` のままにして、後述の GPU tier チェックと組み合わせて低品質モードに切り替えてください。

---

## 3. FBM のオクターブ数を削減する（8→2）

fBm (fractal Brownian motion) はオクターブを1つ増やすたびにノイズサンプリングが倍になります。ハイエンド GPU 向けに 6〜8 オクターブにしている場合、モバイルでは 2 で十分です。

```diff
// shaders/background.frag
- const int OCTAVES = 8;
+ const int OCTAVES = 2;   // モバイルは 2 で十分

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}
```

---

## 4. `useDetectGPU` で GPU tier を判定し、低品質フォールバックを出す

`@react-three/drei` の `useDetectGPU` (内部で `detect-gpu` を使用) で tier-0/1 のデバイスを検出し、シェーダー版をスキップして CSS グラデーションなど軽量な代替を表示します。

```diff
// components/BackgroundFX.tsx
+ import { useDetectGPU } from "@react-three/drei";
+ import { CSSFallbackBG } from "./CSSFallbackBG";

  export function BackgroundFX() {
+   const gpuTier = useDetectGPU();
+
+   // tier 0–1 (iPhone SE 含む廉価モバイル) は CSS にフォールバック
+   if (!gpuTier || gpuTier.tier <= 1) {
+     return <CSSFallbackBG />;
+   }
+
    return (
      <Canvas dpr={[1, 1.5]}>
        <ShaderScene />
      </Canvas>
    );
  }
```

```tsx
// components/CSSFallbackBG.tsx
export function CSSFallbackBG() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        zIndex: -1,
      }}
    />
  );
}
```

---

## 5. drei のインポートをツリーシェイクできる形に変える

`@react-three/drei` は v10 でも named export ごとにバンドルが分かれていますが、`import * as drei from "@react-three/drei"` のような書き方をすると全モジュールが入ります。使うものだけを明示的にインポートしてください。

```diff
- import { OrbitControls, useDetectGPU, shaderMaterial, Stars, ... } from "@react-three/drei";
+ import { shaderMaterial } from "@react-three/drei/core/shaderMaterial";
+ import { useDetectGPU } from "@react-three/drei/core/useDetectGPU";
```

または、`next.config.ts` で `transpilePackages` に追加してツリーシェイクを保証します。

```diff
// next.config.ts
  const nextConfig: NextConfig = {
+   transpilePackages: ["@react-three/drei", "@react-three/fiber", "three"],
  };
```

---

## 6. `gl.antialias = false` でアンチエイリアスを無効化する

モバイルの GPU はアンチエイリアスの MSAA バッファ確保だけで数 ms 失います。背景シェーダーは全画面クアッドなのでジャギーは視認できないため、オフにして問題ありません。

```diff
- <Canvas>
+ <Canvas
+   gl={{ antialias: false }}
+ >
    <BackgroundFX />
  </Canvas>
```

複数の最適化を組み合わせた最終形:

```tsx
<Canvas
  dpr={[1, 1.5]}
  frameloop="demand"
  gl={{ antialias: false, powerPreference: "low-power" }}
>
  <ShaderScene />
</Canvas>
```

---

## 7. `Suspense` + `Preload` で初期ロードをブロックしない

シェーダーのコンパイルや texture のロードが JS メインスレッドをブロックすると、初回フレームが遅れて「重い」と感じられます。`Suspense` でラップし、`useGLTF.preload` / `useTexture.preload` を使ってアセットを事前ロードしてください。

```diff
// app/page.tsx
+ import { Suspense } from "react";

  export default function Home() {
    return (
+     <Suspense fallback={<CSSFallbackBG />}>
        <BackgroundFX />
+     </Suspense>
    );
  }
```

```diff
// BackgroundFX.tsx (ファイル末尾)
+ // テクスチャを使う場合はここで事前ロード
+ useTexture.preload("/textures/noise.png");
```

---

## 優先順位まとめ

| # | 施策 | 難易度 | 期待効果 |
|---|------|--------|----------|
| 1 | DPR クランプ `[1, 1.5]` | 低 | フィルレート -55% |
| 2 | `frameloop="demand"` | 低〜中 | 静止時 CPU/GPU ほぼゼロ |
| 3 | FBM オクターブ 2 に削減 | 低 | シェーダー実行時間 -75% |
| 4 | GPU tier 判定 + CSS フォールバック | 中 | tier-0/1 で完全回避 |
| 5 | drei ツリーシェイク | 中 | JS バンドルサイズ削減 |
| 6 | `gl.antialias: false` | 低 | MSAA コスト排除 |
| 7 | Suspense + Preload | 低 | 初期描画ブロック解消 |

**1〜3 を先にやるだけで iPhone SE でも 30FPS 超えが見込めます。** 4 の GPU tier フォールバックは「それでも重い端末への最終防衛ライン」として実装しておくことを強くお勧めします。
