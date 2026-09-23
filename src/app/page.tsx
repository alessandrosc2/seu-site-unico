"use client";

import { ScrollGlobe } from "@/components/ui/landing-page";
import { InteractiveSelector } from "@/components/ui/interactive-selector";
import { AudienceSwitcher } from "@/components/scrollytelling/AudienceSwitcher";
import { PricingSection } from "@/components/pricing/PricingSection";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#070d1e] text-white">
      {/* Beat Principal: O Método Guiado das 4 Fases com o Globo 3D em Scrollytelling */}
      <ScrollGlobe />

      {/* Showcase de Nichos & Profissionais — Seletor Sanfonado Interativo */}
      <div id="nichos">
        <InteractiveSelector />
      </div>

      {/* Dois Públicos, Um Só Produto & Calculadora de Renda Extra */}
      <div id="calculadora">
        <AudienceSwitcher />
      </div>

      {/* Tabela de Preços, Order Bump, Saída WhatsApp e FAQ */}
      <div id="pricing">
        <PricingSection />
      </div>

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
