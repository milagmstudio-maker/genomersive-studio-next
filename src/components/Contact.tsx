"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { clearQuote, formatJPY, loadQuote, type QuoteSnapshot } from "@/lib/quote";

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

const FLOW = [
  "フォームから相談内容を送信",
  "通常24時間以内を目安にご返信",
  "内容を確認し、金額と納期をご案内",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [quote, setQuote] = useState<QuoteSnapshot | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setQuote(loadQuote()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (quote) {
      formData.append("quote", JSON.stringify(quote, null, 2));
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? "送信に失敗しました");
      }
      setStatus("success");
      form.reset();
      clearQuote();
      setQuote(null);
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "送信に失敗しました");
    }
  };

  return (
    <section id="contact" className="relative z-10 px-5 py-28 sm:px-8 md:py-36 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(560px,1.28fr)] lg:gap-20">
          <aside className="self-start lg:sticky lg:top-24">
            <p className="font-mono text-[10px] tracking-[0.34em] text-accent-cyan">
              005 / GET IN TOUCH
            </p>
            <h1 className="mt-6 font-serif text-[clamp(4.5rem,11vw,8.75rem)] font-medium leading-[0.72] tracking-[-0.055em] text-foreground">
              Contact.
            </h1>
            <p className="mt-10 max-w-md font-mincho text-xl leading-[1.9] tracking-[0.06em] text-foreground md:text-2xl">
              音源や素材が揃っていなくても大丈夫です。
            </p>
            <p className="mt-4 max-w-md text-sm leading-8 text-foreground/75 md:text-base">
              相談だけ・見積もりだけでも、ここからご連絡ください。
            </p>

            <div className="mt-12 border-t border-white/15 pt-7">
              <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/55">
                HOW IT WORKS
              </p>
              <ol className="mt-6 space-y-5">
                {FLOW.map((item, index) => (
                  <li key={item} className="grid grid-cols-[32px_1fr] gap-3 text-sm leading-6 text-foreground/80">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-accent-text">
                      0{index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 border-t border-white/15 pt-7">
              <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/55">
                DIRECT
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="grid grid-cols-[88px_1fr] gap-3">
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-foreground/50">MAIL</dt>
                  <dd>
                    <a className="break-all text-foreground/85 transition-colors hover:text-accent-cyan" href="mailto:mila.gmstudio@gmail.com">
                      mila.gmstudio@gmail.com
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[88px_1fr] gap-3">
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-foreground/50">X</dt>
                  <dd>
                    <a className="text-foreground/85 transition-colors hover:text-accent-cyan" href="https://x.com/mila_mixstudio" target="_blank" rel="noopener noreferrer">
                      @mila_mixstudio
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[88px_1fr] gap-3">
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-foreground/50">DISCORD</dt>
                  <dd className="text-foreground/85">mila_mix</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="min-w-0">
            {status === "success" ? (
              <SuccessPanel onReset={() => setStatus("idle")} />
            ) : (
              <>
                {quote && quote.plans.length > 0 && (
                  <QuoteSummary quote={quote} onClear={() => {
                    clearQuote();
                    setQuote(null);
                  }} />
                )}

                <form onSubmit={onSubmit} className="border border-white/15 bg-[#060b15]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:p-8 md:p-10">
                  <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
                  <input type="hidden" name="terms_version" value="2026-08-31" />

                  <div className="flex items-center justify-between gap-5 border-b border-white/15 pb-5">
                    <p className="font-mono text-[10px] tracking-[0.28em] text-foreground/55">INQUIRY FORM</p>
                    <p className="text-xs text-foreground/55"><span className="text-accent-text">*</span> 必須項目</p>
                  </div>

                  <div className="mt-8 space-y-8">
                    <Field htmlFor="f-name" label="活動名" required>
                      <input id="f-name" type="text" name="name" required autoComplete="nickname" placeholder="活動名を入力" className={inputCls} />
                    </Field>

                    <Field htmlFor="f-email" label="メールアドレス" required>
                      <input id="f-email" type="email" name="email" required autoComplete="email" inputMode="email" placeholder="you@example.com" className={inputCls} />
                    </Field>

                    <FieldGroup label="ご希望の連絡方法" required>
                      <ChoiceGrid>
                        {CONTACT_TYPES.map((type, index) => (
                          <Choice key={type} name="contact_type" value={type} defaultChecked={index === 0} required>
                            {type}
                          </Choice>
                        ))}
                      </ChoiceGrid>
                      <input type="text" name="contact_handle" autoComplete="off" aria-label="XまたはDiscordの連絡先" placeholder="X / Discord ID（メール以外を選んだ場合）" className={`${inputCls} mt-3`} />
                    </FieldGroup>

                    <Field htmlFor="f-inquiry-type" label="ご相談の種類" required>
                      <select id="f-inquiry-type" name="inquiry_type" required defaultValue="" className={`${inputCls} cursor-pointer`}>
                        <option value="" disabled>選択してください</option>
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <p className="mt-3 text-xs leading-6 text-foreground/60">
                        OBS Audio / 配信音響設計は、雑談・ゲーム配信・歌枠・ASMRなどに対応しています。
                      </p>
                    </Field>

                    <FieldGroup label="希望納期">
                      <label htmlFor="f-delivery-date" className="mb-2 block text-xs leading-6 text-foreground/60">希望日を選択</label>
                      <input id="f-delivery-date" type="date" name="delivery_date" className={`${inputCls} [color-scheme:dark]`} />
                      <label className="mt-3 flex min-h-12 cursor-pointer items-center gap-3 border border-white/20 px-4 text-sm text-foreground/70 transition-colors hover:border-white/40">
                        <input type="checkbox" name="delivery_other" value="その他（ご相談内容に記載）" className="h-4 w-4 shrink-0 accent-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-cyan" />
                        <span>その他（納期が未定・個別に相談したい）</span>
                      </label>
                      <p className="mt-3 text-xs leading-6 text-foreground/55">具体的な条件がある場合は、ご相談内容に記載してください。</p>
                    </FieldGroup>

                    <Field htmlFor="f-file" label="音源・素材の共有URL">
                      <input id="f-file" type="url" name="file_url" autoComplete="url" inputMode="url" placeholder="Google Drive / Dropbox / ギガファイル便など" className={inputCls} />
                      <p className="mt-2 text-xs leading-6 text-foreground/55">ファイルそのものではなく、共有リンクを入力してください。</p>
                    </Field>

                    <Field htmlFor="f-message" label="ご相談内容" required>
                      <textarea id="f-message" name="message" required rows={7} placeholder="ご依頼内容、楽曲の方向性、ご希望の仕上がりイメージなどをお書きください。" className={`${inputCls} min-h-[160px] resize-y`} />
                    </Field>

                    <div className="border-y border-white/15 py-6">
                      <a href="/notes" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-mono text-[11px] tracking-[0.18em] text-accent-cyan underline decoration-white/25 underline-offset-4 transition-colors hover:text-foreground">
                        ご依頼に関する留意事項 ↗
                      </a>
                      <label className="mt-3 flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-7 text-foreground/75">
                        <input type="checkbox" name="terms_confirmed" value="confirmed" required className="peer mt-1.5 h-4 w-4 shrink-0 accent-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-cyan" />
                        <span className="peer-checked:text-foreground">
                          留意事項を確認しました。正式なご依頼条件は、お見積もり時にご案内します。
                        </span>
                      </label>
                    </div>

                    <div>
                      <button type="submit" disabled={status === "submitting"} className={cn("group flex min-h-14 w-full items-center justify-between border px-5 font-mono text-[11px] tracking-[0.24em] transition-colors sm:px-6", status === "submitting" ? "cursor-wait border-white/20 text-foreground/45" : "border-accent bg-accent/10 text-foreground hover:bg-accent hover:text-white") }>
                        <span>{status === "submitting" ? "送信しています..." : "相談内容を送る"}</span>
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                      </button>

                      <div aria-live="polite">
                        {status === "error" && (
                          <p role="alert" className="mt-4 border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200">
                            {errorMsg} 入力内容をご確認のうえ、もう一度お試しください。
                          </p>
                        )}
                      </div>

                      <p className="mt-5 text-sm leading-7 text-foreground/70">通常24時間以内を目安にご返信します。</p>
                      <p className="mt-2 text-xs leading-6 text-foreground/50">
                        ご入力いただいた情報は、ご相談への回答・お見積もり・制作進行のためにのみ使用します。
                      </p>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="border border-accent/50 bg-[#060b15]/95 p-7 sm:p-10 md:p-12">
      <p className="font-mono text-[10px] tracking-[0.3em] text-accent-cyan">MESSAGE SENT</p>
      <h2 className="mt-7 font-mincho text-2xl leading-relaxed tracking-[0.05em] md:text-3xl">送信が完了しました。</h2>
      <p className="mt-5 text-sm leading-8 text-foreground/75 md:text-base">
        ご相談ありがとうございます。内容を確認のうえ、通常24時間以内を目安にご希望の連絡方法へご返信します。
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onReset} className="min-h-12 border border-white/25 px-5 font-mono text-[10px] tracking-[0.2em] text-foreground/80 transition-colors hover:border-white/60 hover:text-foreground">
          続けて送信する
        </button>
        <a href="mailto:mila.gmstudio@gmail.com" className="flex min-h-12 items-center justify-center border border-white/25 px-5 font-mono text-[10px] tracking-[0.16em] text-foreground/80 transition-colors hover:border-white/60 hover:text-foreground">
          MAIL mila.gmstudio@gmail.com
        </a>
      </div>
    </motion.div>
  );
}

function QuoteSummary({ quote, onClear }: { quote: QuoteSnapshot; onClear: () => void }) {
  return (
    <div className="mb-6 border border-accent/40 bg-accent/[0.05]">
      <div className="flex items-center justify-between border-b border-white/15 px-5 py-3">
        <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/70">QUOTE / FROM SIMULATOR</p>
        <button type="button" onClick={onClear} className="min-h-11 min-w-11 text-foreground/55 transition-colors hover:text-foreground" aria-label="見積もり内容を外す">×</button>
      </div>
      <div className="space-y-3 p-5 text-sm">
        {quote.plans.map((plan) => (
          <div key={plan.id} className="flex justify-between gap-4">
            <span className="text-foreground/85">{plan.name}</span>
            <span className="shrink-0 font-mono text-foreground">{plan.subtotal === 0 ? "個別相談" : formatJPY(plan.subtotal)}</span>
          </div>
        ))}
        {quote.addons.map((addon) => (
          <div key={addon.id} className="flex justify-between gap-4 text-xs text-foreground/65">
            <span>+ {addon.name}</span>
            <span className="shrink-0 font-mono">{formatJPY(addon.price)}</span>
          </div>
        ))}
        <div className="flex items-baseline justify-between border-t border-white/15 pt-4">
          <span className="font-mono text-[10px] tracking-[0.24em] text-foreground/55">TOTAL</span>
          <span className="font-sans text-xl font-semibold tabular-nums">
            {quote.total === 0 ? "個別相談" : formatJPY(quote.total)}
            {quote.total > 0 && <span className="ml-1 text-xs font-normal text-foreground/55">〜</span>}
          </span>
        </div>
        <p className="text-xs text-foreground/50">送信時にこの内容を自動で添付します。</p>
      </div>
    </div>
  );
}

const inputCls = "min-h-12 w-full border border-white/20 bg-black/30 px-4 py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors hover:border-white/35 focus:border-accent focus:bg-black/50 focus:outline-none";
const labelCls = "mb-3 block font-mono text-[10px] tracking-[0.22em] text-foreground/70";

function Field({ htmlFor, label, required, children }: { htmlFor: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>{label}{required && <span className="ml-2 text-accent-text">*</span>}</label>
      {children}
    </div>
  );
}

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className={labelCls}>{label}{required && <span className="ml-2 text-accent-text">*</span>}</legend>
      {children}
    </fieldset>
  );
}

function ChoiceGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2 sm:grid-cols-2">{children}</div>;
}

function Choice({ name, value, defaultChecked, required, children }: { name: string; value: string; defaultChecked?: boolean; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} required={required} className="peer sr-only" />
      <span className="flex min-h-12 items-center border border-white/20 px-4 text-sm leading-5 text-foreground/65 transition-colors hover:border-white/40 peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-foreground peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-cyan">
        {children}
      </span>
    </label>
  );
}
