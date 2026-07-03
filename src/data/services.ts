export type ServiceCategory =
  | "VOCAL MIX"
  | "PARA MIX"
  | "OBS AUDIO"
  | "BINAURAL"
  | "AUDIO EDIT"
  | "CREATIVE DIRECTION";

export type Plan = {
  id: string;
  name: string;
  category: ServiceCategory;
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
    id: "p-obs-audio",
    name: "OBS Audio / 配信音響設計",
    category: "OBS AUDIO",
    basePrice: 30000,
    description:
      "雑談、ゲーム配信、歌枠、ASMR配信に合わせて、声・BGM・ゲーム音・効果音が視聴者に聞きやすく届く音響を設計します。アフターサポート2ヶ月付き。",
  },

  // Pack
  {
    id: "p-pack-3",
    name: "Vocal Mix 3曲パック",
    category: "VOCAL MIX",
    basePrice: 20000,
    description:
      "ボーカルMix 3曲分のまとめパック。1曲あたり約¥6,667（通常Full Chorus ¥10,000〜と比べてお得）。Full Chorus相当の品質で対応。",
    extra: {
      label: "追加曲数",
      pricePerUnit: 6000,
      includedUnits: 3,
      defaultUnits: 3,
      min: 3,
      max: 10,
    },
  },

  // Additional services — quote after checking source material and scope
  {
    id: "p-binaural",
    name: "Binaural",
    category: "BINAURAL",
    basePrice: 0,
    description:
      "ボイス作品やシチュエーション音声向けに、距離感・定位・空間の広がりを整えます。",
  },
  {
    id: "p-audio-edit",
    name: "Audio Edit / 整音",
    category: "AUDIO EDIT",
    basePrice: 0,
    description:
      "整音、ノイズ除去、音量調整、素材修復に対応。音声素材を作品や投稿に使いやすい状態へ整えます。",
  },
  {
    id: "p-creative-direction",
    name: "Creative Direction",
    category: "CREATIVE DIRECTION",
    basePrice: 0,
    description:
      "投稿導線、企画整理、見せ方の相談など、音を整えたあとの活動の使い方と次の一歩を一緒に整理します。",
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
