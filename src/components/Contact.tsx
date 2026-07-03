"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { clearQuote, formatJPY, loadQuote, type QuoteSnapshot } from "@/lib/quote";
import { SectionLabel } from "./SectionLabel";

// 自前の受信口（/api/contact → Discord通知）。外部サービスの件数制限なし
const FORM_ENDPOINT = "/api/contact";

const CONTACT_TYPES = ["メール", "X DM", "Discord"] as const;
const INQUIRY_TYPES = [
  "Vocal Mix",
  "Para Mix",
  "OBS Audio / 配信音響設計",
  "Binaural",
  "Audio Edit / 整音",
  "Creative Direction",
  "その他相談",
] as const;
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
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    if (quote) {
      fd.append("quote", JSON.stringify(quote, null, 2));
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "送信に失敗しました");
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
        <SectionLabel
          index="005"
          kicker="GET IN TOUCH"
          title="Contact."
          lead="内容や素材が揃っていなくても大丈夫です。確認後、対応可否・金額・納期をご案内します。"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="border border-accent/50 bg-accent/[0.05] backdrop-blur-sm p-8 md:p-12 self-start"
          >
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-accent">
              <span className="inline-block h-[6px] w-[6px] bg-accent shadow-[0_0_10px_rgba(176,38,255,0.9)]" />
              MESSAGE SENT
            </div>
            <h3 className="mt-5 font-sans font-bold text-2xl md:text-3xl leading-snug">
              送信が完了しました。
            </h3>
            <p className="mt-4 text-sm md:text-base leading-loose text-foreground/90">
              ご相談ありがとうございます。内容を確認のうえ、48時間以内にご希望の連絡方法へご返信します。
              <br />
              お急ぎの場合はメールへ直接ご連絡ください。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStatus("idle")}
                className="group flex items-center justify-center gap-3 border border-white/35 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-foreground/90 hover:border-white/70 hover:text-foreground transition-all"
              >
                続けて送信する
              </button>
              <a
                href="mailto:mila.gmstudio@gmail.com"
                className="group flex items-center justify-center gap-3 border border-white/35 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-foreground/90 hover:border-white/70 hover:text-foreground transition-all"
              >
                MAIL mila.gmstudio@gmail.com
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </motion.div>
          ) : (
          <form
            onSubmit={onSubmit}
            className="space-y-8"
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

            {/* Inquiry type */}
            <Field label="ご相談の種類" required>
              <div className="flex flex-wrap gap-3">
                {INQUIRY_TYPES.map((t, i) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inquiry_type"
                      value={t}
                      defaultChecked={i === 0}
                      required
                      className="peer sr-only"
                    />
                    <span className="border border-white/35 peer-checked:border-accent peer-checked:bg-accent/[0.08] peer-checked:text-foreground px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-foreground/90 transition-colors">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-foreground/70">
                OBS Audio / 配信音響設計は、雑談・ゲーム配信・歌枠・ASMRなどに対応しています。
              </p>
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
                    <span className="border border-white/35 peer-checked:border-accent peer-checked:bg-accent/[0.08] peer-checked:text-foreground px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-foreground/90 transition-colors">
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
                    <span className="border border-white/35 peer-checked:border-accent peer-checked:bg-accent/[0.08] peer-checked:text-foreground px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-foreground/90 transition-colors">
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

            {/* File URL */}
            <Field label="ファイル共有URL">
              <input
                type="url"
                name="file_url"
                placeholder="https://drive.google.com/... / https://www.dropbox.com/... など"
                className={inputCls}
              />
              <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-foreground/70">
                ※ Google Drive / Dropbox / ギガファイル便 等の共有リンクをご利用ください
              </p>
            </Field>

            {/* Message */}
            <Field label="ご相談内容" required>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="ご依頼内容、楽曲の方向性、ご希望の仕上がりイメージなど、お気軽にどうぞ。"
                className={`${inputCls} resize-y min-h-[120px]`}
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
                    ? "border-white/30 text-foreground/60"
                    : "border-accent bg-accent/10 text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)]"
                )}
              >
                {status === "submitting" ? "SENDING..." : "SEND MESSAGE"}
                {status !== "submitting" && (
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                )}
              </button>

              {status === "error" && (
                <p className="mt-4 font-mono text-xs tracking-[0.2em] text-red-400">
                  × {errorMsg}
                </p>
              )}

              <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-foreground/75">
                ✓ 48時間以内にご返信します
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-foreground/60">
                いただいた内容は、ご依頼・ご相談への対応以外には使用しません。
              </p>
            </div>
          </form>
          )}

          {/* Side: quote summary + direct contacts */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {quote && quote.plans.length > 0 && (
              <div className="border border-accent/40 bg-accent/[0.04] backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/30 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground">
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
                      <span className="truncate text-foreground">{p.name}</span>
                      <span className="font-mono text-foreground shrink-0">
                        {p.subtotal === 0 ? "個別相談" : formatJPY(p.subtotal)}
                      </span>
                    </div>
                  ))}
                  {quote.addons.map((a) => (
                    <div key={a.id} className="flex justify-between text-foreground/90 text-xs">
                      <span>+ {a.name}</span>
                      <span className="font-mono">{formatJPY(a.price)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/30 flex justify-between items-baseline">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/85">
                      TOTAL
                    </span>
                    <span className="font-sans text-xl font-bold tabular-nums">
                      {quote.total === 0 ? "個別相談" : formatJPY(quote.total)}
                      {quote.total > 0 && (
                        <span className="ml-1 text-sm font-normal text-foreground/80">〜</span>
                      )}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-foreground/70 pt-1">
                    送信時に内容が自動で添付されます
                  </p>
                </div>
              </div>
            )}

            {/* Direct contacts */}
            <div className="border border-white/35 bg-black/40 backdrop-blur-sm">
              <div className="border-b border-white/30 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/90">
                DIRECT
              </div>
              <ul className="p-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/75 w-20 shrink-0 pt-[2px]">
                    MAIL
                  </span>
                  <a
                    href="mailto:mila.gmstudio@gmail.com"
                    className="text-foreground/95 hover:text-accent break-all transition-colors"
                  >
                    mila.gmstudio@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/75 w-20 shrink-0 pt-[2px]">
                    X
                  </span>
                  <a
                    href="https://x.com/mila_mixstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/95 hover:text-accent transition-colors"
                  >
                    @mila_mixstudio
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/75 w-20 shrink-0 pt-[2px]">
                    DISCORD ID
                  </span>
                  <span className="text-foreground/95">mila_mix</span>
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
  "w-full bg-black/40 border border-white/35 focus:border-accent focus:outline-none focus:bg-black/60 px-4 py-3 text-foreground placeholder:text-foreground/60 transition-colors";

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
      <label className="block font-mono text-[11px] tracking-[0.3em] text-foreground/90 mb-3">
        {label}
        {required && <span className="text-accent ml-2">*</span>}
      </label>
      {children}
    </div>
  );
}
