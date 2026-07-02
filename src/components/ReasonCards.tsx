"use client";

import { useCallback, useState } from "react";
import { WORKS, type Work } from "@/data/works";
import { WorkModal } from "./WorkModal";

// 02の「主張」をその場で「証拠」に変えるための聴き比べ動画
const PROOF_WORK_ID = "w-013"; // OBS音響調整のbefore/after

const REASONS = [
  {
    no: "01",
    title: "歌も、配信も、ワンストップ",
    body: "楽曲のMixと配信の音響、両方をプロ品質で扱える人はほとんどいません。「歌ってみたは良い音なのに、配信はいつもの音」——その分断をなくせます。",
  },
  {
    no: "02",
    title: "あなたの声が、主役になる",
    body: "テンプレ設定のコピーではなく、あなたの声質を起点に設計します。Mixも配信音響も、「誰がやっても同じ音」にはなりません。なぜそうしたかの説明付きです。",
    proof: true,
  },
  {
    no: "03",
    title: "活動全体を見て、提案できる",
    body: "音を良くするだけなら技術の仕事。「その曲を今出すべきか」「配信とどう繋げるか」まで考えるのがプロデューサーの仕事です。実際に、VTuberのプロデュース・マネジメントを現在進行形でやっています。納品後の伴走（OBS調整はアフターサポート2ヶ月付き）も前提です。",
  },
];

export function ReasonCards() {
  const [open, setOpen] = useState<Work | null>(null);
  const handleClose = useCallback(() => setOpen(null), []);

  const proofWork = WORKS.find((w) => w.id === PROOF_WORK_ID) ?? null;

  return (
    <>
      {REASONS.map((r) => (
        <div
          key={r.no}
          className="border border-white/30 bg-black/30 backdrop-blur-sm p-5"
        >
          <div className="flex items-baseline gap-4">
            <span
              className="font-serif italic text-2xl"
              style={{ color: "var(--accent-cyan)" }}
            >
              {r.no}
            </span>
            <h3 className="font-sans font-bold text-base md:text-lg">
              {r.title}
            </h3>
          </div>
          <p className="mt-3 text-xs md:text-sm leading-relaxed text-foreground/85">
            {r.body}
          </p>
          {r.proof && proofWork && (
            <button
              type="button"
              onClick={() => setOpen(proofWork)}
              className="group mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-accent hover:text-foreground transition-colors"
            >
              <span className="inline-block h-[5px] w-[5px] bg-accent shadow-[0_0_8px_rgba(176,38,255,0.9)]" />
              OBS調整のbefore / afterを聴き比べる
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </div>
      ))}

      <WorkModal work={open} onClose={handleClose} />
    </>
  );
}
