import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Cormorant_Garamond, Archivo } from "next/font/google";
import { AmbientVideo } from "@/components/AmbientVideo";
import { BrandMark } from "@/components/BrandMark";
import { Cursor } from "@/components/Cursor";
import { DotNav } from "@/components/DotNav";
import { MobileNav } from "@/components/MobileNav";
import { GlitchOverlay } from "@/components/GlitchOverlay";
import { JsonLd } from "@/components/JsonLd";
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

// ラベル・英字見出し用。横幅（wdth）軸つきの可変フォントで、横長の太いゴシックとして使う
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "ボーカルMix・OBS音響調整の依頼｜VTuber・歌い手の音響制作 Genomersive Studio",
  description:
    "歌ってみた・配信の音、プロに任せませんか。VTuber・歌い手・配信者向けにボーカルMix・パラMix・OBS音響調整を依頼できるサウンドスタジオ。料金は依頼前に概算が出せます。実績500件以上、サウンドエンジニア MiLa。",
  metadataBase: new URL("https://genomersivestudio.com"),
  openGraph: {
    title: "Genomersive Studio",
    description: "Producer / Director / Sound Engineer",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Genomersive Studio — Producer / Director / Sound Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genomersive Studio",
    description: "Producer / Director / Sound Engineer",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "yC1SsnbYlhUxLauGhdw287HDdaywwZMntUBhEbCmPBE",
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
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${archivo.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9VCCFHNYGL"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9VCCFHNYGL');`}
        </Script>
      </head>
      <body className="bg-noise relative min-h-full">
        <a href="#main" className="skip-link font-mono">
          本文へスキップ
        </a>
        <Splash />
        <AmbientVideo />
        <GlitchOverlay />
        <Cursor />
        <BrandMark />
        <DotNav />
        <MobileNav />

        <main id="main" className="relative">
          {children}
        </main>

        <footer className="relative z-10 border-t border-white/25 py-8 font-mono text-[10px] tracking-[0.3em] text-foreground/60">
          <p className="mb-6 text-center font-mincho text-sm tracking-[0.15em] text-foreground/80">
            忘れられない音にする。
          </p>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
            <span>© 2026 GENOMERSIVE STUDIO / MiLa</span>
            <div className="flex items-center gap-6">
              <a
                href="https://x.com/mila_mixstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center py-4 -my-4 hover:text-foreground transition-colors"
              >
                X @mila_mixstudio
              </a>
              <a
                href="mailto:mila.gmstudio@gmail.com"
                className="inline-flex items-center py-4 -my-4 hover:text-foreground transition-colors"
              >
                MAIL
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
