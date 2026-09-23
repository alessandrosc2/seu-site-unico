"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, XCircle, CheckCircle, ShieldAlert, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function WordRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const headline = "Mais de 50% dos pequenos negócios brasileiros ainda não têm site próprio. A maioria fica invisível no Google ou presa a modelos genéricos e sem personalidade.";
  const words = headline.split(" ");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height - windowHeight * 0.4;
      const current = -rect.top + windowHeight * 0.2;
      const p = Math.min(Math.max(current / total, 0), 1);
      setScrollProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#070d1e] text-white py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-b border-white/10">
      <div className="max-w-5xl mx-auto text-center mb-20">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-blue-500/20 mb-8 uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          O Dilema da Presença Digital
        </span>

        {/* Scroll-scrubbed kinetic text */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] max-w-4xl mx-auto mb-6">
          {words.map((word, i) => {
            const wordThreshold = i / words.length;
            const isLit = scrollProgress >= wordThreshold;
            return (
              <span
                key={i}
                className={cn(
                  "inline-block mr-2.5 transition-all duration-300",
                  isLit 
                    ? "text-white opacity-100 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] scale-[1.02]" 
                    : "text-slate-600 opacity-30"
                )}
              >
                {word}
              </span>
            );
          })}
        </h2>
        <p className="text-slate-400 text-lg sm:text-xl font-light max-w-2xl mx-auto">
          Ter apenas redes sociais é alugar um terreno que não é seu. O seu negócio precisa de uma casa própria encontrada nas buscas.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Genérico */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-red-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <XCircle className="w-24 h-24 text-red-500" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 uppercase tracking-widest mb-4">
            <XCircle className="w-4 h-4" /> A Armadilha dos Modelos Comuns
          </span>
          <h3 className="text-2xl font-bold mb-4 text-white">Sites Genéricos de IA</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Um prompt rápido no ChatGPT gera um texto que parece igual ao de 100 outras empresas. Sem estratégia local, sem SEO e sem a essência da sua marca.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Textos padronizados e artificiais
            </li>
            <li className="flex items-center gap-2.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Não configurado no Google Meu Negócio
            </li>
            <li className="flex items-center gap-2.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Dificuldade para adaptar cores e identidade
            </li>
          </ul>
        </div>

        {/* Card Seu Site Único */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-blue-950/60 to-slate-900/90 border border-cyan-500/40 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] group">
          <div className="absolute top-0 right-0 p-6 opacity-15 group-hover:opacity-25 transition-opacity">
            <Sparkles className="w-24 h-24 text-cyan-400" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-4">
            <CheckCircle className="w-4 h-4 text-cyan-400" /> O Método Seu Site Único
          </span>
          <h3 className="text-2xl font-bold mb-4 text-white">Criado sob Medida com Briefing</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            O Briefing Mestre alimenta os prompts com o DNA do seu negócio. O resultado é um site autêntico, otimizado para o Google e pronto para vender.
          </p>
          <ul className="space-y-3 text-sm text-slate-200">
            <li className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" /> Identidade visual marcante e tipografia refinada
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" /> SEO Local e indexação no Google Search Console
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" /> Botão de WhatsApp com mensagem pré-formatada
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
