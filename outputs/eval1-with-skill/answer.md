# Hydration エラーの原因と修正方法

## 原因の診断

### 直接原因: `<Canvas>` が SSR 時にサーバー上でレンダリングされている

`layout.tsx` に `<Canvas>` を直接書くと、Next.js (および Cloudflare Workers 上の OpenNext) がサーバーサイドでそのコンポーネントを HTML 文字列にしようとします。しかし WebGL (`window.WebGLRenderingContext`、`HTMLCanvasElement` など) はサーバー/Worker ランタイムには存在しません。

結果として以下のいずれかが起きます:

1. サーバーは「Canvas なし・シーンなし」の HTML を出力する。
2. クライアントは Canvas を描画し、DOM が変わる。
3. React がサーバー出力とクライアント出力を比較して不一致を検出 → **Hydration failed** エラー。

エラーメッセージの典型:

```
Error: Hydration failed because the server rendered HTML didn't match the client.
```

### 「`"use client"` を付けるだけでは不十分」な理由

`"use client"` はコンポーネントを **クライアントコンポーネント** としてマークするだけで、**SSR (サーバーサイドレンダリング) を無効化しません**。

Next.js はクライアントコンポーネントであっても、初回表示を高速化するために**サーバー上でプリレンダリング**します。このプリレンダリング時に WebGL グローバルが存在しないため、`<Canvas>` のマウントに失敗するか、空の HTML が生成されます。それがクライアント側の出力と一致しないので Hydration エラーが発生します。

SSR を本当に無効にするには `next/dynamic` の `ssr: false` オプションが必要です。

---

## 修正方針

```
layout.tsx
  └── <ShaderCanvas />          ← 薄いラッパー (SSR 実行される)
        └── dynamic(import ShaderScene, { ssr: false })
              └── <ShaderScene />  ← 実際の Canvas + シーン (クライアントのみ)
```

- `ShaderCanvas` は `"use client"` + `next/dynamic({ ssr: false })` で Canvas を遅延ロード。
- `ShaderScene` は `"use client"` + 実際の `<Canvas>` と Three.js シーン。
- `layout.tsx` はサーバーコンポーネントのまま維持し、`ShaderCanvas` を import するだけ。

---

## 修正後のファイル構成

```
src/
  app/
    layout.tsx          ← ShaderCanvas を import するよう変更
  components/
    ShaderCanvas.tsx    ← new: next/dynamic ラッパー
    _ShaderScene.tsx    ← new: 実際の Canvas / Three.js シーン
```

修正コードは以下の各ファイルを参照してください:

- `ShaderCanvas.tsx`
- `_ShaderScene.tsx`
- `layout.tsx` (パッチ)

---

## 三大チェックポイント (同様のエラーが再発したとき)

| チェック | 確認内容 |
|---|---|
| `ssr: false` を忘れていないか | `dynamic(import(...), { ssr: false })` になっているか |
| `Math.random` / `Date.now` を初期レンダリングで使っていないか | サーバーとクライアントで異なる値を生成する |
| `useThree` / `useFrame` を `<Canvas>` 外で呼んでいないか | R3F の Context は Canvas 内にしか存在しない |
