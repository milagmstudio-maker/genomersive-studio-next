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
    id: "w-001",
    title: "アルジャーノン",
    artist: "ヨルシカ covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "P9xlNgmjJiI",
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
    id: "w-004",
    title: "怪獣",
    artist: "サカナクション covered by MEMESIA",
    category: "VOCAL MIX",
    youtubeId: "lOxiHsbp84Q",
    year: 2025,
  },
  {
    id: "w-005",
    title: "舞",
    artist: "Guiano covered by 半島キタ",
    category: "VOCAL MIX",
    youtubeId: "11JQR-nLrfc",
    year: 2025,
  },
  {
    id: "w-006",
    title: "若者のすべて",
    artist: "フジファブリック covered by おもや いっか",
    category: "VOCAL MIX",
    youtubeId: "hdU1v5UhQTY",
    year: 2025,
  },
  {
    id: "w-007",
    title: "レイニーブルー",
    artist: "徳永英明 covered by おもや いっか",
    category: "VOCAL MIX",
    youtubeId: "jACnvd-xcWM",
    year: 2025,
  },
  {
    id: "w-008",
    title: "ダウナーウィッチ",
    artist: "ダウナーウィッチ covered by 時音ありす",
    category: "VOCAL MIX",
    youtubeId: "OmCvwoLKOnQ",
    year: 2025,
  },
  {
    id: "w-009",
    title: "JANE DOE",
    artist: "米津玄師, 宇多田ヒカル covered by 音調ネオン",
    category: "VOCAL MIX",
    youtubeId: "5WVK6EslTJo",
    year: 2025,
  },
  {
    id: "w-010",
    title: "fake face dance music",
    artist: "音田雅則 covered by 音調ネオン",
    category: "VOCAL MIX",
    youtubeId: "ZPbEkckm-mM",
    year: 2025,
  },
  {
    id: "w-011",
    title: "あなたの夜が明けるまで",
    artist: "傘村トータ covered by にじゅな",
    category: "VOCAL MIX",
    youtubeId: "IFj3iY_Z3Dw",
    year: 2025,
  },
  {
    id: "w-012",
    title: "OBS音響調整のbefore or after",
    artist: "にじゅな",
    category: "OBS AUDIO",
    youtubeId: "07jz4h_p7J0",
    year: 2025,
  },
  {
    id: "w-013",
    title: "【新モデル】再始動‼ お披露目会 〜そしてこれからの事〜",
    artist: "にじゅな",
    category: "OBS AUDIO",
    youtubeId: "ZmR9zQ7U8Ks",
    year: 2025,
  },
  {
    id: "w-014",
    title: "歌枠｜椎名林檎縛り",
    artist: "巫ロキ",
    category: "OBS AUDIO",
    youtubeId: "-UFMZCgJ7fI",
    year: 2025,
  },
  {
    id: "w-015",
    title: "【耐久歌枠】チャンネル登録4000人耐久!?",
    artist: "朱瀬オト",
    category: "OBS AUDIO",
    youtubeId: "gtLxrvHS_yk",
    year: 2025,
  },
  {
    id: "w-016",
    title: "【歌枠】心呼の声を聴いて 高評価100目指して歌います",
    artist: "心呼",
    category: "OBS AUDIO",
    youtubeId: "matCu6LG0RM",
    year: 2025,
  },
  {
    id: "w-017",
    title: "【歌枠】高評価100まで、あったかい歌聞きたくな〜い？",
    artist: "半島キタ",
    category: "OBS AUDIO",
    youtubeId: "Cd0aW-NMK14",
    year: 2025,
  },
  {
    id: "w-018",
    title: "〖歌枠｜karaoke〗登録者さん +10人 & 高評価100耐久歌枠",
    artist: "月乃よう",
    category: "OBS AUDIO",
    youtubeId: "SFoHgdSrGb0",
    year: 2025,
  },
  {
    id: "w-019",
    title: "にじゅな",
    artist: "にじゅな",
    category: "PRODUCTION",
    youtubeId: "ZmR9zQ7U8Ks",
    year: 2025,
  },
];

export const CATEGORIES: ("ALL" | WorkCategory)[] = [
  "ALL",
  "VOCAL MIX",
  "PARA MIX",
  "OBS AUDIO",
  "PRODUCTION",
];
