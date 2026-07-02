# Genomersive Studio HP — ChatGPT引き継ぎ書

## あなたが引き継ぐプロジェクトの概要

**Genomersive Studio**（MiLa / @mila_mixstudio）のポートフォリオ兼依頼窓口サイト。
VTuber・歌い手向けにボーカルMix、OBS音響調整、プロデュースを提供するサウンドスタジオ。

- **本番URL**: https://genomersivestudio.com
- **コアコピー（変更禁止）**: 「忘れられない音にする。」
- **サービス表記（変更禁止）**: Mixing / OBS音響調整 / プロデュース（「ボーカルMix」は使わない）

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16.2.4 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| アニメーション | framer-motion |
| CMS | microCMS（ブログのみ。サービス名: `mila-blog`） |
| デプロイ | Cloudflare Workers（@opennextjs/cloudflare） |
| フォーム | 自前API（`/api/contact` → Discord Webhook） |
| アナリティクス | Google Analytics（G-9VCCFHNVGL） |

---

## ファイル構成

```
mila-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 全ページ共通レイアウト・メタデータ・GA
│   │   ├── page.tsx            # トップページ（Hero, About, Services, Works, Case, FAQ, Contact）
│   │   ├── services/page.tsx   # 料金ページ（シミュレーター付き）
│   │   ├── works/page.tsx      # 実績一覧
│   │   ├── contact/page.tsx    # お問い合わせ
│   │   ├── blog/               # ブログ（microCMS連携）
│   │   ├── case/nijyuna/       # ケーススタディ：にじゅな
│   │   ├── api/contact/route.ts # フォームAPI
│   │   ├── sitemap.ts          # サイトマップ（静的+ブログ動的）
│   │   └── robots.ts           # robots.txt
│   ├── components/             # UIコンポーネント（個別説明は後述）
│   ├── data/
│   │   ├── works.ts            # 実績データ（WORKSの配列）
│   │   └── services.ts         # 料金データ（PLANS / ADDONS / DELIVERIES / DISCOUNTS）
│   └── lib/
│       ├── microcms.ts         # microCMSクライアント
│       ├── quote.ts            # 料金計算ロジック
│       └── cn.ts               # clsx + tailwind-merge ユーティリティ
├── public/                     # 静的ファイル（画像・動画・OGP）
├── next.config.ts              # workers.dev→本番ドメインの308リダイレクト
├── wrangler.jsonc              # Cloudflare Workers設定
└── open-next.config.ts         # OpenNext設定
```

---

## 主要コンポーネント一覧

| ファイル | 役割 |
|----------|------|
| `Hero.tsx` | ファーストビュー。コアコピー表示 |
| `About.tsx` | MiLaのプロフィールセクション |
| `Services.tsx` / `ServicesTeaser.tsx` | サービス紹介。Teaserはトップ用簡易版 |
| `ReasonCards.tsx` | 「選ばれる理由」カード（3枚構成） |
| `SelectedWorks.tsx` | トップの実績ピックアップ |
| `Works.tsx` / `WorkCard.tsx` / `WorkModal.tsx` | 実績一覧・カード・モーダル |
| `CaseStudy.tsx` | ケーススタディカード（トップ003） |
| `Faq.tsx` | FAQ（アコーディオン。8問） |
| `Contact.tsx` | お問い合わせフォーム |
| `Flow.tsx` | 依頼の流れセクション |
| `JsonLd.tsx` | JSON-LD構造化データ（Organization + FAQ + Service + Offer） |
| `AmbientVideo.tsx` | 背景映像 |
| `GlitchOverlay.tsx` | グリッチエフェクト |
| `Cursor.tsx` | カスタムカーソル |
| `DotNav.tsx` | セクションドットナビゲーション |
| `MobileNav.tsx` | モバイルハンバーガーメニュー |
| `BrandMark.tsx` | 左上固定のブランドロゴ |
| `Splash.tsx` | 初回表示スプラッシュ画面 |
| `BlogContent.tsx` / `BlogCta.tsx` | ブログ本文・CTA |

---

## 環境変数（Cloudflare Secrets）

| 変数名 | 用途 | 設定場所 |
|--------|------|----------|
| `DISCORD_WEBHOOK_URL` | フォーム通知先Discord Webhook | wrangler secret |
| `MICROCMS_API_KEY` | microCMS APIキー | wrangler secret |

**重要**: `wrangler.jsonc` の `vars` に入っている `MICROCMS_SERVICE_DOMAIN: "mila-blog"` はsecretではなく通常の環境変数。

---

## デプロイ方法

```bash
# ローカル確認
npm run dev          # http://localhost:3000

# 本番デプロイ（Cloudflare Workers）
npm run build:cf     # Next.jsビルド + OpenNextビルド
npx wrangler deploy  # Cloudflareにデプロイ
```

デプロイ先: `genomersive-studio-next.mila-gmstudio.workers.dev`（→ 308で本番ドメインに転送）

---

## SEO・リダイレクト設定

- **正規ドメイン**: `https://genomersivestudio.com`（Cloudflare Registrar取得済み）
- **旧URL自動転送**: `genomersive-studio-next.mila-gmstudio.workers.dev` → `genomersivestudio.com`（308 Permanent）
  - `next.config.ts` の `redirects()` で `has: [{ type: "host", value: "...workers.dev" }]` により実装
- **sitemap**: `/sitemap.xml`（静的6ページ + microCMSブログ記事動的生成）
- **Google Search Console**: `genomersivestudio.com` のドメインプロパティ登録済み（確認コード: `yC1SsnbYlhUxLauGhdw287HDdaywwZMntUBhEbCmPBE`）

---

## データ更新の仕方

### 実績を追加する（`src/data/works.ts`）

```typescript
// WORKSの配列の先頭に追加すると、一覧の先頭に表示される
{
  id: "w-025",            // 連番でつける
  title: "曲名",
  artist: "原曲アーティスト covered by タレント名",
  category: "VOCAL MIX", // "VOCAL MIX" | "PARA MIX" | "OBS AUDIO" | "PRODUCTION"
  youtubeId: "XXXXXXXXXXX", // YouTubeのv=以降のID
  year: 2026,
},
```

### 料金を変更する（`src/data/services.ts`）

`PLANS` 配列の各オブジェクトの `basePrice` を変更する。
`startsFrom: true` が付いていると「¥X,000〜」と表示される。

---

## フォームの仕組み

1. ユーザーが `/contact` からフォーム送信
2. `POST /api/contact`（`src/app/api/contact/route.ts`）が受け取る
3. `DISCORD_WEBHOOK_URL` 宛にDiscord Embed通知を送る
4. ボット対策: `_gotcha` フィールド（honeypot）

料金シミュレーター画面から「このプランで問い合わせ」すると、見積もりJSON（`quote`フィールド）も一緒に送信される。

---

## ブログ（microCMS）

- サービスドメイン: `mila-blog`
- APIキー: `MICROCMS_API_KEY`（wrangler secret）
- 取得ロジック: `src/lib/microcms.ts`
- 記事一覧: `/blog`、個別記事: `/blog/[id]`

---

## 残タスク（2026年7月時点）

| タスク | 状況 | 担当 |
|--------|------|------|
| お客様の声セクション | 掲載OKの感想テキスト待ち | MiLa |
| CTAクリック計測（GAイベント） | GA導入済みだがイベント未設置 | コード作業 |
| ケーススタディ「結果の数字」「本人の声」 | テキスト待ち | MiLa + にじゅな |
| Mix版before/afterデモ音源 | 素材待ち | MiLa |

---

## 確定事項（変更禁止リスト）

以下はMiLaが確認・決定済みのため、提案・変更しないこと：

- コアコピー「忘れられない音にする。」
- サービス呼称「Mixing」（「ボーカルMix」は使わない）
- フォームはDiscord Webhook通知（外部フォームサービスに戻さない）
- チャンネル構造・ブランドコンセプト（にじゅな関連）
- デプロイ先：Cloudflare Workers（Vercel等に移行しない）

---

## プロジェクトオーナー情報

- **MiLa** / Genomersive Studio
- Twitter/X: @mila_mixstudio
- Mail: mila.gmstudio@gmail.com
- 経歴: サウンドエンジニア出身（ミキシング→録音・音響・PA）、現在ディレクター・プロデューサー
- 実績: 500件以上（TOTAL WORKS）
- プログラミング経験なし → コードは説明より動くものを直接提示

---

## ChatGPTへの注意点

- このファイルをシステムプロンプトまたは最初のメッセージとして貼り付けて使う
- `src/data/works.ts` と `src/data/services.ts` が主なデータ変更ポイント
- デプロイは `npm run build:cf && npx wrangler deploy` の2コマンド
- 環境変数は `wrangler secret put DISCORD_WEBHOOK_URL` で設定（コードに書かない）
- Cloudflare Workers環境のため、Node.js固有API（`fs`等）は使えない
