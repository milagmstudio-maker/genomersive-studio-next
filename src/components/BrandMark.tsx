import Link from "next/link";

// 左上のロゴ。スタジオ名を2段で読ませ、最後の「O」だけブランドのグラデーション
export function BrandMark() {
  return (
    <Link
      href="/"
      aria-label="Genomersive Studio トップへ"
      className="fixed top-5 left-6 z-30 inline-flex flex-col py-2.5 -my-2.5 font-serif text-[11px] leading-[1.02] text-foreground"
      style={{ fontWeight: 900 }}
    >
      <span>GENOMERSIVE</span>
      <span>
        STUDI<span className="text-accent-grad">O</span>
      </span>
    </Link>
  );
}
