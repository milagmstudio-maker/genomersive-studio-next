import { BackgroundFX } from "@/components/BackgroundFX";
import { BlogPreview } from "@/components/BlogPreview";
import { BrandMark } from "@/components/BrandMark";
import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { DotNav } from "@/components/DotNav";
import { GlitchOverlay } from "@/components/GlitchOverlay";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Works } from "@/components/Works";

export default function Home() {
  return (
    <main className="relative">
      <BackgroundFX />
      <GlitchOverlay />
      <Cursor />
      <BrandMark />
      <DotNav />

      <Hero />
      <Works />
      <Services />
      <BlogPreview />
      <Contact />

      <footer className="relative z-10 border-t border-white/5 py-8 text-center font-mono text-[10px] tracking-[0.3em] text-foreground/30">
        © 2026 GENOMERSIVE STUDIO / MiLa
      </footer>
    </main>
  );
}
