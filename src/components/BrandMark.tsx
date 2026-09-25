import Link from "next/link";

// 左上のロゴ。スタジオ名を2段で読ませ、最後の「O」だけブランドのグラデーション。
// 右のメニュー（DotNav）と上端・高さを揃えている（18px→2段で約37px、23px→約47px）
export function BrandMark() {
  return (
    <Link
      href="/"
      aria-label="Genomersive Studio トップへ"
      className="fixed top-5 left-5 z-30 inline-flex flex-col py-2.5 -my-2.5 font-serif text-[15px] leading-[1.02] text-foreground sm:top-6 sm:left-6 sm:text-[18px] md:left-10 lg:top-8 lg:text-[23px]"
      style={{ fontWeight: 900 }}
    >
      <span>GENOMERSIVE</span>
      <span>
        STUDI<span className="text-accent-grad">O</span>
      </span>
    </Link>
  );
}
