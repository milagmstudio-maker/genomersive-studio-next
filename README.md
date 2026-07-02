# Genomersive Studio — mila-site

MiLa（Genomersive Studio）のポートフォリオ兼依頼窓口サイト。

作業を始める前に [HANDOFF.md](./HANDOFF.md) を読んでください。技術スタック、
ファイル構成、データ更新方法、デプロイ手順、変更禁止事項がまとまっています。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` で確認できます。

ブログ（`/blog`）は microCMS 連携のため `.env.local` が必要です（未設定でも
他のページは問題なく動きます）。詳細は HANDOFF.md 参照。

## デプロイ

Vercel ではなく **Cloudflare Workers** にデプロイします。

```bash
npm run build:cf
npx wrangler deploy
```
