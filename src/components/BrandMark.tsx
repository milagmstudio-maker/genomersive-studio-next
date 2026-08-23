import Link from "next/link";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="fixed top-5 left-6 z-30 inline-flex items-center py-3.5 -my-3.5 font-mono text-xs tracking-[0.3em] text-foreground hover:text-foreground transition-colors"
    >
      GMS
    </Link>
  );
}
