import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import { BackgroundFX } from "@/components/BackgroundFX";
import { BrandMark } from "@/components/BrandMark";
import { Cursor } from "@/components/Cursor";
import { DotNav } from "@/components/DotNav";
import { GlitchOverlay } from "@/components/GlitchOverlay";
import { Splash } from "@/components/Splash";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Genomersive Studio — Producer / Director / Sound Engineer",
  description:
    "MiLa主宰のサウンドプロダクション。ボーカルMix、Para(Stem)Mix、OBS音響調整、配信サポートまで。声をブランド化する音響設計。",
  metadataBase: new URL("https://genomersive-studio.mila-gmstudio.workers.dev"),
  openGraph: {
    title: "Genomersive Studio",
    description: "Producer / Director / Sound Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${notoJp.variable} h-full antialiased`}
    >
      <body className="bg-noise relative min-h-full">
        <Splash />
        <BackgroundFX />
        <GlitchOverlay />
        <Cursor />
        <BrandMark />
        <DotNav />

        <main className="relative">{children}</main>

        <footer className="relative z-10 border-t border-white/5 py-8 text-center font-mono text-[10px] tracking-[0.3em] text-foreground/30">
          © 2026 GENOMERSIVE STUDIO / MiLa
        </footer>
      </body>
    </html>
  );
}
