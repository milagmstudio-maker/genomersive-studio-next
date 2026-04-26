"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { clearQuote, formatJPY, loadQuote, type QuoteSnapshot } from "@/lib/quote";
import { SectionLabel } from "./SectionLabel";

const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? ""; // e.g. https://formspree.io/f/xxxxxxxx

const CONTACT_TYPES = ["メール", "X DM", "Discord"] as const;
const DELIVERY_HOPES = [
  "通常（1〜2週間）",
  "5日以降指定",
  "72時間以内",
  "24時間以内",
  "その他（本文に記載）",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [quote, setQuote] = useState<QuoteSnapshot | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setQuote(loadQuote());
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setStatus("error");
      setErrorMsg("送信先が未設定です。サイト管理者へお問い合わせください。");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    if (quote) {
      fd.append("_quote", JSON.stringify(quote, null, 2));
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message ?? "送信に失敗しました");
      }
      setStatus("success");
      form.reset();
      clearQuote();
      setQuote(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "送信に失敗しました");
    }
  };

  return (
    <section
      id="contact"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-32 md:py-40"
    >
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="005" kicker="GET IN TOUCH" title="Contact." />

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={onSubmit}
            className="space-y-8"
            encType="multipart/form-data"
          >
            {/* honeypot */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Name */}
            <Field label="お名前" required>
              <input
                type="text"
                name="name"
                required
                placeholder="山田 太郎"
                className={inputCls}
              />
            </Field>

            {/* Email */}
            <Field label="メールアドレス" required>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>

            {/* Contact preference */}
            <Field label="ご希望の連絡方法" required>
              <div className="flex flex-wrap gap-3">
                {CONTACT_TYPES.map((t, i) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contact_type"
                      value={t}
                      defaultChecked={i === 0}
                      required
                      className="peer sr-only"
                    />
                    <span className="border border-white/15 peer-checked:border-accent peer-checked:bg-accent/[0.08] peer-checked:text-foreground px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-foreground/60 transition-colors">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                name="contact_handle"
                placeholder="X / Discord ID（メール以外を選んだ場合）"
                className={`${inputCls} mt-3`}
              />
            </Field>

            {/* Delivery */}
            <Field label="希望納期">
              <div className="flex flex-wrap gap-3">
                {DELIVERY_HOPES.map((d, i) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery_hope"
                      value={d}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="border border-white/15 peer-checked:border-accent peer-checked:bg-accent/[0.08] peer-checked:text-foreground px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-foreground/60 transition-colors">
                      {d}
                    </span>
                  </label>
                ))}
              </div>
            </Field>

            {/* Reference URL */}
            <Field label="参考音源URL">
              <input
                type="url"
                name="reference_url"
                placeholder="https://..."
                className={inputCls}
              />
            </Field>

            {/* File */}
            <Field label="ファイル添付">
              <FileInput />
              <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-foreground/40">
                ※ Formspree無料プラン上限: 1ファイル / 25MB程度推奨
              </p>
            </Field>

            {/* Message */}
            <Field label="ご相談内容" required>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="ご依頼内容、楽曲の方向性、ご希望の仕上がりイメージなど、お気軽にどうぞ。"
                className={`${inputCls} resize-y`}
              />
            </Field>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  "group flex items-center justify-center gap-3 border px-8 py-3.5 font-mono text-[11px] tracking-[0.3em] transition-all",
                  status === "submitting"
                    ? "border-white/10 text-foreground/30"
                    : "border-accent bg-accent/10 text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)]"
                )}
              >
                {status === "submitting" ? "SENDING..." : "SEND MESSAGE"}
                {status !== "submitting" && (
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                )}
              </button>

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 font-mono text-xs tracking-[0.2em] text-accent"
                >
                  ✓ 送信完了しました。返信までしばらくお待ちください。
                </motion.p>
              )}
              {status === "error" && (
                <p className="mt-4 font-mono text-xs tracking-[0.2em] text-red-400">
                  × {errorMsg}
                </p>
              )}
            </div>
          </form>

          {/* Side: quote summary + direct contacts */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {quote && quote.plans.length > 0 && (
              <div className="border border-accent/40 bg-accent/[0.04] backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/70">
                  <span>QUOTE / FROM SIMULATOR</span>
                  <button
                    onClick={() => {
                      clearQuote();
                      setQuote(null);
                    }}
                    className="hover:text-accent transition-colors"
                    aria-label="Clear quote"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  {quote.plans.map((p) => (
                    <div key={p.id} className="flex justify-between gap-3">
                      <span className="truncate text-foreground/80">{p.name}</span>
                      <span className="font-mono text-foreground/70 shrink-0">
                        {formatJPY(p.subtotal)}
                      </span>
                    </div>
                  ))}
                  {quote.addons.map((a) => (
                    <div key={a.id} className="flex justify-between text-foreground/60 text-xs">
                      <span>+ {a.name}</span>
                      <span className="font-mono">{formatJPY(a.price)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/55">
                      TOTAL
                    </span>
                    <span className="font-sans text-xl font-bold tabular-nums">
                      {formatJPY(quote.total)}
                      <span className="ml-1 text-sm font-normal text-foreground/50">〜</span>
                    </span>
                  </div>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-foreground/40 pt-1">
                    送信時に内容が自動で添付されます
                  </p>
                </div>
              </div>
            )}

            {/* Direct contacts */}
            <div className="border border-white/15 bg-black/40 backdrop-blur-sm">
              <div className="border-b border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/60">
                DIRECT
              </div>
              <ul className="p-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/45 w-20 shrink-0 pt-[2px]">
                    MAIL
                  </span>
                  <a
                    href="mailto:mila.gmstudio@gmail.com"
                    className="text-foreground/85 hover:text-accent break-all transition-colors"
                  >
                    mila.gmstudio@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/45 w-20 shrink-0 pt-[2px]">
                    X
                  </span>
                  <a
                    href="https://x.com/mila_mixstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/85 hover:text-accent transition-colors"
                  >
                    @mila_mixstudio
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/45 w-20 shrink-0 pt-[2px]">
                    DISCORD ID
                  </span>
                  <span className="text-foreground/85">mila_mix</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full bg-black/40 border border-white/15 focus:border-accent focus:outline-none focus:bg-black/60 px-4 py-3 text-foreground placeholder:text-foreground/30 transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] tracking-[0.3em] text-foreground/60 mb-3">
        {label}
        {required && <span className="text-accent ml-2">*</span>}
      </label>
      {children}
    </div>
  );
}

function FileInput() {
  const [name, setName] = useState<string>("");
  return (
    <label className="flex items-center gap-3 border border-dashed border-white/20 hover:border-accent/60 px-4 py-4 cursor-pointer transition-colors">
      <input
        type="file"
        name="attachment"
        className="sr-only"
        onChange={(e) => setName(e.currentTarget.files?.[0]?.name ?? "")}
      />
      <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/55">
        {name ? "✓ " + name : "+ ファイルを選択"}
      </span>
    </label>
  );
}
