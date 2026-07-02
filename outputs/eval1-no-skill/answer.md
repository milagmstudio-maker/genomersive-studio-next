# Hydration Error: シェーダー背景の修正方法

## 原因の診断

### なぜエラーが発生するのか

`<Canvas>`（@react-three/fiber 等）はレンダリング時に `window`、`document`、`WebGLRenderingContext` などのブラウザ専用グローバルオブジェクトにアクセスします。

このプロジェクトは **Cloudflare Workers** にデプロイされており、サーバーサイドランタイムは Node.js ではなく Edge Runtime（Workers）です。このランタイムには `window` も `WebGL` も存在しません。

Next.js App Router はサーバーで HTML を生成し、クライアントでそれを「ハイドレート」します。`<Canvas>` をサーバーでレンダリングしようとすると：

1. **サーバー側**: WebGL グローバルが存在しないためエラーになるか、空の HTML が出力される
2. **クライアント側**: Canvas が正常にレンダリングされる
3. **結果**: サーバー出力とクライアント出力が一致せず → **Hydration failed**

### `"use client"` だけでは不十分な理由

`"use client"` ディレクティブはコンポーネントを「クライアントコンポーネント」としてマークしますが、これは **レンダリングの境界を定義するだけ** で、SSR を無効化するものではありません。

Next.js App Router では、`"use client"` コンポーネントも依然としてサーバーで **初回レンダリング（プリレンダリング）** されます。つまり、サーバー側でも一度コードが実行されるため、`window` や `WebGL` が参照されると同様のエラーが発生します。

SSR を完全に無効化するには `next/dynamic` の `{ ssr: false }` オプションが必要です。

---

## 修正方針

```
src/components/
  ShaderCanvas.tsx        ← dynamic() でラップする薄いWrapper（SSR無効）
  _ShaderScene.tsx        ← 実際の <Canvas> + シェーダーコード（"use client"）
src/app/
  layout.tsx              ← <Canvas> を直書きした箇所を ShaderCanvas に置き換え
```

`ShaderCanvas` が `next/dynamic({ ssr: false })` で `_ShaderScene` を動的インポートするため、サーバーでは一切レンダリングされません。

---

## 修正コード

### 1. `_ShaderScene.tsx`（実際の WebGL コンポーネント）

`/Users/takumitoyama/HP制作/mila-site/src/components/_ShaderScene.tsx` を参照。

### 2. `ShaderCanvas.tsx`（SSR無効ラッパー）

`/Users/takumitoyama/HP制作/mila-site/src/components/ShaderCanvas.tsx` を参照。

### 3. `layout.tsx`（修正版）

`/Users/takumitoyama/HP制作/mila-site/outputs/eval1-no-skill/layout.tsx.patch` を参照。

---

## まとめ

| 対策 | SSRを防ぐか | 備考 |
|------|------------|------|
| `"use client"` のみ | **No** | プリレンダリングは依然実行される |
| `typeof window !== 'undefined'` チェック | 部分的 | Hydration mismatch は残る可能性あり |
| `next/dynamic({ ssr: false })` | **Yes** | サーバーでのレンダリングを完全にスキップ |
| `useEffect` 内でのみ mount | Yes（補助的） | dynamic と組み合わせるとより安全 |

**正解は `next/dynamic({ ssr: false })` で動的インポートすること。** これにより Next.js はそのコンポーネントのサーバーサイドレンダリングを完全にスキップし、クライアントのみでマウントします。
