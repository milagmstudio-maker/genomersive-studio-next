import { Contact } from "@/components/Contact";

export const metadata = {
  title: "音響制作のご依頼・ご相談｜Genomersive Studio",
  description:
    "Vocal Mix・Para Mix・OBS Audio・Binaural・Audio Edit・Creative Directionのご相談はこちら。内容や素材を確認してから金額と納期をご案内します。",
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
