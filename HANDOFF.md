# Genomersive Studio HP — 引き継ぎ書

最終更新: 2026-09-25（タイポグラフィ刷新とヒーロー整理を反映）

AIアシスタント（Claude / ChatGPT など）や他の作業者が、このサイトの現状を把握して更新を続けるための資料。
**公開中のサイトが「正」**。この文書と公開版がずれていたら、公開版とソースを優先し、この文書を直す。

## プロジェクトの概要

**Genomersive Studio**（MiLa / @mila_mixstudio）のポートフォリオ兼依頼窓口サイト。
VTuber・歌い手・配信者向けの音響制作スタジオ（Vocal Mix / Para Mix / 配信音響設計 / 整音 / プロデュース）。

- **本番URL**: https://genomersivestudio.com
- **コアコピー（変更禁止）**: 「忘れられない音にする。」— トップ最下部のCTA帯の締めに掲載
- **Heroのメインコピー**: 「音を整え、活動の次の一歩まで。」
- **サービス表記**: VOCAL MIX / PARA MIX / OBS AUDIO / BINAURAL / AUDIO EDIT / CREATIVE DIRECTION（英大文字表記）。本文では「Vocal Mix・Para Mix・配信音響設計・整音」

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16.2.4 (App Router)。学習データと仕様が違うので `node_modules/next/dist/docs/` を確認してから書く |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| フォント | 本文 Geist ／ ラベル・英字見出し Archivo（横幅 wdth 112〜125%、太字）／ 和文見出し OS標準の太いゴシック（Webフォントなし）／ スプラッシュのロゴだけ Cormorant Garamond 斜体。調整は `globals.css` 末尾の「タイポグラフィ」節で一括 |
| アニメーション | framer-motion |
| CMS | microCMS（ブログのみ。サービスドメイン: `mila-blog`） |
| デプロイ | Cloudflare Workers（@opennextjs/cloudflare） |
| フォーム | 自前API（`/api/contact` → Discord Webhook） |
| アナリティクス | Google Analytics（`G-9VCCFHNYGL`） |

---

## ページ構成

| URL | ファイル | 中身 |
|-----|----------|------|
| `/` | `src/app/page.tsx` | トップ（下の「トップの構成」参照） |
| `/works` | `src/app/works/page.tsx` → `Works.tsx` | 実績一覧（ALL）。ページ送りあり（ページ番号はURLに載らない） |
| `/works/vocal-mix` など | `src/app/works/[category]/page.tsx` | カテゴリ別の実績。タブを押すとURLが変わる。実績が1件以上あるカテゴリだけ自動で作られ、0件のカテゴリのURLは404（例: 今は `/works/para-mix`）。ページごとのタイトル・説明文は同ファイルの `META` |
| `/services` | `src/app/services/page.tsx` | `Services`（料金シミュレーター）→ `Flow`（依頼の流れ）→ `Faq`（8問）→ `CtaBand` |
| `/case/nijyuna` | `src/app/case/nijyuna/page.tsx` | ケーススタディ CASE 001：にじゅな |
| `/blog`, `/blog/[id]` | `src/app/blog/` | microCMSのブログ。記事末に `BlogCta` |
| `/contact` | `src/app/contact/page.tsx` → `Contact.tsx` | お問い合わせフォーム |
| `/notes` | `src/app/notes/page.tsx` | ご依頼に関する留意事項（お支払い / 素材の準備 / 修正と納期 / ご連絡 / 作品の公開 / 実績掲載 / キャンセル・改定） |

ナビ: TOP / WORKS / SERVICES / BLOG / CONTACT
フッター: © 2026 GENOMERSIVE STUDIO / MiLa、X（@mila_mixstudio）、MAIL

### トップの構成（上から順）

| No. | コンポーネント | 見出し・コピー |
|-----|----------------|----------------|
| 001 | `Hero` | 肩書き「SOUND ENGINEER / DIRECTOR / PRODUCER」（経歴の順）→ 名前「GENOMERSIVE STUDIO」（横長の極太）→「音を整え、活動の次の一歩まで。」→「SOUND STUDIO FOR EVERY VOICE／声と音で活動する、すべての人へ」→ ボタン「実績を聴く」（白塗り）「料金を見る」（枠線） |
| 002 | `SelectedWorks` | SELECTED WORKS / 代表作「言葉より先に、耳で確かめてください。」（002〜006の見出しは `TopSectionHeading`：番号＋和文の小ラベルの下に英字を極太で大きく） |
| 003 | `CaseStudy` | CASE STUDY / プロデュース事例「数を並べるより、一つの物語を深く。」（にじゅな） |
| 004 | `ServicesTeaser` | SERVICES / できること（6サービス＋「料金シミュレーターで概算を出す」） |
| 005 | `Philosophy` | PHILOSOPHY / サービス思想「納品して終わりではなく、次の一歩が見えるところまで。」 |
| 006 | `About` | ABOUT / MiLaについて「『誰に頼むか』で音は変わります。」500+ WORKS / 2022〜 / OBSアフター2ヶ月 |
| — | `Notices` | ブログ最新記事 |
| — | `CtaBand` | GET IN TOUCH「まずは、相談から。」→ 締め「忘れられない音にする。」 |

### 全ページ共通（`src/app/layout.tsx`）

`JsonLd`（構造化データ）/ `Splash`（初回スプラッシュ）/ `AmbientVideo`（背景映像。スマホ・データセーバー・2G では読み込まない）/ `GlitchOverlay` / `Cursor` / `BrandMark`（左上ロゴ）/ `DotNav` / `MobileNav` / フッター / GA

### 部品として中で使われているコンポーネント

- `ReasonCards.tsx` — About の中の「3つの強み」カード
- `SplitText.tsx` — Hero の文字アニメーション（単語の途中では折り返さない）
- `TopSectionHeading.tsx` — トップ002〜006のセクション見出し
- `SectionLabel.tsx` — Works / Services のセクション見出し
- `WorkCard.tsx` / `WorkModal.tsx` — 実績カードと再生モーダル
- `BlogContent.tsx` — ブログ本文

---

## データ更新の仕方

### 実績を追加する（`src/data/works.ts`）

**配列の並び順がそのまま `/works` の表示順**（並べ替え処理はない）。新しい実績を上に出したいなら、配列の**先頭**に入れる。

```typescript
{
  id: "w-045",            // 連番（現在の最大は w-044）
  title: "曲名",
  artist: "原曲アーティスト covered by タレント名",
  category: "VOCAL MIX", // "VOCAL MIX" | "PARA MIX" | "OBS AUDIO" | "PRODUCTION"
  youtubeId: "XXXXXXXXXXX", // YouTubeの v= 以降のID（サムネは自動取得）
  year: 2026,
},
```

現在39件（2026-09-18 に YouTube で見られなくなった4件を削除、2026-09-19 に翠雨しのの Shorts 2本を追加）。

カテゴリとURLの対応は同ファイル末尾の `CATEGORY_SLUGS`（VOCAL MIX → `vocal-mix` など）。0件だったカテゴリに実績を足すと、次のビルドでそのカテゴリのページとタブが自動で出る。

### トップの代表作を差し替える（`src/components/SelectedWorks.tsx`）

`FEATURED_IDS` の配列を編集する（現在 `["w-036", "w-040", "w-009", "w-032"]`）。

### 料金を変更する（`src/data/services.ts`）

`PLANS` 配列の各プランの `basePrice` を変える。`startsFrom: true` だと「¥X,000〜」表示。`basePrice: 0` は「個別相談」。

| プラン | カテゴリ | 基本料金 |
|--------|----------|----------|
| Short Mix | VOCAL MIX | ¥3,000〜 |
| One Chorus | VOCAL MIX | ¥6,000〜 |
| Full Chorus | VOCAL MIX | ¥10,000〜 |
| Collab・合唱 | VOCAL MIX | ¥16,000〜（人数追加 +¥5,000/人） |
| 弾き語り Mix | PARA MIX | ¥12,000〜 |
| Para Mix（10トラック〜） | PARA MIX | ¥15,000〜（+¥500/トラック） |
| OBS Audio / 配信音響設計 | OBS AUDIO | ¥30,000 |
| Vocal Mix 3曲パック | VOCAL MIX | ¥20,000 |
| Shorts Vocal Mix Pack | VOCAL MIX | ¥10,000 |
| Monthly Vocal Mix Pack | VOCAL MIX | ¥15,000 |
| Binaural / Audio Edit・整音 / Creative Direction | 各 | 個別相談 |

- オプション（`ADDONS`）: マスタリングのみ ¥5,000 / マイナスワン書き出し ¥1,000
- 納期（`DELIVERIES`）: 通常 1〜2週間 / 5日以降指定 +¥3,000 / 72時間特急 +¥6,000 / 24時間特急 +¥9,000
- 割引（`DISCOUNTS`）: 初回 −¥2,000 / 3回目以降 20% OFF
- 計算ロジックは `src/lib/quote.ts`

**料金を変えたら、次の3か所も合わせて直す**: `ServicesTeaser.tsx`（トップの表示）、`JsonLd.tsx`（検索エンジン向けの minPrice: Vocal ¥3,000 / Para ¥12,000 / OBS ¥30,000）、`Faq.tsx`（料金に触れている回答）

---

## フォームの仕組み

1. `/contact` のフォームから送信
2. `POST /api/contact`（`src/app/api/contact/route.ts`）が受け取る
3. `DISCORD_WEBHOOK_URL` 宛にDiscordのEmbedで通知
4. ボット対策: `_gotcha`（honeypot）

フォーム項目: `name`（活動名）/ `email` / `contact_handle` / `contact_type` / `inquiry_type` / `delivery_date` / `delivery_other` / `file_url` / `message` / `terms_confirmed`（留意事項への同意）/ `terms_version`（留意事項の版。現在 `2026-08-31`）

- 料金シミュレーターから問い合わせると、見積もりJSON（`quote`）も一緒に送られ、Discordに「見積もり（シミュレーター）」として表示される
- **項目を変える時は**、ラベル・placeholder/autocomplete・FormData・APIのDiscord表示名（route.ts 冒頭のラベル表）を一緒に直す
- `/notes` の内容を変えたら `terms_version` の日付を更新する

---

## 環境変数

| 変数名 | 用途 | 設定場所 |
|--------|------|----------|
| `DISCORD_WEBHOOK_URL` | フォーム通知先 | wrangler secret |
| `MICROCMS_API_KEY` | microCMS APIキー | wrangler secret（ローカルは `.env.local`） |
| `MICROCMS_SERVICE_DOMAIN` | `mila-blog` | `wrangler.jsonc` の `vars`（secretではない） |

`.env.local` はgit管理外。無い環境では `/blog` だけ取得に失敗するが、これは想定どおりでバグではない。値を推測して埋めない。

---

## デプロイ方法

```bash
npm run dev          # ローカル確認 http://localhost:3000
```

本番反映は**MiLaの承認を取ってから**、次の順で行う。

```bash
npx wrangler whoami  # Cloudflareアカウントの確認
npm run build:cf     # Next.jsビルド + OpenNextビルド
npx wrangler deploy  # Cloudflareに反映
```

**反映の前に `npm run preview` で確認する**（Cloudflare と同じ仕組みで手元で動く）。`npm run dev` は普通の Node.js で動くので、Cloudflare でだけ起きる問題を見落とす。

反映後、キャッシュを回避して公開ページを確認する（ローカルのビルドが通っただけで「反映済み」と言わない）。

**OpenNext のキャッシュは未設定**（`open-next.config.ts` が初期設定のまま）。そのため全ページがアクセスのたびに作られる。`export const dynamicParams = false` を使うと、ビルド時に作ったページが読めずに404になる（2026-09-18 に `/works/<カテゴリ>` で発生）。
Worker名: `genomersive-studio-next`（旧URL `genomersive-studio-next.mila-gmstudio.workers.dev` → 308で本番ドメインへ転送）

### git の状態について（2026-09-18時点）

公開中のサイト（2026-09-13 ビルド）は、コミット `5f51c78 Snapshot the live site as the working baseline` として記録済み。**今後の更新はこのコミットから始める**。2026-09-18 に GitHub（`milagmstudio-maker/genomersive-studio-next`）へ push 済み。**このリポジトリは公開（PUBLIC）なので、秘密情報（Webhook URL・APIキーなど）はファイルに書かずに wrangler secret で管理する**。`.playwright-cli/`（確認用スクショ・ログ）と `output/` はサイト本体ではないのでコミットしていない。

---

## SEO・リダイレクト設定

- **正規ドメイン**: `https://genomersivestudio.com`（Cloudflare Registrar）
- **旧URL転送**: workers.dev → 本番ドメイン（308）。`next.config.ts` の `redirects()` に `has: [{ type: "host", ... }]` を指定して実装
- **sitemap**: `/sitemap.xml`（静的7ページ: `/` `/works` `/case/nijyuna` `/services` `/blog` `/contact` `/notes` ＋ 実績のあるカテゴリページ ＋ microCMSのブログ記事）
- **構造化データ**: `JsonLd.tsx`（Person / Organization / サービス一覧＋料金）
- **Google Search Console**: ドメインプロパティ登録済み（確認コード: `yC1SsnbYlhUxLauGhdw287HDdaywwZMntUBhEbCmPBE`）

---

## 残タスク

| タスク | 状況 | 担当 |
|--------|------|------|
| お客様の声セクション | 掲載OKの感想テキスト待ち | MiLa |
| CTAクリック計測（GAイベント） | GA導入済みだがイベント未設置 | コード作業 |
| ケーススタディ「結果の数字」「本人の声」 | テキスト待ち | MiLa + にじゅな |
| Mix版before/afterデモ音源 | 素材待ち | MiLa |

---

## 確定事項（再提案・変更しない）

- コアコピー「忘れられない音にする。」
- フォームはDiscord Webhook通知（外部フォームサービスに戻さない）
- デプロイ先は Cloudflare Workers（Vercel等に移さない）
- にじゅな関連のチャンネル構造・ブランドコンセプト
- 公開中の文言・サービス名・ビジュアルの世界観は、MiLaの明示的な依頼がない限り変えない

※ 旧版にあった「サービス呼称はMixing、『ボーカルMix』は使わない」は、現行サイトが VOCAL MIX 表記に移行済みのため削除した。

---

## プロジェクトオーナー

- **MiLa** / Genomersive Studio
- X: @mila_mixstudio / Mail: mila.gmstudio@gmail.com
- 経歴: サウンドエンジニア出身（ミキシング→録音・音響・PA）、現在ディレクター・プロデューサー
- 実績: 500件以上（TOTAL WORKS）
- プログラミング経験なし → 技術説明は例えで。コードは説明より動くものを見せる

---

## 作業者への注意

- 規則は [AGENTS.md](./AGENTS.md) が正。この文書は「現状の地図」
- 主なデータ変更ポイントは `src/data/works.ts` と `src/data/services.ts`
- 見た目を変えたら、デスクトップとスマホの両方で確認する
- Cloudflare Workers環境なので、Node.js固有API（`fs` など）はランタイムで使えない
- 背景シェーダーの作業は `.agents/skills/shader-bg-fx/SKILL.md` を使える
