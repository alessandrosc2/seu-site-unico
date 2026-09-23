"use client";

import React, { useState, useEffect } from "react";
import { Check, Star, MessageCircle, ChevronDown, ShieldCheck, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PricingSection() {
  const [includeBump, setIncludeBump] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitModalDismissed, setExitModalDismissed] = useState(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !exitModalDismissed) {
        setShowExitModal(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitModalDismissed]);

  const faqs = [
    {
      q: "Preciso saber programar ou ter experiência técnica?",
      a: "Não! O manual foi desenhado passo a passo com prompts prontos. Você apenas preenche o Briefing Mestre e cola as instruções nas ferramentas de IA indicadas."
    },
    {
      q: "Domínio e hospedagem já estão inclusos no valor?",
      a: "O manual ensina como registrar o domínio oficial (.com.br por cerca de R$ 40/ano no Registro.br) e usar opções de publicação gratuitas ou de baixíssimo custo. O valor do manual cobre todo o método e prompts."
    },
    {
      q: "Funciona para qualquer tipo de negócio ou serviço?",
      a: "Sim! O Briefing Mestre é flexível para prestadores de serviços, lojas locais, autônomos, consultórios, advogados, restaurantes e profissionais liberais."
    },
    {
      q: "E se eu já tiver Instagram e WhatsApp ativos?",
      a: "Excelente! O site não substitui suas redes, ele se conecta a elas para direcionar o tráfego do Google direto para o seu WhatsApp de atendimento."
    }
  ];

  const handleCheckout = (planName: string, basePrice: number) => {
    const finalPrice = includeBump ? basePrice + 17.90 : basePrice;
    toast.success(`Redirecionando para checkout seguro do plano ${planName} (R$ ${finalPrice.toFixed(2).replace('.', ',')})`);
  };

  return (
    <section id="planos" className="relative bg-[#070d1e] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-blue-500/20 mb-4 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Planos e Acesso Imediato
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Acesso vitalício ao manual online interativo, prompts atualizados e suporte.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12 items-stretch">
          
          {/* Plano Básico */}
          <div className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Essencial</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">Plano Básico</h3>
              <p className="text-slate-400 text-sm mb-6">Ideal para quem quer criar e colocar o próprio site no ar rapidamente.</p>
              
              <div className="mb-6">
                <span className="text-xs text-slate-400">Por apenas</span>
                <div className="text-4xl font-extrabold text-white">
                  R$ 47<span className="text-xl font-medium text-slate-400">,90</span>
                </div>
                <span className="text-[11px] text-slate-400">pagamento único sem mensalidade</span>
              </div>

              <div className="space-y-3 text-sm text-slate-300 border-t border-white/10 pt-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>Fase 1:</strong> Construir (Briefing Mestre & Prompts)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>Fase 2:</strong> Publicar (Domínio, HTTPS e WhatsApp)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Checklist de revisão mobile</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <span>Opção de upgrade pagando a diferença (R$ 22,00)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout("Básico", 47.90)}
              className="w-full py-4 rounded-xl font-semibold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/15 transition-all"
            >
              Começar com o Básico
            </button>
          </div>

          {/* Plano Completo (Mais Escolhido) */}
          <div className="relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-blue-950/80 to-slate-900/95 border-2 border-cyan-400 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md">
              Mais Escolhido
            </div>

            <div>
              <span className="text-xs font-semibold uppercase text-cyan-300 tracking-wider">Experiência Completa</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">Plano Completo</h3>
              <p className="text-slate-300 text-sm mb-6">Para quem quer dominar o SEO local e ter a opção de faturar com renda extra.</p>
              
              <div className="mb-6">
                <span className="text-xs text-cyan-300">Por apenas</span>
                <div className="text-4xl font-extrabold text-cyan-400">
                  R$ 69<span className="text-xl font-medium text-cyan-200">,90</span>
                </div>
                <span className="text-[11px] text-slate-300">pagamento único vitalício</span>
              </div>

              <div className="space-y-3 text-sm text-slate-200 border-t border-cyan-500/20 pt-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>Fase 1:</strong> Construir (Briefing Mestre & Prompts)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>Fase 2:</strong> Publicar (Domínio, HTTPS e WhatsApp)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>Fase 3:</strong> Ser Encontrado (SEO Local, Search Console, LGPD)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>Fase 4:</strong> Trilha Renda Extra (Venda de sites R$ 200 a R$ 800)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Modelos de proposta e contrato de serviços inclusos</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout("Completo", 69.90)}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Garantir o Plano Completo
            </button>
          </div>
        </div>

        {/* Order Bump Checkbox */}
        <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-md mb-16 shadow-lg">
          <label className="flex items-start gap-3.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeBump}
              onChange={(e) => setIncludeBump(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-amber-500 text-amber-500 accent-amber-400 shrink-0 cursor-pointer"
            />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-amber-300 uppercase tracking-wide mr-2">ADICIONAR:</span>
              <span className="text-white font-bold">Kit de 02 prompts para melhorar as imagens do seu negócio + Programação de 30 dias para postar nas redes sociais (+ R$ 17,90)</span>
              <p className="text-slate-200 mt-1.5 leading-relaxed font-normal">
                Receba prompts especializados para gerar fotos ultraprofissionais dos seus produtos e serviços com IA, além de um calendário completo de 30 dias com ideias de posts estratégicos para suas redes sociais.
              </p>
            </div>
          </label>
        </div>

        {/* Alternative Route — Done For You (WhatsApp) */}
        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-slate-900/40 border border-emerald-500/30 backdrop-blur-xl text-center mb-20">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <MessageCircle className="w-4 h-4" /> Saída Alternativa
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Não quer aprender sozinho? Eu faço o seu site pra você.
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Sites simples, rápidos e profissionais a partir de <strong>R$ 200,00</strong> — o valor varia de acordo com o tamanho do seu projeto.
          </p>
          <a
            href="https://wa.me/5583999999999?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20voc%C3%AA%20criar%20o%20site%20do%20meu%20neg%C3%B3cio."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            Solicitar Orçamento no WhatsApp
          </a>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">Tire suas dúvidas</span>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Perguntas Frequentes
            </h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg",
                    isOpen 
                      ? "bg-slate-900 border-cyan-500/50 shadow-cyan-950/30" 
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-cyan-400 transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-cyan-300")} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-100 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-4 bg-slate-950/70 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Exit Intent Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-400/50 p-8 rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] text-center">
            <button
              onClick={() => {
                setShowExitModal(false);
                setExitModalDismissed(true);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Condição Especial de Saída</span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-3">
              Não vá embora sem o site do seu negócio!
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              Garanta acesso imediato com desconto exclusivo nesta sessão:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6 text-left">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400 block">Básico de R$ 47,90 por</span>
                <span className="text-xl font-bold text-white">R$ 37,90</span>
              </div>
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                <span className="text-xs text-cyan-300 block">Completo de R$ 69,90 por</span>
                <span className="text-xl font-bold text-cyan-400">R$ 59,90</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowExitModal(false);
                setExitModalDismissed(true);
                handleCheckout("Completo Promocional", 59.90);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg"
            >
              Aproveitar Desconto de Saída
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
