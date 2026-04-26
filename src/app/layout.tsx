import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
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
      <body className="bg-noise relative min-h-full">{children}</body>
    </html>
  );
}
