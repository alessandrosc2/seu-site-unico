"use client";

import React, { useState } from "react";
import { Briefcase, TrendingUp, DollarSign, Check, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AudienceSwitcher() {
  const [activeTab, setActiveTab] = useState<"negocio" | "renda">("negocio");
  const [sitesPerMonth, setSitesPerMonth] = useState(4);
  const [avgPrice, setAvgPrice] = useState(300);

  const totalEarnings = sitesPerMonth * avgPrice;

  return (
    <section className="relative bg-[#080e2b] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-4 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Dois Públicos em Um Só Produto
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Quem se beneficia do método?
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
          O mesmo manual guiado atende quem precisa de um site para sua própria empresa e quem quer monetizar criando para outros.
        </p>

        {/* Tab Toggle */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 mt-8">
          <button
            onClick={() => setActiveTab("negocio")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer",
              activeTab === "negocio"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Briefcase className="w-4 h-4" />
            Dono do Negócio
          </button>
          <button
            onClick={() => setActiveTab("renda")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer",
              activeTab === "renda"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-400 hover:text-white"
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Trilha Renda Extra
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "negocio" ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold uppercase text-cyan-400 tracking-wider">Para o seu negócio</span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 mb-4 text-white">
                  Saia do amadorismo e tenha presença profissional
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  Seus clientes pesquisam no Google antes de comprar. Se você não tem um site próprio com domínio oficial, está perdendo vendas todos os dias para a concorrência.
                </p>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Domínio com o nome da sua marca (.com.br)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Apareça no mapa do Google Meu Negócio</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Sem mensalidades pesadas de plataformas caras</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/80 p-6 rounded-2xl border border-blue-500/20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto mb-4 text-cyan-300">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Economia Imediata</h4>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Enquanto uma agência cobra de R$ 1.500 a R$ 4.000 por um site simples, você cria o seu em poucas horas por uma fração desse valor.
                </p>
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-sm hover:bg-cyan-300 transition-colors shadow-lg cursor-pointer"
                >
                  Criar o Site do Meu Negócio
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/50 border border-emerald-500/30 backdrop-blur-xl animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">Oportunidade de Mercado</span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 mb-4 text-white">
                  Ofereça sites para empresas da sua cidade
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  Aprenda a mapear empresas sem site pelo Google Maps, faça abordagens respeitando a LGPD e entregue sites profissionais cobrando a partir de R$ 200 cada.
                </p>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Use o seu próprio site como portfólio vivo</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Scripts de abordagem individual no WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Modelos de proposta comercial e contrato simples</span>
                  </div>
                </div>
              </div>

              {/* Earnings Calculator */}
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/90 p-6 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Simulador de Faturamento</span>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Sites criados por mês:</span>
                    <span className="font-bold text-white">{sitesPerMonth} sites</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={sitesPerMonth}
                    onChange={(e) => setSitesPerMonth(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Preço cobrado por site:</span>
                    <span className="font-bold text-white">R$ {avgPrice},00</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="800"
                    step="50"
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-center mb-4">
                  <span className="text-xs text-slate-400">Potencial de Renda Extra Mensal:</span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                    R$ {totalEarnings.toLocaleString('pt-BR')},00
                  </div>
                </div>

                <button 
                  onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg"
                >
                  Acessar Trilha Renda Extra (Plano Completo)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
