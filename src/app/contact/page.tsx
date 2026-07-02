import { Contact } from "@/components/Contact";

export const metadata = {
  title: "ボーカルMix・音響調整のご依頼・ご相談｜Genomersive Studio",
  description:
    "ボーカルMix・パラMix・OBS音響調整・プロデュースのご依頼・ご相談はこちら。「見積もりだけ」「相談だけ」でも歓迎、原則48時間以内に返信します。メール・X DM・Discordで受付。",
  openGraph: {
    title: "ご依頼・ご相談 — Genomersive Studio",
    description: "見積もりだけ・相談だけでも歓迎。原則48時間以内に返信します。",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" as const, images: ["/og-image.jpg"] },
};

export default function ContactPage() {
  return <Contact />;
}
