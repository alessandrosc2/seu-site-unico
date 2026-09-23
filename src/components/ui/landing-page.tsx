"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"; 
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  Globe2, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Copy,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export interface MethodFeature {
  title: string;
  description: string;
}

export interface MethodAction {
  label: string;
  variant: "primary" | "secondary";
  onClick?: () => void;
}

export interface MethodSection {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: "left" | "center" | "right";
  icon?: React.ReactNode;
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
    { top: "50%", left: "75%", scale: 1.35 },  // Hero / Fase 1: Right side
    { top: "22%", left: "50%", scale: 1.0 },   // Fase 2: Top Center (Screenshot 1)
    { top: "50%", left: "85%", scale: 1.65 },  // Fase 3: Right side large (Screenshot 2)
    { top: "50%", left: "50%", scale: 2.1 },   // Fase 4: Center backdrop (Screenshot 3)
  ]
};

const parsePercent = (str: string): number => parseFloat(str.replace("%", ""));

export function ScrollGlobe({ 
  sections, 
  globeConfig = defaultGlobeConfig, 
  className 
}: ScrollGlobeProps) {
  const methodSections: MethodSection[] = useMemo(() => sections || [
    {
      id: "fase-1-construir",
      badge: "Fase 01 — Construir",
      title: "Crie o Site do Seu Negócio",
      subtitle: "Construção Guiada com IA",
      description: "Esqueça modelos genéricos. O formulário guiado extrai os diferenciais, serviços e estilo visual da sua empresa para criar prompts de IA sob medida.",
      align: "left",
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      features: [
        { 
          title: "Briefing Mestre Inteligente", 
          description: "Reúne nome, diferenciais, público, horários e links do seu negócio sem complicação técnica." 
        },
        { 
          title: "Prompts Prontos de Alta Conversão", 
          description: "Copywriting persuasivo e design exclusivo gerados por inteligência artificial com a cara da sua marca." 
        },
        { 
          title: "Revisão Mobile-First", 
          description: "Garantia de layout impecável e botões clicáveis em todos os smartphones." 
        }
      ],
      actions: [
        { 
          label: "Quero Meu Site Único", 
          variant: "primary", 
          onClick: () => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } 
        },
        { 
          label: "Ver Nichos Atendidos", 
          variant: "secondary", 
          onClick: () => {
            const el = document.getElementById("nichos");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } 
        }
      ]
    },
    {
      id: "fase-2-publicar",
      badge: "Fase 02 — Publicar",
      title: "Domínio Próprio & WhatsApp",
      subtitle: "No Ar em Poucos Minutos",
      description: "Coloque seu site na internet com seu próprio endereço oficial (.com.br), certificado de segurança SSL gratuito e botão de WhatsApp estratégico para transformar visitantes em clientes reais.",
      align: "center",
      icon: <Globe2 className="w-5 h-5 text-blue-400" />,
      actions: [
        { 
          label: "Ver Passo a Passo", 
          variant: "primary", 
          onClick: () => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } 
        }
      ]
    },
    {
      id: "fase-3-ser-encontrado",
      badge: "Fase 03 — Ser Encontrado",
      title: "Apareça no Google",
      subtitle: "SEO Local & Indexação",
      description: "Conecte seu Google Meu Negócio, submeta o sitemap ao Google Search Console e seja encontrado quando clientes pesquisarem pelos seus serviços na sua região.",
      align: "left",
      icon: <Search className="w-5 h-5 text-emerald-400" />,
      features: [
        { 
          title: "Google Meu Negócio & Mapas", 
          description: "Configuração completa do perfil local com horário, fotos, avaliações e link direto para o site." 
        },
        { 
          title: "Google Search Console & Indexação", 
          description: "Envio de sitemap XML para que as páginas do seu site apareçam rapidamente nas buscas orgânicas." 
        },
        { 
          title: "SEO On-Page & Palavras-Chave", 
          description: "Meta tags, títulos h1/h2 e dados estruturados otimizados para atrair clientes da sua região geográfica." 
        }
      ],
      actions: [
        { 
          label: "Garantir Minha Vaga", 
          variant: "primary", 
          onClick: () => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } 
        }
      ]
    },
    {
      id: "fase-4-renda-extra",
      badge: "Fase 04 — Trilha Renda Extra",
      title: "Fature Criando Sites",
      subtitle: "R$ 200 a R$ 800 por Projeto",
      description: "Mais de 50% das empresas locais ainda não têm site. Use o mesmo método para oferecer criação de sites na sua cidade com propostas prontas e abordagem ética.",
      align: "center",
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
      actions: [
        { 
          label: "Começar Agora", 
          variant: "primary", 
          onClick: () => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } 
        },
        { 
          label: "Simulador de Ganhos", 
          variant: "secondary", 
          onClick: () => {
            const el = document.getElementById("calculadora");
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
  const [isInView, setIsInView] = useState(true);

  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
    
    setScrollProgress(progress);

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const inView = containerRect.bottom > 200 && containerRect.top < window.innerHeight - 100;
      setIsInView(inView);
    }

    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
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
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    const initialPos = calculatedPositions[0];
    const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  return (
    <div 
      ref={containerRef}
      id="metodo"
      className={cn(
        "relative w-full max-w-screen overflow-x-hidden min-h-screen bg-[#070d1e] text-slate-100",
        className
      )}
    >
      {/* Top Site Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 sm:px-12 bg-[#070d1e]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Seu Site <span className="text-cyan-400">Único</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#metodo" className="hover:text-cyan-400 transition-colors">O Método</a>
          <a href="#nichos" className="hover:text-cyan-400 transition-colors">Exemplos de Nichos</a>
          <a href="#calculadora" className="hover:text-cyan-400 transition-colors">Renda Extra</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Planos & Preços</a>
        </nav>

        <a
          href="#pricing"
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/25 hover:scale-105"
        >
          Começar Agora
        </a>
      </header>

      {/* Dynamic Background Atmospheric Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,#111e4d_0%,#070d1e_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Persistent Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 will-change-transform shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          style={{ 
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: "left center",
            transition: "transform 0.15s ease-out"
          }}
        />
      </div>

      {/* Enhanced Floating Right Navigation with auto-hiding labels */}
      <div className={cn(
        "hidden sm:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 transition-all duration-500",
        isInView ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="space-y-4 lg:space-y-6">
          {methodSections.map((section, index) => {
            const isCurrent = activeSection === index;
            return (
              <div key={section.id} className="relative group flex items-center justify-end">
                {/* Auto-fading label on hover / active */}
                <div
                  className={cn(
                    "nav-label absolute right-7 lg:right-9 top-1/2 -translate-y-1/2",
                    "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap",
                    "bg-slate-900/95 text-slate-200 backdrop-blur-md border border-slate-700/80 shadow-2xl transition-all duration-300 pointer-events-none",
                    isCurrent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", isCurrent ? "bg-cyan-400 animate-pulse" : "bg-slate-500")} />
                    <span>{section.badge || `Fase ${index + 1}`}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sectionRefs.current[index]?.scrollIntoView({ 
                      behavior: "smooth",
                      block: "center"
                    });
                  }}
                  className={cn(
                    "relative w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer",
                    isCurrent 
                      ? "bg-cyan-400 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.9)] scale-125" 
                      : "bg-transparent border-slate-600 hover:border-cyan-400 hover:bg-cyan-400/20"
                  )}
                  aria-label={`Navegar para ${section.badge || `Fase ${index + 1}`}`}
                />
              </div>
            );
          })}
        </div>
        
        {/* Navigation track line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent -translate-x-1/2 -z-10" />
      </div>

      {/* Ultra-smooth 3D Globe with responsive scaling & position shifts */}
      <div
        className={cn(
          "fixed top-0 left-0 z-10 pointer-events-none will-change-transform transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
          isInView ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: globeTransform,
          filter: `opacity(${activeSection === 3 ? 0.35 : 0.95})`,
        }}
      >
        <div className="scale-75 sm:scale-90 lg:scale-100 filter drop-shadow-[0_0_50px_rgba(6,182,212,0.3)]">
          <Globe />
        </div>
      </div>

      {/* Dynamic Scrollytelling Sections */}
      {methodSections.map((section, index) => {
        return (
          <section
            key={section.id}
            ref={(el) => { sectionRefs.current[index] = el; }}
            className={cn(
              "relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 z-20 py-24 sm:py-32",
              "w-full max-w-full overflow-hidden",
              section.align === "center" && "items-center text-center",
              section.align === "right" && "items-end text-right",
              section.align !== "center" && section.align !== "right" && "items-start text-left"
            )}
          >
            <div className={cn(
              "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl will-change-transform transition-all duration-700",
              "opacity-100 translate-y-0"
            )}>
              {/* Badge */}
              <div className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-5",
                "bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 backdrop-blur-md shadow-sm",
                section.align === "center" && "mx-auto",
                section.align === "right" && "ml-auto"
              )}>
                {section.icon}
                <span>{section.badge}</span>
              </div>

              {/* Title & Subtitle */}
              <h2 className={cn(
                "font-black tracking-tight mb-5 leading-[1.1] text-white",
                index === 0 
                  ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl" 
                  : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              )}>
                {section.subtitle ? (
                  <div className="space-y-1.5">
                    <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent block">
                      {section.title}
                    </span>
                    <span className="text-cyan-400 text-[0.55em] font-semibold tracking-wide uppercase block">
                      {section.subtitle}
                    </span>
                  </div>
                ) : (
                  <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {section.title}
                  </span>
                )}
              </h2>

              {/* Description */}
              <div className={cn(
                "text-slate-300/90 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-normal max-w-2xl",
                section.align === "center" ? "mx-auto text-center" : "",
                section.align === "right" ? "ml-auto text-right" : ""
              )}>
                <p>{section.description}</p>
                {index === 0 && (
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Experiência Interativa 3D</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "0.5s" }} />
                      <span>Role para Explorar as 4 Fases</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Cards */}
              {section.features && (
                <div className="grid gap-3.5 sm:gap-4 mb-8 sm:mb-10 text-left">
                  {section.features.map((feature, fIndex) => (
                    <div
                      key={feature.title}
                      className={cn(
                        "group p-4 sm:p-5 rounded-xl border transition-all duration-300",
                        "bg-slate-900/70 backdrop-blur-md border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-cyan-950/40"
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                        <div className="space-y-1 min-w-0">
                          <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-cyan-300 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions & Buttons */}
              {section.actions && (
                <div className={cn(
                  "flex flex-col sm:flex-row flex-wrap gap-3.5 sm:gap-4",
                  section.align === "center" && "justify-center",
                  section.align === "right" && "justify-end",
                  (!section.align || section.align === "left") && "justify-start"
                )}>
                  {section.actions.map((action, actionIdx) => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base cursor-pointer shadow-lg",
                        action.variant === "primary"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-950/50 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]"
                          : "border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 active:scale-[0.98]"
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
        );
      })}
    </div>
  );
}

export default ScrollGlobe;
