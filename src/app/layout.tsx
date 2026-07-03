import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Cormorant_Garamond, Noto_Sans_JP, Zen_Old_Mincho } from "next/font/google";
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

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// 日本語ディスプレイ書体 — コアコピー・リード文・和文見出し専用
const zenMincho = Zen_Old_Mincho({
  variable: "--font-zen-mincho",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "音を整え、活動の次の一歩まで。｜Genomersive Studio",
  description:
    "Vocal Mix・配信音響設計・整音を通じて、VTuber・歌い手・配信者の作品や配信が届く状態になるところまでサポートする音響制作スタジオ。",
  metadataBase: new URL("https://genomersivestudio.com"),
  openGraph: {
    title: "Genomersive Studio",
    description: "音を整え、活動の次の一歩まで。",
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
    description: "音を整え、活動の次の一歩まで。",
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
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${notoJp.variable} ${zenMincho.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9VCCFHNVGL"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9VCCFHNVGL');`}
        </Script>
      </head>
      <body className="bg-noise relative min-h-full">
        <Splash />
        <AmbientVideo />
        <GlitchOverlay />
        <Cursor />
        <BrandMark />
        <DotNav />
        <MobileNav />

        <main className="relative">{children}</main>

        <footer className="relative z-10 border-t border-white/25 py-8 font-mono text-[10px] tracking-[0.3em] text-foreground/60">
          <p className="mb-6 text-center font-mincho text-sm font-bold tracking-[0.15em] text-foreground/80">
            忘れられない音にする。
          </p>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
            <span>© 2026 GENOMERSIVE STUDIO / MiLa</span>
            <div className="flex items-center gap-6">
              <a
                href="https://x.com/mila_mixstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                X @mila_mixstudio
              </a>
              <a
                href="mailto:mila.gmstudio@gmail.com"
                className="hover:text-foreground transition-colors"
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
