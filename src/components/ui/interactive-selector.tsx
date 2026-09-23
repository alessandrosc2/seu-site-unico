"use client";

import React, { useState, useEffect } from "react";
import { 
  Scale, 
  Stethoscope, 
  Dumbbell, 
  Dog, 
  Scissors, 
  Laptop,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface NicheOption {
  title: string;
  category: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  tags: string[];
}

const defaultOptions: NicheOption[] = [
  {
    title: "Advocacia & Jurídico",
    category: "Serviços Especializados",
    description: "Transmita autoridade máxima, destaque suas especialidades e receba contatos qualificados.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    icon: <Scale className="w-5 h-5 text-cyan-400" />,
    tags: ["Direito Civil", "Trabalhista", "Previdenciário", "Contratos"]
  },
  {
    title: "Clínicas & Saúde",
    category: "Saúde & Bem-Estar",
    description: "Apresente seus tratamentos, mostre depoimentos reais e integre agendamento direto no WhatsApp.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
    tags: ["Odontologia", "Psicologia", "Fisioterapia", "Nutrição"]
  },
  {
    title: "Academias & Fitness",
    category: "Esporte & Treino",
    description: "Destaque planos, grade de horários, fotos da estrutura e converta novos alunos em minutos.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    icon: <Dumbbell className="w-5 h-5 text-amber-400" />,
    tags: ["Crossfit", "Musculação", "Personal Trainer", "Pilates"]
  },
  {
    title: "Pet Shop & Veterinária",
    category: "Cuidados Pet",
    description: "Catálogo de banho & tosa, vacinação, exames e agendamento prático para tutores de animais.",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
    icon: <Dog className="w-5 h-5 text-pink-400" />,
    tags: ["Banho e Tosa", "Consultas", "Hotel Pet", "Cirurgias"]
  },
  {
    title: "Barbearias & Beleza",
    category: "Estética & Imagem",
    description: "Galeria de cortes, catálogo de serviços e posicionamento premium que valoriza seu trabalho.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    icon: <Scissors className="w-5 h-5 text-purple-400" />,
    tags: ["Barba & Cabelo", "Coloração", "Estética Facial", "Noivo"]
  },
  {
    title: "Freelancers & Projetos",
    category: "Profissionais Autônomos",
    description: "Portfólio com alta conversão para designers, arquitetos, fotógrafos e consultores.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    icon: <Laptop className="w-5 h-5 text-blue-400" />,
    tags: ["Designers", "Programadores", "Arquitetos", "Consultores"]
  }
];

export interface InteractiveSelectorProps {
  options?: NicheOption[];
  title?: string;
  subtitle?: string;
}

export const InteractiveSelector: React.FC<InteractiveSelectorProps> = ({
  options = defaultOptions,
  title = "Sites únicos para qualquer tipo de negócio",
  subtitle = "Não importa o seu nicho. O método gera a estrutura ideal, copywriting persuasivo e design sob medida para a sua área de atuação."
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 120 * i);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [options]);

  return (
    <section className="relative py-24 px-4 bg-slate-950 text-white overflow-hidden border-t border-slate-900">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full max-w-3xl mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptável a Qualquer Segmento
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Desktop / Tablet Interactive Accordion */}
        <div className="hidden sm:flex options w-full max-w-5xl h-[460px] items-stretch overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl relative">
          {options.map((option, index) => {
            const isActive = activeIndex === index;
            const isAnimated = animatedOptions.includes(index);

            return (
              <div
                key={index}
                className="option relative flex flex-col justify-end overflow-hidden cursor-pointer transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url('${option.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: isAnimated ? 1 : 0,
                  transform: isAnimated ? "translateX(0)" : "translateX(-30px)",
                  minWidth: "70px",
                  borderColor: isActive ? "rgba(6, 182, 212, 0.8)" : "rgba(51, 65, 85, 0.4)",
                  borderRightWidth: index === options.length - 1 ? 0 : "1px",
                  borderStyle: "solid",
                  flex: isActive ? "6 1 0%" : "1 1 0%",
                  zIndex: isActive ? 10 : 1,
                  boxShadow: isActive ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)" : "none"
                }}
                onClick={() => handleOptionClick(index)}
              >
                {/* Dynamic Vignette & Dark Gradient Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: isActive
                      ? "linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.65) 45%, rgba(2, 6, 23, 0.2) 100%)"
                      : "linear-gradient(to top, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0.75) 100%)"
                  }}
                />

                {/* Content Block */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end pointer-events-none z-10">
                  <div className="flex items-center gap-3.5 mb-2">
                    <div className="min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg shrink-0 transition-transform duration-300">
                      {option.icon}
                    </div>

                    <div
                      className="transition-all duration-500 overflow-hidden"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "translateX(0)" : "translateX(15px)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block">
                        {option.category}
                      </span>
                      <h3 className="font-bold text-xl text-white drop-shadow-md">
                        {option.title}
                      </h3>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <div
                    className="transition-all duration-700 overflow-hidden"
                    style={{
                      maxHeight: isActive ? "160px" : "0px",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(15px)"
                    }}
                  >
                    <p className="text-sm text-slate-300 font-normal mb-3 max-w-lg leading-relaxed">
                      {option.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {option.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vertical label for inactive tabs */}
                {!isActive && (
                  <div className="absolute inset-x-0 bottom-24 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-semibold text-slate-400 tracking-wider rotate-[-90deg] whitespace-nowrap drop-shadow">
                      {option.title}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Accordion Card View */}
        <div className="sm:hidden flex flex-col gap-4 w-full">
          {options.map((option, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? "border-cyan-500/80 shadow-lg shadow-cyan-950/50" 
                    : "border-slate-800 bg-slate-900/60"
                }`}
              >
                <div
                  className="h-36 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${option.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-center shrink-0">
                      {option.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-cyan-400 block">
                        {option.category}
                      </span>
                      <h3 className="font-bold text-base text-white">
                        {option.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800/80 animate-fadeIn">
                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {option.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {option.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Micro CTA below the selector */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 text-center">
          <p className="text-sm text-slate-400">
            Tem outro tipo de negócio? O <strong className="text-white">Briefing Mestre</strong> adapta a IA para qualquer segmento ou prestação de serviço.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Ver Planos <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSelector;
