import type { WorkCategory } from "./works";

export type Plan = {
  id: string;
  name: string;
  category: WorkCategory | "PRODUCTION";
  /** Base price in JPY */
  basePrice: number;
  /** Show "〜" suffix indicating "starting from" */
  startsFrom?: boolean;
  description: string;
  /** Optional unit-based extras (Para Mix tracks, Collab members, etc.) */
  extra?: {
    label: string;
    pricePerUnit: number;
    /** Units already included in basePrice */
    includedUnits: number;
    /** Default value shown */
    defaultUnits: number;
    /** Min/max limits for the stepper */
    min: number;
    max: number;
  };
  /** Recurring monthly plans display differently */
  recurring?: "monthly";
};

export const PLANS: Plan[] = [
  // Vocal Mix — per track
  {
    id: "p-short",
    name: "Short Mix",
    category: "VOCAL MIX",
    basePrice: 3000,
    startsFrom: true,
    description: "TikTok / YouTube Shorts用。ピッチ・タイミング補正、ハモリ作成、マスタリング、ノイズ除去、エンコード込み。",
  },
  {
    id: "p-one",
    name: "One Chorus",
    category: "VOCAL MIX",
    basePrice: 6000,
    startsFrom: true,
    description: "ワンコーラス分のフルMix。ピッチ補正・ハモリ作成・マスタリングまで。",
  },
  {
    id: "p-full",
    name: "Full Chorus",
    category: "VOCAL MIX",
    basePrice: 10000,
    startsFrom: true,
    description: "フルサイズ楽曲のMix。エンコードまで含む。",
  },
  {
    id: "p-collab",
    name: "Collab・合唱",
    category: "VOCAL MIX",
    basePrice: 14000,
    startsFrom: true,
    description: "2名様分のコラボ・合唱Mix。3名以降は1名追加ごとに+¥5,000。",
    extra: {
      label: "追加メンバー数",
      pricePerUnit: 5000,
      includedUnits: 2,
      defaultUnits: 2,
      min: 2,
      max: 12,
    },
  },

  // Para Mix
  {
    id: "p-para-solo",
    name: "弾き語り Mix",
    category: "PARA MIX",
    basePrice: 12000,
    startsFrom: true,
    description: "弾き語り（ボーカル + ギター/ピアノ程度）のステムMix。",
  },
  {
    id: "p-para-band",
    name: "Para Mix（10トラック〜）",
    category: "PARA MIX",
    basePrice: 15000,
    startsFrom: true,
    description: "バンド・トラック制作のステムMix。10トラックまで含む。",
    extra: {
      label: "総トラック数",
      pricePerUnit: 500, // +¥1,000 per 2 tracks → ¥500/track
      includedUnits: 10,
      defaultUnits: 10,
      min: 10,
      max: 40,
    },
  },

  // OBS Audio
  {
    id: "p-obs-full",
    name: "OBS音響調整 + Mix",
    category: "OBS AUDIO",
    basePrice: 30000,
    description:
      "通常マイク / 歌唱マイク / ASMRマイクなどの調整 + Mix。アフターサポート2ヶ月付き。",
  },
  {
    id: "p-obs-only",
    name: "OBS音響調整のみ",
    category: "OBS AUDIO",
    basePrice: 25000,
    description:
      "通常マイク / 歌唱マイク / ASMRマイクなどの調整。アフターサポート2ヶ月付き。",
  },

  // Subscription
  {
    id: "p-sub",
    name: "Vocal Mix Subscription",
    category: "VOCAL MIX",
    basePrice: 20000,
    description: "月額制。YouTube Shorts含む全Mix対応。定員制限あり。",
    recurring: "monthly",
  },

  // Production — quote only
  {
    id: "p-production",
    name: "Production / Direction",
    category: "PRODUCTION",
    basePrice: 0,
    description:
      "プロデュース、マネジメント、楽曲のMixやOBS音響調整まで、内容に応じて個別お見積もり。",
  },
];

export type AddOn = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export const ADDONS: AddOn[] = [
  { id: "a-mastering", name: "マスタリングのみ", price: 5000, description: "Mix済み音源のマスタリング単独依頼。" },
  { id: "a-minus-one", name: "マイナスワン書き出し", price: 1000, description: "ボーカル抜きのカラオケ音源を書き出し。" },
];

export type Delivery = {
  id: string;
  name: string;
  surcharge: number;
  description: string;
};

export const DELIVERIES: Delivery[] = [
  { id: "d-normal", name: "通常納期", surcharge: 0, description: "1〜2週間" },
  { id: "d-5d", name: "5日以降指定", surcharge: 3000, description: "+¥3,000" },
  { id: "d-72h", name: "72時間特急", surcharge: 6000, description: "+¥6,000" },
  { id: "d-24h", name: "24時間特急", surcharge: 9000, description: "+¥9,000" },
];

export type Discount = {
  id: string;
  name: string;
  type: "fixed" | "rate";
  value: number; // fixed: yen off, rate: 0..1
  description: string;
};

export const DISCOUNTS: Discount[] = [
  { id: "x-none", name: "適用なし", type: "fixed", value: 0, description: "" },
  { id: "x-first", name: "初回利用割引", type: "fixed", value: 2000, description: "−¥2,000" },
  { id: "x-repeat", name: "3回目以降割引", type: "rate", value: 0.2, description: "20% OFF" },
];
