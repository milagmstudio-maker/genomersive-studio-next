# シェーダー背景変更 — リリース前チェックリスト

シェーダー背景 (`BackgroundFX` / Canvas 周り) を変更したら、`npm run build:cf && npx wrangler deploy` を実行する前にこのリストを上から順に確認する。

---

## 1. ローカルビルド

- [ ] `npm run build:cf` がエラー・警告なしで完了する（`nodejs_compat` 関連の警告が出ていないこと）
- [ ] `.open-next/worker.js` のサイズが **1MB 未満**（シェーダーコードが Worker バンドルに混入していないこと）
  ```bash
  ls -lh .open-next/worker.js
  ```
- [ ] クライアント JS チャンクの増分が **gzip 後 350KB 以内**（three.js + R3F を新規追加する場合は特に確認）
  ```bash
  du -sh .open-next/assets/_next/
  ```
- [ ] Worker バンドルサイズの差分が **100KB 以内**（サーバーパスに three.js が混入していないことの確認）

---

## 2. コンソール衛生 / ハイドレーション

- [ ] ハードリロード後に DevTools Console がクリーンである（`/`、`/works`、`/services`、`/blog`、`/contact` すべてで確認）
- [ ] `"Hydration failed"` 警告が出ていない
- [ ] `"Cannot find module 'three'"` やチャンクロードエラーが出ていない
- [ ] `"Maximum update depth exceeded"` が出ていない（`useFrame` 内で毎フレーム setState していないか確認）
- [ ] Canvas コンポーネントが `next/dynamic({ ssr: false })` 経由で動的インポートされている
- [ ] サーバーコンポーネントから到達可能なパスに `node:fs` など Node 固有 API を使ったモジュールがインポートされていない
- [ ] 初回レンダー時に `Math.random()`、`Date.now()`、`crypto.randomUUID()` を使っていない（ハイドレーション不一致の原因）
- [ ] `useThree` / `useFrame` が `<Canvas>` サブツリーの外で呼ばれていない
- [ ] `window`、`document`、`navigator` へのアクセスが `useEffect` または `useFrame` の内部に閉じ込められている

---

## 3. クロスブラウザスモークテスト

- [ ] **Chrome（デスクトップ）** — 背景が描画され、スクロールが重くない
- [ ] **Safari（デスクトップ）** — 背景が描画される（WebGL のベンダー差異を確認）
- [ ] **モバイル Safari（iPhone 実機 または DevTools モバイルモード）** — 背景が描画され、スクロールラグがない
- [ ] **モバイル Chrome（Android 実機 または DevTools モバイルモード）** — 同上
- [ ] 初回ペイント時にコンテンツの一瞬の崩れ（FOUC）が起きていない（Splash が隙間をカバーしていること）
- [ ] ブランドカラーが正しく表示されている（ navy `#08101e`、purple `#b026ff`、magenta `#ff2ac0`、cream `#f4d9a6`、cyan `#2effd5`）
- [ ] CSS の `.bg-noise::after` とシェーダーノイズが二重にかかっていない

---

## 4. パフォーマンス

- [ ] DevTools モバイルスロットリングまたは実機で **持続 ≥45 FPS**、デスクトップで **≥55 FPS**
- [ ] フレームタイム p95 が **≤22ms**（`<Stats />` または `<Perf />` で確認、本番コードからは除去すること）
- [ ] three.js / drei チャンクがページインタラクティブ化後に **遅延ロード**されている（初回ペイントをブロックしていないこと）
- [ ] シーンが毎フレーム更新不要なら `frameloop="demand"` を使っている

---

## 5. アクセシビリティ

- [ ] `prefers-reduced-motion: reduce` が有効なとき、シェーダーアニメーションが停止またはフォールバックする
  - DevTools「Rendering」→「Emulate CSS prefers-reduced-motion: reduce」で確認
  - `useReducedMotion()`（framer-motion）を `useFrame` のガードとして使っていること
- [ ] Canvas 要素に `aria-hidden="true"` が設定されている（スクリーンリーダーに不要な要素を露出しない）
- [ ] Canvas をブロックした状態でページのコンテンツが読め、ナビゲーションできる
- [ ] Bloom エフェクトによってリンク・ボタンのフォーカスリングが見えなくなっていない
- [ ] テキストと背景のコントラスト比が WCAG AA（4.5:1）以上を維持している

---

## 6. Cloudflare Workers 互換性

- [ ] `npm run build:cf` が `nodejs_compat` や未サポート API に関する警告なしで完了する
- [ ] サーバーコンポーネントから到達できるパスに top-level の `import * from 'three'` がない（Worker バンドルサイズ肥大化を防ぐ）
- [ ] ローカル Worker プレビューで動作確認済み：
  ```bash
  npx opennextjs-cloudflare preview
  ```
- [ ] Worker バンドルサイズ増分が **100KB 以内**（シェーダーコードはクライアントチャンクに留まっているはず）
- [ ] GLSL ファイルを `fs.readFileSync` で読んでいない（`?raw` インポートまたはテンプレートリテラルでインライン化すること）

---

## 7. コードクリーンアップ

- [ ] 新しいシェーダーが `BackgroundFX` や `GlitchOverlay` の一部を置き換えた場合、未使用コードと CSS を削除済み
- [ ] `console.log` をシェーダーコンポーネントに残していない
- [ ] `<Stats />`、`<Perf />`、`r3f-perf` などデバッグ用コードが本番コードパスに残っていない（環境変数でゲートするのは可）

---

## 8. デプロイと事後確認

- [ ] ビルド＆デプロイを実行：
  ```bash
  npm run build:cf && npx wrangler deploy
  ```
- [ ] デプロイ後、本番 URL をハードリフレッシュして背景が正しく表示されることを確認：
  `https://genomersive-studio-next.mila-gmstudio.workers.dev`
- [ ] デプロイ後 **5分間**、Cloudflare ダッシュボードまたは `wrangler tail` でエラーログを監視する
- [ ] デプロイ出力のバージョン ID をコミットメッセージに記録する（任意、ペーパートレール用）
