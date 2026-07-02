# シェーダー背景 (BackgroundFX) リリース前チェックリスト

## 1. ローカルビルド

- [ ] `npm run build:cf` がエラーなく完了する
- [ ] TypeScript コンパイルエラーが 0 件である
- [ ] Turbopack のビルドログにシェーダー関連の警告がない
- [ ] `.open-next/` および `dist/` の生成物が正常に出力されている

## 2. クロスブラウザ動作確認

### デスクトップ
- [ ] Chrome (最新版) でシェーダー背景が正常に描画される
- [ ] Safari (最新版) でシェーダー背景が正常に描画される
- [ ] Firefox (最新版) で WebGL コンテキストエラーが出ないことを確認する

### モバイル
- [ ] iOS Safari (実機 or BrowserStack) でシェーダー背景が表示される
- [ ] iOS Safari でフレームレートが極端に低下しない（15fps 以上を目安）
- [ ] Android Chrome (実機 or BrowserStack) でシェーダー背景が表示される
- [ ] 低スペック端末でブラウザがクラッシュしないことを確認する

## 3. アクセシビリティ

- [ ] `<canvas>` 要素に `aria-hidden="true"` が付与されており、スクリーンリーダーに読み上げられない
- [ ] `prefers-reduced-motion: reduce` メディアクエリが適用されているとき、シェーダーアニメーションが停止または最小化される
- [ ] アニメーション停止後もページコンテンツの視認性が損なわれない
- [ ] フォアグラウンドテキストとシェーダー背景のコントラスト比が WCAG 2.1 AA 基準（4.5:1 以上）を満たしている
- [ ] キーボードフォーカスがキャンバス上に落ちず、インタラクティブ要素に当たらない

## 4. Cloudflare Workers 互換性

- [ ] BackgroundFX コンポーネントに `dynamic(..., { ssr: false })` が適用されており、サーバーサイドで Three.js が実行されない
- [ ] `three` / `@react-three/fiber` / `postprocessing` のトップレベルインポートがサーバーパス（Server Components、API Routes）に存在しない
- [ ] Worker バンドルサイズの増分が 100 KB 未満である（`wrangler deploy --dry-run` や `stat` でビルド成果物を比較）
- [ ] `wrangler.toml` の `compatibility_date` および `compatibility_flags` が WebGL 利用に問題ない設定になっている
- [ ] Cloudflare Workers 環境に `window` / `document` / `WebGLRenderingContext` のポリフィルが不要なことを確認（クライアント専用で完結している）

## 5. バンドル・サイズ

- [ ] クライアント JS の増分が gzip 後 350 KB 未満である
  - 確認方法: `next build` のアナライズ出力、または `ANALYZE=true npm run build` で Bundle Analyzer を使用
- [ ] シェーダーファイル（GLSL）が文字列インライン化またはアセットとして適切にバンドルされており、重複していない
- [ ] `@react-three/fiber`、`three`、`postprocessing` が `client-only` のチャンクにのみ含まれている
- [ ] 不要な Three.js モジュール（使っていない geometries / controls など）が tree-shake されている

## 6. デプロイ・本番確認

- [ ] `npm run build:cf && npx wrangler deploy` が正常終了する
- [ ] デプロイ後に本番 URL をハードリフレッシュ（Cmd+Shift+R / Ctrl+Shift+R）して動作を確認する
- [ ] デプロイ直後 5 分間、Cloudflare Dashboard の Workers ログ（またはログテール `npx wrangler tail`）を監視し、エラー・例外がない
- [ ] CDN キャッシュが古い JS を返していないことを確認する（DevTools の Network タブで `Cache-Control` ヘッダーを確認）
- [ ] ページの Core Web Vitals（特に LCP・CLS）がシェーダー追加前と比べて大幅に悪化していない
