"use client";

import { motion } from "framer-motion";
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

type SelectedPlans = Record<string, { selected: boolean; units: number }>;

export function Services() {
  const [plans, setPlans] = useState<SelectedPlans>(() => {
    const init: SelectedPlans = {};
    PLANS.forEach((p) => {
      init[p.id] = { selected: false, units: p.extra?.defaultUnits ?? 0 };
    });
    return init;
  });
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [deliveryId, setDeliveryId] = useState(DELIVERIES[0].id);
  const [discountId, setDiscountId] = useState(DISCOUNTS[0].id);

  const calc = useMemo(() => {
    const planLines = PLANS.flatMap((p) => {
      const s = plans[p.id];
      if (!s?.selected) return [];
      let subtotal = p.basePrice;
      if (p.extra) {
        const extraUnits = Math.max(0, s.units - p.extra.includedUnits);
        subtotal += extraUnits * p.extra.pricePerUnit;
      }
      return [{
        id: p.id,
        name: p.name,
        category: p.category,
        units: s.units,
        subtotal,
        recurring: p.recurring,
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
  }, [plans, addons, deliveryId, discountId]);

  const togglePlan = (id: string) =>
    setPlans((s) => ({ ...s, [id]: { ...s[id], selected: !s[id].selected } }));
  const setUnits = (id: string, units: number) =>
    setPlans((s) => ({ ...s, [id]: { ...s[id], units } }));

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
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Group plans by category
  const groups: Array<{ key: string; label: string; plans: Plan[] }> = [
    { key: "VOCAL MIX", label: "VOCAL MIX", plans: PLANS.filter((p) => p.category === "VOCAL MIX") },
    { key: "PARA MIX", label: "PARA MIX", plans: PLANS.filter((p) => p.category === "PARA MIX") },
    { key: "OBS AUDIO", label: "OBS AUDIO", plans: PLANS.filter((p) => p.category === "OBS AUDIO") },
    { key: "PRODUCTION", label: "PRODUCTION", plans: PLANS.filter((p) => p.category === "PRODUCTION") },
  ];

  return (
    <section
      id="services"
      className="relative z-10 px-6 md:px-12 lg:px-20 py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="003" kicker="PRICING SIMULATOR" title="Services." />

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Selection panel */}
          <div className="space-y-12">
            {groups.map((g) => (
              <div key={g.key}>
                <h3 className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-foreground/60">
                  <span className="inline-block h-[3px] w-[3px] bg-accent shadow-[0_0_6px_rgba(176,38,255,0.8)]" />
                  {g.label}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {g.plans.map((p) => (
                    <PlanCheckbox
                      key={p.id}
                      plan={p}
                      selected={plans[p.id].selected}
                      units={plans[p.id].units}
                      onToggle={() => togglePlan(p.id)}
                      onUnits={(u) => setUnits(p.id, u)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Add-ons */}
            <div>
              <h3 className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-foreground/60">
                <span className="inline-block h-[3px] w-[3px] bg-accent shadow-[0_0_6px_rgba(176,38,255,0.8)]" />
                ADD-ONS
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {ADDONS.map((a) => (
                  <label
                    key={a.id}
                    className={cn(
                      "block border p-4 transition-colors",
                      addons[a.id]
                        ? "border-accent bg-accent/[0.06]"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <CheckboxBox checked={!!addons[a.id]} />
                      <div>
                        <p className="font-sans font-medium leading-tight">{a.name}</p>
                        <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-accent">
                          +{formatJPY(a.price)}
                        </p>
                        <p className="mt-2 text-xs text-foreground/55 leading-snug">
                          {a.description}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={!!addons[a.id]}
                      onChange={(e) =>
                        setAddons((s) => ({ ...s, [a.id]: e.target.checked }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-foreground/60">
                <span className="inline-block h-[3px] w-[3px] bg-accent shadow-[0_0_6px_rgba(176,38,255,0.8)]" />
                DELIVERY
              </h3>
              <div className="grid gap-3 sm:grid-cols-4">
                {DELIVERIES.map((d) => (
                  <label
                    key={d.id}
                    className={cn(
                      "block cursor-pointer border p-3 text-center transition-colors",
                      deliveryId === d.id
                        ? "border-accent bg-accent/[0.06]"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name="delivery"
                      checked={deliveryId === d.id}
                      onChange={() => setDeliveryId(d.id)}
                    />
                    <p className="font-sans text-sm font-medium">{d.name}</p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-foreground/55">
                      {d.description}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div>
              <h3 className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-foreground/60">
                <span className="inline-block h-[3px] w-[3px] bg-accent shadow-[0_0_6px_rgba(176,38,255,0.8)]" />
                DISCOUNT
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {DISCOUNTS.map((d) => (
                  <label
                    key={d.id}
                    className={cn(
                      "block cursor-pointer border p-3 text-center transition-colors",
                      discountId === d.id
                        ? "border-accent bg-accent/[0.06]"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name="discount"
                      checked={discountId === d.id}
                      onChange={() => setDiscountId(d.id)}
                    />
                    <p className="font-sans text-sm font-medium">{d.name}</p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-foreground/55">
                      {d.description || "—"}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              layout
              className="border border-white/15 bg-black/60 backdrop-blur-md"
            >
              {/* Header — file style */}
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

function PlanCheckbox({
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
        "border p-4 transition-colors",
        selected
          ? "border-accent bg-accent/[0.06]"
          : "border-white/10 hover:border-white/30"
      )}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <CheckboxBox checked={selected} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-sans font-medium leading-tight">{plan.name}</p>
            <p className="shrink-0 font-mono text-[11px] tracking-[0.15em] text-accent">
              {priceLabel}
            </p>
          </div>
          <p className="mt-2 text-xs text-foreground/55 leading-snug">
            {plan.description}
          </p>
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={selected}
          onChange={onToggle}
        />
      </label>

      {/* Stepper for plans with extras */}
      {selected && plan.extra && (
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
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

function CheckboxBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-1 inline-block h-4 w-4 shrink-0 border transition-all",
        checked
          ? "border-accent bg-accent shadow-[0_0_10px_rgba(176,38,255,0.6)]"
          : "border-white/30"
      )}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className="h-full w-full">
          <path
            d="M3 8.5 L7 12 L13 4"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
