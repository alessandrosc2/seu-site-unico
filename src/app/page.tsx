"use client";

import dynamic from "next/dynamic";
import { WordRevealSection } from "@/components/scrollytelling/WordRevealSection";
import { ScrollGlobe } from "@/components/ui/landing-page";
import { AudienceSwitcher } from "@/components/scrollytelling/AudienceSwitcher";
import { PricingSection } from "@/components/pricing/PricingSection";

const OrbitDeliveryHero = dynamic(
  () => import("@/components/ui/orbit-delivery-hero"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#070d1e] text-white">
      {/* Beat 1: The 3D Interactive Hero World */}
      <OrbitDeliveryHero />

      {/* Beat 2: O Conflito Editorial & Comparativo Visual */}
      <WordRevealSection />

      {/* Beat 3: As 4 Fases do Método Guiado com 3D CSS Globe Scrollytelling */}
      <ScrollGlobe />

      {/* Beat 4: Dois Públicos, Um Só Produto */}
      <AudienceSwitcher />

      {/* Beat 5: Tabela de Preços, Order Bump, Saída WhatsApp e FAQ */}
      <PricingSection />

      {/* Modern Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#050814] text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Seu Site Único. Todos os direitos reservados.</p>
          <p className="text-slate-400">Método guiado com Inteligência Artificial para pequenos negócios e renda extra.</p>
        </div>
      </footer>
    </main>
  );
}
