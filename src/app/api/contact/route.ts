import { NextResponse } from "next/server";

// フォーム受信 → Discord Webhook へ通知する自前エンドポイント。
// 外部フォームサービス（Formspree等）の件数制限を受けないための実装。

const FIELD_LABELS: Record<string, string> = {
  name: "お名前",
  email: "メールアドレス",
  inquiry_type: "ご相談の種類",
  contact_type: "ご希望の連絡方法",
  contact_handle: "X / Discord ID",
  delivery_hope: "希望納期",
  reference_url: "参考音源URL",
  file_url: "ファイル共有URL",
};

// Discord embed の field value は1024文字まで
function clip(s: string, max = 1000) {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  // honeypot — botは静かに成功扱いにして捨てる
  if (String(fd.get("_gotcha") ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "必須項目が入力されていません" },
      { status: 400 }
    );
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { error: "送信先が未設定です。お手数ですがXのDMかメールでご連絡ください。" },
      { status: 500 }
    );
  }

  const fields = Object.entries(FIELD_LABELS)
    .map(([key, label]) => {
      const v = String(fd.get(key) ?? "").trim();
      return v ? { name: label, value: clip(v), inline: key !== "name" && key !== "email" ? true : false } : null;
    })
    .filter((f): f is { name: string; value: string; inline: boolean } => !!f);

  // 料金シミュレーターからの見積もりが添付されていれば整形して追加
  const quoteRaw = String(fd.get("quote") ?? "").trim();
  if (quoteRaw) {
    try {
      const q = JSON.parse(quoteRaw) as {
        plans?: { name: string; subtotal: number }[];
        addons?: { name: string; price: number }[];
        total?: number;
      };
      const lines = [
        ...(q.plans ?? []).map((p) => `${p.name}: ¥${p.subtotal.toLocaleString()}`),
        ...(q.addons ?? []).map((a) => `+ ${a.name}: ¥${a.price.toLocaleString()}`),
        q.total != null ? `TOTAL: ¥${q.total.toLocaleString()}〜` : "",
      ].filter(Boolean);
      if (lines.length > 0) {
        fields.push({ name: "見積もり（シミュレーター）", value: clip(lines.join("\n")), inline: false });
      }
    } catch {
      // 壊れたJSONは無視（通知自体は止めない）
    }
  }

  const payload = {
    username: "Genomersive Studio — Contact",
    embeds: [
      {
        title: "新しいお問い合わせ",
        color: 0xb026ff,
        fields,
        description: clip(message, 3800),
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "送信に失敗しました。時間をおいて再度お試しください。" },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
