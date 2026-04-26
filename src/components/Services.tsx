"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ADDONS,
  DELIVERIES,
  DISCOUNTS,
  PLANS,
  type Plan,
} from "@/data/services";
import { cn } from "@/lib/cn";
import { formatJPY, saveQuote } from "@/lib/quote";
import { SectionLabel } from "./SectionLabel";

type Category = Plan["category"];

const CATEGORY_LABELS: { key: Category; jp: string }[] = [
  { key: "VOCAL MIX", jp: "ボーカルMix" },
  { key: "PARA MIX", jp: "パラMix（ステム）" },
  { key: "OBS AUDIO", jp: "OBS音響調整" },
  { key: "PRODUCTION", jp: "プロデュース" },
];

export function Services() {
  const router = useRouter();

  // One plan per category; null if nothing selected
  const [selectedByCategory, setSelectedByCategory] = useState<
    Record<Category, string | null>
  >({
    "VOCAL MIX": null,
    "PARA MIX": null,
    "OBS AUDIO": null,
    PRODUCTION: null,
  });

  const [units, setUnits] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    PLANS.forEach((p) => {
      if (p.extra) init[p.id] = p.extra.defaultUnits;
    });
    return init;
  });

  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [deliveryId, setDeliveryId] = useState(DELIVERIES[0].id);
  const [discountId, setDiscountId] = useState(DISCOUNTS[0].id);

  const calc = useMemo(() => {
    const planLines = (Object.entries(selectedByCategory) as [Category, string | null][])
      .flatMap(([, planId]) => {
        if (!planId) return [];
        const plan = PLANS.find((p) => p.id === planId);
        if (!plan) return [];
        let subtotal = plan.basePrice;
        const u = units[plan.id] ?? plan.extra?.defaultUnits ?? 0;
        if (plan.extra) {
          const extraUnits = Math.max(0, u - plan.extra.includedUnits);
          subtotal += extraUnits * plan.extra.pricePerUnit;
        }
        return [{
          id: plan.id,
          name: plan.name,
          category: plan.category,
          units: u,
          subtotal,
          recurring: plan.recurring,
        }];
      });

    const addonLines = ADDONS.filter((a) => addons[a.id]).map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
    }));
    const delivery = DELIVERIES.find((d) => d.id === deliveryId)!;
    const discount = DISCOUNTS.find((d) => d.id === discountId)!;

    const planSum = planLines.reduce((s, l) => s + l.subtotal, 0);
    const addonSum = addonLines.reduce((s, l) => s + l.price, 0);
    const beforeDiscount = planSum + addonSum + delivery.surcharge;
    const afterDiscount =
      discount.type === "fixed"
        ? Math.max(0, beforeDiscount - discount.value)
        : Math.round(beforeDiscount * (1 - discount.value));

    return {
      planLines,
      addonLines,
      delivery,
      discount,
      total: afterDiscount,
      hasSelection: planLines.length > 0,
    };
  }, [selectedByCategory, units, addons, deliveryId, discountId]);

  const togglePlan = (plan: Plan) => {
    setSelectedByCategory((s) => ({
      ...s,
      [plan.category]: s[plan.category] === plan.id ? null : plan.id,
    }));
  };

  const setPlanUnits = (planId: string, n: number) => {
    setUnits((s) => ({ ...s, [planId]: n }));
  };

  const goToContact = () => {
    saveQuote({
      plans: calc.planLines,
      addons: calc.addonLines,
      delivery: { id: calc.delivery.id, name: calc.delivery.name, surcharge: calc.delivery.surcharge },
      discount: {
        id: calc.discount.id,
        name: calc.discount.name,
        description: calc.discount.description,
      },
      total: calc.total,
    });
    router.push("/contact");
  };

  // Build section list (numbered)
  const sections = CATEGORY_LABELS.map((c) => ({
    kind: "plans" as const,
    key: c.key,
    enLabel: c.key,
    jpLabel: c.jp,
    plans: PLANS.filter((p) => p.category === c.key),
  }));

  let stepIdx = 0;
  const stepNo = () => String(++stepIdx).padStart(2, "0");

  return (
    <section
      id="services"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="003" kicker="PRICING SIMULATOR" title="Services." />

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Selection panel */}
          <div className="space-y-20">
            {sections.map((s) => (
              <Step key={s.key} no={stepNo()} en={s.enLabel} jp={s.jpLabel}>
                <TileGrid>
                  {s.plans.map((p) => {
                    const selected = selectedByCategory[s.key] === p.id;
                    return (
                      <PlanTile
                        key={p.id}
                        plan={p}
                        selected={selected}
                        units={units[p.id] ?? p.extra?.defaultUnits ?? 0}
                        onToggle={() => togglePlan(p)}
                        onUnits={(n) => setPlanUnits(p.id, n)}
                      />
                    );
                  })}
                </TileGrid>
              </Step>
            ))}

            <Step no={stepNo()} en="ADD-ONS" jp="オプション">
              <TileGrid>
                {ADDONS.map((a) => {
                  const checked = !!addons[a.id];
                  return (
                    <Tile
                      key={a.id}
                      selected={checked}
                      onClick={() =>
                        setAddons((s) => ({ ...s, [a.id]: !s[a.id] }))
                      }
                      title={a.name}
                      priceLabel={`+${formatJPY(a.price)}`}
                      description={a.description}
                    />
                  );
                })}
              </TileGrid>
            </Step>

            <Step no={stepNo()} en="DELIVERY" jp="納期">
              <TileGrid cols={4}>
                {DELIVERIES.map((d) => (
                  <Tile
                    key={d.id}
                    selected={deliveryId === d.id}
                    onClick={() => setDeliveryId(d.id)}
                    title={d.name}
                    priceLabel={d.surcharge > 0 ? `+${formatJPY(d.surcharge)}` : "—"}
                    description={d.description}
                  />
                ))}
              </TileGrid>
            </Step>

            <Step no={stepNo()} en="DISCOUNT" jp="割引">
              <TileGrid cols={3}>
                {DISCOUNTS.map((d) => (
                  <Tile
                    key={d.id}
                    selected={discountId === d.id}
                    onClick={() => setDiscountId(d.id)}
                    title={d.name}
                    priceLabel={d.description || "—"}
                    description=""
                  />
                ))}
              </TileGrid>
            </Step>
          </div>

          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              layout
              className="border border-white/15 bg-black/60 backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-foreground/60">
                <span>QUOTE / SUMMARY</span>
                <span>EST.</span>
              </div>

              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {!calc.hasSelection ? (
                  <p className="font-mono text-xs tracking-[0.2em] text-foreground/40 text-center py-8">
                    プランを選択してください
                  </p>
                ) : (
                  <>
                    {calc.planLines.map((l) => (
                      <div key={l.id} className="flex justify-between gap-3 text-sm">
                        <div className="min-w-0">
                          <p className="truncate">{l.name}</p>
                          <p className="font-mono text-[10px] tracking-[0.15em] text-foreground/45">
                            {l.category}
                            {l.recurring === "monthly" ? " / monthly" : ""}
                          </p>
                        </div>
                        <p className="shrink-0 font-mono text-foreground/85">
                          {formatJPY(l.subtotal)}
                        </p>
                      </div>
                    ))}

                    {calc.addonLines.length > 0 && (
                      <div className="border-t border-white/10 pt-4 space-y-2">
                        {calc.addonLines.map((a) => (
                          <div key={a.id} className="flex justify-between text-sm">
                            <span className="text-foreground/70">+ {a.name}</span>
                            <span className="font-mono text-foreground/70">
                              {formatJPY(a.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">納期</span>
                        <span className="font-mono">
                          {calc.delivery.surcharge > 0
                            ? `+${formatJPY(calc.delivery.surcharge)}`
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">割引</span>
                        <span className="font-mono">
                          {calc.discount.description || "—"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-white/15 p-5 bg-black/40">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/55">
                    TOTAL
                  </span>
                  <span className="font-sans text-3xl font-bold tabular-nums">
                    {formatJPY(calc.total)}
                    {calc.hasSelection && (
                      <span className="ml-1 text-base font-normal text-foreground/50">〜</span>
                    )}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-foreground/40">
                  ※ 表示価格は概算です。実額はヒアリング後にご提案します。
                </p>

                <button
                  onClick={goToContact}
                  disabled={!calc.hasSelection}
                  className={cn(
                    "mt-5 group flex w-full items-center justify-center gap-3 border px-5 py-3 font-mono text-[11px] tracking-[0.3em] transition-all",
                    calc.hasSelection
                      ? "border-accent bg-accent/10 text-foreground hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.4)]"
                      : "border-white/10 text-foreground/30 cursor-not-allowed"
                  )}
                >
                  GET A CART
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Step({
  no,
  en,
  jp,
  children,
}: {
  no: string;
  en: string;
  jp: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex items-end justify-between border-b border-white/10 pb-4 mb-8">
        <div className="flex items-baseline gap-5">
          <span
            className="font-serif italic text-3xl md:text-4xl tracking-tight"
            style={{ color: "var(--accent-cyan)" }}
          >
            {no}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-[0.3em] text-foreground/85">
              {en}
            </span>
            <span className="font-sans text-[11px] text-foreground/45">{jp}</span>
          </div>
        </div>
        <span
          aria-hidden
          className="inline-block h-3 w-3"
          style={{
            background: "var(--accent-cyan)",
            boxShadow: "0 0 10px rgba(46,255,213,0.7)",
          }}
        />
      </header>
      {children}
    </div>
  );
}

function TileGrid({
  children,
  cols = 4,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const colsCls =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-4";
  return <div className={cn("grid gap-4", colsCls)}>{children}</div>;
}

function Tile({
  selected,
  onClick,
  title,
  priceLabel,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  priceLabel: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative text-left border p-5 transition-all",
        selected
          ? "border-accent bg-accent/[0.07] shadow-[0_0_20px_rgba(176,38,255,0.25)]"
          : "border-white/10 hover:border-white/30 bg-black/20"
      )}
    >
      {/* Selected indicator */}
      <span
        aria-hidden
        className={cn(
          "absolute top-3 right-3 inline-block h-[6px] w-[6px] transition-opacity",
          selected
            ? "bg-accent shadow-[0_0_8px_rgba(176,38,255,0.9)] opacity-100"
            : "bg-foreground/25 opacity-50 group-hover:opacity-100"
        )}
      />

      <div className="font-sans font-bold leading-tight">{title}</div>
      <div className="mt-1 font-mono text-[10px] tracking-[0.18em] text-accent">
        {priceLabel}
      </div>
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-foreground/60">
          {description}
        </p>
      )}
    </button>
  );
}

function PlanTile({
  plan,
  selected,
  units,
  onToggle,
  onUnits,
}: {
  plan: Plan;
  selected: boolean;
  units: number;
  onToggle: () => void;
  onUnits: (n: number) => void;
}) {
  const priceLabel = plan.basePrice === 0
    ? "ASK"
    : `${formatJPY(plan.basePrice)}${plan.startsFrom ? "〜" : ""}${plan.recurring === "monthly" ? " / 月" : ""}`;

  return (
    <div
      className={cn(
        "relative border p-5 transition-all",
        selected
          ? "border-accent bg-accent/[0.07] shadow-[0_0_20px_rgba(176,38,255,0.25)]"
          : "border-white/10 hover:border-white/30 bg-black/20"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="group block w-full text-left"
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-3 right-3 inline-block h-[6px] w-[6px] transition-opacity",
            selected
              ? "bg-accent shadow-[0_0_8px_rgba(176,38,255,0.9)] opacity-100"
              : "bg-foreground/25 opacity-50 group-hover:opacity-100"
          )}
        />
        <div className="font-sans font-bold leading-tight">{plan.name}</div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.18em] text-accent">
          {priceLabel}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-foreground/60">
          {plan.description}
        </p>
      </button>

      {selected && plan.extra && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-foreground/55">
            {plan.extra.label}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUnits(Math.max(plan.extra!.min, units - 1))}
              className="h-7 w-7 border border-white/15 hover:border-accent hover:text-accent transition-colors font-mono"
              aria-label="decrease"
            >
              −
            </button>
            <span className="min-w-[2.5ch] text-center font-mono tabular-nums">
              {units}
            </span>
            <button
              onClick={() => onUnits(Math.min(plan.extra!.max, units + 1))}
              className="h-7 w-7 border border-white/15 hover:border-accent hover:text-accent transition-colors font-mono"
              aria-label="increase"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
