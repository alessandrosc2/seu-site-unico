"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"; 
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, CheckCircle2, Copy, Globe2, Search, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export interface MethodAction {
  label: string;
  variant: "primary" | "secondary";
  onClick?: () => void;
}

export interface MethodFeature {
  title: string;
  description: string;
}

export interface MethodSection {
  id: string;
  phaseNumber: string;
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: "left" | "center" | "right";
  icon?: React.ReactNode;
  promptPreview?: string;
  features?: MethodFeature[];
  actions?: MethodAction[];
}

export interface ScrollGlobeProps {
  sections?: MethodSection[];
  globeConfig?: {
    positions: {
      top: string;
      left: string;
      scale: number;
    }[];
  };
  className?: string;
}

const defaultGlobeConfig = {
  positions: [
    { top: "45%", left: "75%", scale: 1.3 },   // Fase 1: Direita, equilibrado
    { top: "30%", left: "25%", scale: 1.1 },   // Fase 2: Esquerda, sutil
    { top: "50%", left: "78%", scale: 1.4 },   // Fase 3: Direita, zoom
    { top: "50%", left: "50%", scale: 1.8 },   // Fase 4: Centro, grande backdrop
  ]
};

const parsePercent = (str: string): number => parseFloat(str.replace("%", ""));

export function ScrollGlobe({ sections, globeConfig = defaultGlobeConfig, className }: ScrollGlobeProps) {
  const methodSections: MethodSection[] = useMemo(() => sections || [
    {
      id: "fase-1-construir",
      phaseNumber: "Fase 01",
      badge: "Construir",
      title: "O Briefing Mestre & Prompts",
      subtitle: "Construção Guiada com IA",
      description: "Esqueça modelos genéricos. O formulário guiado extrai a verdadeira alma, diferenciais, serviços e estilo visual do seu negócio para gerar prompts específicos.",
      align: "left",
      icon: <Sparkles className="w-5 h-5 text-blue-500" />,
      promptPreview: "Atue como um Diretor de Design e crie a estrutura HTML/CSS personalizada para um negócio de [SERVIÇO] em [CIDADE] com a paleta [CORES] e foco em conversão no WhatsApp...",
      features: [
        { title: "Briefing Mestre Inteligente", description: "Reúne nome, diferenciais, público, horários e links do seu negócio sem complicação." },
        { title: "Direção Visual Única", description: "Prompts prontos para paletas de cores, tipografia, fotos e personalidade da sua marca." },
        { title: "Revisão Mobile-First", description: "Checklist de responsividade, tamanhos de toque, espaçamento e leitura em celulares." }
      ],
      actions: [
        { label: "Ver Modelo de Prompts", variant: "primary", onClick: () => { toast.success("Prompts desbloqueados no manual!"); } },
      ]
    },
    {
      id: "fase-2-publicar",
      phaseNumber: "Fase 02",
      badge: "Publicar",
      title: "Domínio Próprio & WhatsApp",
      subtitle: "No Ar em Minutos",
      description: "Coloque seu site na internet com seu próprio nome (.com.br), certificado de segurança HTTPS e botão de WhatsApp 100% integrado para receber clientes.",
      align: "right",
      icon: <Globe2 className="w-5 h-5 text-indigo-500" />,
      features: [
        { title: "Domínio .com.br Descomplicado", description: "Passo a passo visual para registrar no Registro.br e conectar sem dor de cabeça." },
        { title: "Google Meu Negócio Configurado", description: "Crie ou reivindique seu perfil local com horários, fotos e link direto para o site." },
        { title: "Links e Conversão Testados", description: "Botão flutuante de WhatsApp com mensagem personalizada para fechar vendas." }
      ],
      actions: [
        { label: "Como Configurar o Domínio", variant: "secondary", onClick: () => { toast.info("Guia de domínio disponível no passo a passo!"); } }
      ]
    },
    {
      id: "fase-3-ser-encontrado",
      phaseNumber: "Fase 03",
      badge: "Ser Encontrado",
      title: "SEO Local & Google Search Console",
      subtitle: "Indexação e Visibilidade",
      description: "Apareça quando os clientes pesquisarem pelos seus serviços na sua cidade. Conecte Google Analytics, Search Console e garanta conformidade com a LGPD.",
      align: "left",
      icon: <Search className="w-5 h-5 text-cyan-500" />,
      features: [
        { title: "SEO Local & Palavras-Chave", description: "Otimização de títulos, meta tags, velocidade e consistência de endereço/telefone." },
        { title: "Google Search Console & Sitemap", description: "Envie seu sitemap para indexação acelerada nos motores de busca." },
        { title: "Google Analytics & LGPD", description: "Métricas de visitantes em tempo real com aviso de privacidade configurado." }
      ],
      actions: [
        { label: "Técnicas de SEO Inclusas", variant: "primary", onClick: () => { toast.success("Módulo de SEO desbloqueado no Plano Completo!"); } }
      ]
    },
    {
      id: "fase-4-renda-extra",
      phaseNumber: "Fase 04",
      badge: "Trilha Renda Extra",
      title: "Venda Sites para Negócios Locais",
      subtitle: "R$ 200 a R$ 800 por Projeto",
      description: "Aprenda a encontrar empresas sem site no Google da sua região, faça abordagens profissionais e éticas (respeitando a LGPD) e fature prestando esse serviço.",
      align: "center",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      features: [
        { title: "Prospecção Ética no Google Maps", description: "Como mapear negócios locais que só têm rede social e precisam de presença própria." },
        { title: "Modelo de Proposta e Contrato", description: "Documentos prontos para enviar orçamentos claros e fechar clientes com segurança." },
        { title: "Entrega e Pós-Venda", description: "Processo redondo para registrar o domínio no nome do cliente e fidelizar." }
      ],
      actions: [
        { 
          label: "Quero a Trilha Completa", 
          variant: "primary", 
          onClick: () => {
            const el = document.getElementById("planos");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        }
      ]
    }
  ], [sections]);

  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const animationFrameId = useRef<number | undefined>(undefined);

  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  const updateScrollPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate progress within this specific scrollytelling container
    const totalHeight = rect.height - windowHeight;
    const currentScroll = Math.max(0, -rect.top);
    const progress = Math.min(Math.max(currentScroll / Math.max(totalHeight, 1), 0), 1);
    
    setScrollProgress(progress);

    const viewportCenter = windowHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const sRect = ref.getBoundingClientRect();
        const sectionCenter = sRect.top + sRect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    const currentPos = calculatedPositions[newActiveSection] || calculatedPositions[0];
    const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;
    
    setGlobeTransform(transform);
    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    const initialPos = calculatedPositions[0];
    const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copiado com sucesso! Cole na sua IA.");
  };

  return (
    <div 
      ref={containerRef}
      id="metodo"
      className={cn(
        "relative w-full overflow-hidden bg-[#070d1e] text-white py-12",
        className
      )}
    >
      {/* Background Starfield & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1e295d_0%,#070d1e_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Progress Bar */}
      <div className="sticky top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 will-change-transform shadow-[0_0_12px_rgba(59,130,246,0.8)]"
          style={{ 
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: "left center",
            transition: "transform 0.1s ease-out"
          }}
        />
      </div>

      {/* Lateral Sticky Navigator */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-5 bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl">
        {methodSections.map((section, index) => (
          <button
            key={index}
            onClick={() => {
              sectionRefs.current[index]?.scrollIntoView({ 
                behavior: "smooth",
                block: "center"
              });
            }}
            className="group relative flex items-center justify-end"
            aria-label={`Ir para ${section.badge}`}
          >
            <span className={cn(
              "absolute right-7 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-300 pointer-events-none",
              "bg-slate-900/90 border border-white/10 text-slate-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            )}>
              {section.phaseNumber}: {section.badge}
            </span>
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeSection === index 
                ? "bg-cyan-400 scale-125 shadow-[0_0_10px_#22d3ee]" 
                : "bg-white/20 hover:bg-white/50"
            )} />
          </button>
        ))}
      </div>

      {/* Ultra-smooth Dynamic 3D CSS Globe */}
      <div
        className="fixed z-10 pointer-events-none will-change-transform transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          opacity: activeSection === 3 ? 0.35 : 0.88,
        }}
      >
        <div className="scale-75 sm:scale-90 lg:scale-100">
          <Globe />
        </div>
      </div>

      {/* Sections Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {methodSections.map((section, index) => (
          <section
            key={section.id}
            ref={(el) => { sectionRefs.current[index] = el; }}
            className={cn(
              "min-h-[90vh] flex flex-col justify-center py-20",
              section.align === "center" && "items-center text-center",
              section.align === "right" && "items-end text-right",
              section.align !== "center" && section.align !== "right" && "items-start text-left"
            )}
          >
            <div className="w-full max-w-xl lg:max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              
              {/* Badge & Phase */}
              <div className={cn(
                "flex items-center gap-3 mb-5",
                section.align === "center" && "justify-center",
                section.align === "right" && "justify-end"
              )}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                  {section.icon}
                  {section.phaseNumber}
                </span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                  {section.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-cyan-400 font-medium text-sm sm:text-base tracking-wide uppercase mb-4">
                  {section.subtitle}
                </p>
              )}

              {/* Description */}
              <p className="text-slate-300 leading-relaxed text-base sm:text-lg mb-8 font-light">
                {section.description}
              </p>

              {/* Prompt Box Preview (Fase 1) */}
              {section.promptPreview && (
                <div className="mb-8 p-4 rounded-2xl bg-black/50 border border-cyan-500/30 font-mono text-xs text-cyan-200/90 relative group">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10 text-[10px] text-slate-400">
                    <span>EXEMPLO DE PROMPT GUIADO</span>
                    <button 
                      onClick={() => copyPrompt(section.promptPreview || "")}
                      className="flex items-center gap-1 text-cyan-300 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" /> Copiar
                    </button>
                  </div>
                  <p className="line-clamp-3 italic">{section.promptPreview}</p>
                </div>
              )}

              {/* Features List */}
              {section.features && (
                <div className="grid gap-3.5 mb-8 text-left">
                  {section.features.map((feature) => (
                    <div 
                      key={feature.title}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">{feature.title}</h3>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Buttons */}
              {section.actions && (
                <div className={cn(
                  "flex flex-wrap gap-3",
                  section.align === "center" && "justify-center",
                  section.align === "right" && "justify-end"
                )}>
                  {section.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 shadow-lg",
                        action.variant === "primary"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:brightness-110"
                          : "bg-white/10 text-slate-200 border border-white/15 hover:bg-white/20"
                      )}
                    >
                      <span>{action.label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              )}

            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function GlobeScrollDemo() {
  return <ScrollGlobe />;
}
