export type WorkCategory =
  | "VOCAL MIX"
  | "PARA MIX"
  | "OBS AUDIO"
  | "PRODUCTION";

export type Work = {
  id: string;
  title: string;
  artist: string;
  category: WorkCategory;
  /** YouTube video ID — extracted from watch URL */
  youtubeId: string;
  year: number;
};

/**
 * Replace these entries with real works.
 * youtubeId is the part after `v=` in a YouTube watch URL.
 * Thumbnails are auto-fetched from img.youtube.com.
 */
export const WORKS: Work[] = [
  {
    id: "w-040",
    title: "ルーマー（Rumor）",
    artist: "ポリスピカデリー covered by 翠雨しの",
    category: "VOCAL MIX",
    youtubeId: "zLKLrx1jkos",
    year: 2026,
  },
  {
    id: "w-036",
    title: "SUMMER SONG",
    artist: "flumpool covered by まちこりーた",
    category: "VOCAL MIX",
    youtubeId: "z3p9yLsHLf0",
    year: 2026,
  },
  {
    id: "w-032",
    title: "春はゆく",
    artist: "Aimer covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "BTmDFhWe9GU",
    year: 2026,
  },
  {
    id: "w-027",
    title: "奏",
    artist: "スキマスイッチ covered by まちこりーた",
    category: "VOCAL MIX",
    youtubeId: "LBPEHn2EM-s",
    year: 2026,
  },
  {
    id: "w-028",
    title: "青のすみか",
    artist: "キタニタツヤ covered by まちこりーた",
    category: "VOCAL MIX",
    youtubeId: "HlcvqfMCAHY",
    year: 2026,
  },
  {
    id: "w-025",
    title: "マシュマロ",
    artist: "DECO*27 covered by 灯火ホタル",
    category: "VOCAL MIX",
    youtubeId: "DFL4Q8uVijo",
    year: 2026,
  },
  {
    id: "w-001",
    title: "アルジャーノン",
    artist: "ヨルシカ covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "V7IhaLDXk3E",
    year: 2025,
  },
  {
    id: "w-002",
    title: "ツキミソウ",
    artist: "Novelbright covered by MEMESIA",
    category: "VOCAL MIX",
    youtubeId: "6nz0j0EZzD0",
    year: 2025,
  },
  {
    id: "w-003",
    title: "永遠のあくる日",
    artist: "Ado covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "bX2-wAtmOYU",
    year: 2025,
  },
  {
    id: "w-038",
    title: "プロローグ",
    artist: "Uru covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "hbAoxkukffw",
    year: 2026,
  },
  {
    id: "w-005",
    title: "忘れてください",
    artist: "ヨルシカ covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "p3V71Y2zkrg",
    year: 2026,
  },
  {
    id: "w-026",
    title: "ラグトレイン",
    artist: "稲葉曇 covered by 半島キタ",
    category: "VOCAL MIX",
    youtubeId: "ZFeC9NnX5sI",
    year: 2026,
  },
  {
    id: "w-006",
    title: "舞",
    artist: "Guiano covered by 半島キタ",
    category: "VOCAL MIX",
    youtubeId: "11JQR-nLrfc",
    year: 2025,
  },
  {
    id: "w-007",
    title: "幸福刑",
    artist: "LonePi covered by 半島キタ",
    category: "VOCAL MIX",
    youtubeId: "k6AWzAJX_Hw",
    year: 2026,
  },
  {
    id: "w-008",
    title: "若者のすべて",
    artist: "フジファブリック covered by おもや いっか",
    category: "VOCAL MIX",
    youtubeId: "hdU1v5UhQTY",
    year: 2025,
  },
  {
    id: "w-009",
    title: "レイニーブルー",
    artist: "徳永英明 covered by おもや いっか",
    category: "VOCAL MIX",
    youtubeId: "jACnvd-xcWM",
    year: 2025,
  },
  {
    id: "w-010",
    title: "JANE DOE",
    artist: "米津玄師, 宇多田ヒカル covered by 音調ネオン",
    category: "VOCAL MIX",
    youtubeId: "5WVK6EslTJo",
    year: 2025,
  },
  {
    id: "w-011",
    title: "fake face dance music",
    artist: "音田雅則 covered by 音調ネオン",
    category: "VOCAL MIX",
    youtubeId: "ZPbEkckm-mM",
    year: 2025,
  },
  {
    id: "w-012",
    title: "あなたの夜が明けるまで",
    artist: "傘村トータ covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "IFj3iY_Z3Dw",
    year: 2025,
  },
  {
    id: "w-037",
    title: "命に嫌われている。",
    artist: "カンザキイオリ covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "omyq3X02vXs",
    year: 2026,
  },
  {
    id: "w-004",
    title: "怪獣",
    artist: "サカナクション covered by MEMESIA",
    category: "VOCAL MIX",
    youtubeId: "lOxiHsbp84Q",
    year: 2025,
  },
  {
    id: "w-034",
    title: "【 #歌枠 / #弾き語り】日曜定期配信！！おやすみ弾き語り🌙【 #しのの仕立て屋 / vsinger 】",
    artist: "翠雨しの",
    category: "OBS AUDIO",
    youtubeId: "TDKYjLOh1m8",
    year: 2026,
  },
  {
    id: "w-013",
    title: "OBS音響調整のbefore or after",
    artist: "にじゅな",
    category: "OBS AUDIO",
    youtubeId: "3_C27HA0Hq8",
    year: 2025,
  },
  {
    id: "w-014",
    title: "【新モデル】再始動‼ お披露目会 〜そしてこれからの事〜",
    artist: "にじゅな",
    category: "OBS AUDIO",
    youtubeId: "ZmR9zQ7U8Ks",
    year: 2025,
  },
  {
    id: "w-015",
    title: "歌枠｜ありがとう2周年記念",
    artist: "巫ロキ",
    category: "OBS AUDIO",
    youtubeId: "Rd9dnDd8Dd4",
    year: 2025,
  },
  {
    id: "w-016",
    title: "【耐久歌枠】チャンネル登録4000人耐久!?",
    artist: "朱瀬オト",
    category: "OBS AUDIO",
    youtubeId: "gtLxrvHS_yk",
    year: 2025,
  },
  {
    id: "w-017",
    title: "【 #Mooっと推して歌枠リレー 】開会式｜#心呼",
    artist: "心呼",
    category: "OBS AUDIO",
    youtubeId: "kj7G-mEwTQg",
    year: 2025,
  },
  {
    id: "w-018",
    title: "【歌枠】高評価100まで、あったかい歌聞きたくな〜い？",
    artist: "半島キタ",
    category: "OBS AUDIO",
    youtubeId: "Cd0aW-NMK14",
    year: 2025,
  },
  {
    id: "w-019",
    title: "〖歌枠｜karaoke〗登録者さん +10人 & 高評価100耐久歌枠",
    artist: "月乃よう",
    category: "OBS AUDIO",
    youtubeId: "SFoHgdSrGb0",
    year: 2025,
  },
  {
    id: "w-020",
    title: "にじゅな",
    artist: "にじゅな",
    category: "PRODUCTION",
    youtubeId: "ZmR9zQ7U8Ks",
    year: 2025,
  },
  {
    id: "w-021",
    title: "熱異常",
    artist: "いよわ covered by 半島キタ",
    category: "VOCAL MIX",
    youtubeId: "Im80q0h7av0",
    year: 2026,
  },
  {
    id: "w-022",
    title: "【 #KARAOKE/ #歌枠 】🌟明日が憂鬱な君へ大丈夫だよ。 ┊アニソンリラックスバラード🌟",
    artist: "歌玻 まいろ",
    category: "OBS AUDIO",
    youtubeId: "zvGAGwNzv-8",
    year: 2026,
  },
  {
    id: "w-023",
    title: "フィナーレ。",
    artist: "eill covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "I-PkfF2rd_U",
    year: 2026,
  },
  {
    id: "w-024",
    title: "more than words",
    artist: "羊文学 covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "a-sl75NMrEU",
    year: 2026,
  },
  {
    id: "w-029",
    title: "CH9000人目指してゆるりと歌いましょう",
    artist: "夜世音",
    category: "OBS AUDIO",
    youtubeId: "8ionZ_EyZlE",
    year: 2026,
  },
  {
    id: "w-030",
    title: "定期歌枠🎶まったりしながらグッとくる歌声はいかがですか？🎤初見さん・ROM◎",
    artist: "時音ありす",
    category: "OBS AUDIO",
    youtubeId: "_rNClxHWCPQ",
    year: 2026,
  },
  {
    id: "w-033",
    title: "【歌枠 KARAOKE】好きなお歌をのんびり歌います【蔵乃のるん】",
    artist: "蔵乃のるん",
    category: "OBS AUDIO",
    youtubeId: "JU6WDj2OfkQ",
    year: 2026,
  },
  {
    id: "w-035",
    title: "【 #鳴潮 】 完全初見『 第2章 幕間 & 第8幕 赫耀の陽に灼かれて 』読んでくよ～！ . ｜ #Vtuber #雑談",
    artist: "あのこみる",
    category: "OBS AUDIO",
    youtubeId: "koqkDFSCnio",
    year: 2026,
  },
  {
    id: "w-039",
    title: "【歌枠】寝る前に一曲いかが？いつもの気ままに歌う歌枠",
    artist: "森神りぃしゅ",
    category: "OBS AUDIO",
    youtubeId: "1LsB35Ie9B4",
    year: 2026,
  },
  {
    id: "w-041",
    title: "you",
    artist: "癒月 covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "hC5xWdJKxFc",
    year: 2026,
  },
  {
    id: "w-042",
    title: "【 #歌枠 】ただいま🌙 約10か月ぶりに…歌わせてください！⚠️どうなるかは本人も知りません。 #神那レイア #vtuber",
    artist: "神那レイア",
    category: "OBS AUDIO",
    youtubeId: "tDmZu0sD9i8",
    year: 2026,
  },
];

export const CATEGORIES: ("ALL" | WorkCategory)[] = [
  "ALL",
  "VOCAL MIX",
  "PARA MIX",
  "OBS AUDIO",
  "PRODUCTION",
];

// カテゴリごとのURL（/works/vocal-mix など）。ALL は /works
export const CATEGORY_SLUGS: Record<WorkCategory, string> = {
  "VOCAL MIX": "vocal-mix",
  "PARA MIX": "para-mix",
  "OBS AUDIO": "obs-audio",
  PRODUCTION: "production",
};

export function categoryHref(c: "ALL" | WorkCategory): string {
  return c === "ALL" ? "/works" : `/works/${CATEGORY_SLUGS[c]}`;
}

export function categoryFromSlug(slug: string): WorkCategory | undefined {
  return (Object.keys(CATEGORY_SLUGS) as WorkCategory[]).find(
    (c) => CATEGORY_SLUGS[c] === slug
  );
}

// 実績が1件以上あるカテゴリだけ（タブ表示・ページ生成・サイトマップで共通）
export const ACTIVE_CATEGORIES: WorkCategory[] = (
  Object.keys(CATEGORY_SLUGS) as WorkCategory[]
).filter((c) => WORKS.some((w) => w.category === c));
