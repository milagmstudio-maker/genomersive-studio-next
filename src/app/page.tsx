import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { SelectedWorks } from "@/components/SelectedWorks";
import { CaseStudy } from "@/components/CaseStudy";
import { ServicesTeaser } from "@/components/ServicesTeaser";
import { Philosophy } from "@/components/Philosophy";
import { About } from "@/components/About";
import { Notices } from "@/components/Notices";
import { CtaBand } from "@/components/CtaBand";

// タイトル・説明文は layout.tsx のものを使い、正規URLだけここで指定する
// （layout に置くと、正規URLを持たない下層ページまでトップを指してしまうため）
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWorks />
      <CaseStudy />
      <ServicesTeaser />
      <Philosophy />
      <About />
      <Suspense fallback={null}>
        <Notices />
      </Suspense>
      <CtaBand />
    </>
  );
}
