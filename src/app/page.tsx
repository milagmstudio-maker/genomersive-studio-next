import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { SelectedWorks } from "@/components/SelectedWorks";
import { CaseStudy } from "@/components/CaseStudy";
import { ServicesTeaser } from "@/components/ServicesTeaser";
import { Philosophy } from "@/components/Philosophy";
import { About } from "@/components/About";
import { Notices } from "@/components/Notices";
import { CtaBand } from "@/components/CtaBand";

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
