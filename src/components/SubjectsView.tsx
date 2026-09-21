import React from 'react';
import { 
  Calculator, 
  BookOpen, 
  FlaskConical, 
  Landmark, 
  Globe2, 
  Languages, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Play, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Subject, StudentProfile } from '../types';

export const LIBRARY_BANNER_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAHs17ruTNNF8711wa7Faeh-LbMm_jb-tCR9-isG3-kK3oSaZvIyqv_qisMQwsJMdBjn3u0IsigP5NzqQUhghNue9io0GaeVwpd7Sl0CJGKHvx01ncbupFKYXGtjG4ujWUfh-ECzoZZpjVN0CcPPPqY2zoa8613wB6NoCSbCrQsVDwmXT6U2qIDzGZ9pTi3YfxgcPzq4vC2TOVH9gqBayXwhN53xUwy_JehjYPqMAx7lpdBfuaqwOaFXg";

interface SubjectsViewProps {
  subjects: Subject[];
  profile: StudentProfile;
  onSelectSubject: (subject: Subject) => void;
  onStartFocus: (topicName?: string, subjectName?: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  profile,
  onSelectSubject,
  onStartFocus,
}) => {
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'calculate':
        return <Calculator className="w-7 h-7" />;
      case 'menu_book':
        return <BookOpen className="w-7 h-7" />;
      case 'science':
        return <FlaskConical className="w-7 h-7" />;
      case 'account_balance':
        return <Landmark className="w-7 h-7" />;
      case 'public':
        return <Globe2 className="w-7 h-7" />;
      case 'language':
        return <Languages className="w-7 h-7" />;
      default:
        return <BookOpen className="w-7 h-7" />;
    }
  };

  const getSubjectIconBg = (id: string) => {
    switch (id) {
      case 'matematica':
        return 'bg-[#2563eb] text-white';
      case 'portugues':
        return 'bg-[#d0e1fb] text-[#505f76]';
      case 'ciencias':
        return 'bg-[#bc4800] text-white';
      case 'historia':
        return 'bg-[#e0e3e5] text-[#434655]';
      case 'geografia':
        return 'bg-[#d0e1fb] text-[#505f76]';
      case 'ingles':
        return 'bg-[#2563eb] text-white';
      default:
        return 'bg-[#2563eb] text-white';
    }
  };

  const getProgressBarColor = (id: string) => {
    switch (id) {
      case 'matematica':
        return 'bg-[#004ac6]';
      case 'portugues':
        return 'bg-[#505f76]';
      case 'ciencias':
        return 'bg-[#943700]';
      case 'historia':
        return 'bg-[#434655]';
      case 'geografia':
        return 'bg-[#505f76]';
      case 'ingles':
        return 'bg-[#004ac6]';
      default:
        return 'bg-[#004ac6]';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 flex flex-col gap-10">
      {/* Header Area with Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 w-full">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight">
            Visão Geral das Matérias
          </h1>
          <p className="text-base md:text-lg text-[#434655] leading-relaxed">
            Acompanhe o desempenho do {profile.name} em cada disciplina. A consistência é a chave para a evolução contínua.
          </p>
        </div>

        {/* Stats Pill / Box */}
        <div 
          id="general-mastery-stats-box"
          className="flex items-center gap-6 bg-[#eceef0] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden group border border-[#c3c6d7]/30 shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#004ac6]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-xs font-bold text-[#737686] uppercase tracking-wider">
              Média Geral
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#004ac6] tracking-tight">
              {profile.generalAverage}%
            </span>
          </div>

          <div className="w-px h-12 bg-[#c3c6d7]/60 relative z-10" />

          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-xs font-bold text-[#737686] uppercase tracking-wider">
              Questões Feitas
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#191c1e] tracking-tight">
              {profile.questionsSolved.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Decorative chart watermark */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 text-[#004ac6]/5 rotate-12 pointer-events-none">
            <Layers className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Bento Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => {
          const isWarning = sub.alertCount && sub.alertCount > 0;
          return (
            <div
              key={sub.id}
              id={`subject-card-${sub.id}`}
              onClick={() => onSelectSubject(sub)}
              className="flex flex-col bg-white rounded-3xl p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer border border-[#c3c6d7]/30"
            >
              {/* Subtle top corner ambient flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#004ac6]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700 pointer-events-none" />

              {/* Icon & Alert Header */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${getSubjectIconBg(sub.id)}`}>
                  {getSubjectIcon(sub.icon)}
                </div>

                {isWarning && (
                  <div className="bg-[#ffdad6] text-[#93000a] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{sub.alertMessage || `${sub.alertCount} conteúdos em alerta`}</span>
                  </div>
                )}
              </div>

              {/* Subject Title & Stats */}
              <div className="flex flex-col gap-1 mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
                  {sub.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#434655] font-medium">
                  <span>{sub.contentsCount} conteúdos abordados</span>
                  <span className="w-1 h-1 rounded-full bg-[#737686]" />
                  <span>{sub.questionsCount} questões</span>
                </div>
              </div>

              {/* Mastery & Progress Bar */}
              <div className="mt-auto flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-[#737686] uppercase tracking-wider">
                    Domínio
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#191c1e]">
                      {sub.masteryPercentage}%
                    </span>
                    
                    {sub.masteryTrend > 0 ? (
                      <span className="text-xs font-bold text-[#004ac6] flex items-center">
                        <ArrowUp className="w-3 h-3 stroke-[3]" /> {sub.masteryTrend}%
                      </span>
                    ) : sub.masteryTrend < 0 ? (
                      <span className="text-xs font-bold text-[#ba1a1a] flex items-center">
                        <ArrowDown className="w-3 h-3 stroke-[3]" /> {Math.abs(sub.masteryTrend)}%
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#737686] flex items-center">
                        <Minus className="w-3 h-3" /> 0%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressBarColor(sub.id)} rounded-full relative transition-all duration-700`}
                    style={{ width: `${sub.masteryPercentage}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent" />
                  </div>
                </div>

                <div className="pt-2 text-[11px] font-semibold text-[#004ac6] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span>Ver tópicos e exercícios</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Image Banner for Visual Richness */}
      <div 
        id="motivational-study-banner"
        className="mt-4 relative w-full min-h-[260px] rounded-3xl overflow-hidden shadow-md flex items-center p-8 md:p-12 border border-[#c3c6d7]/30 group"
      >
        {/* Background photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ 
            backgroundImage: `url('${LIBRARY_BANNER_URL}')` 
          }}
        />
        
        {/* Soft elegant gradient overlay matching design tokens */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9fb]/95 via-[#f7f9fb]/80 to-transparent mix-blend-normal" />

        {/* Content */}
        <div className="relative z-10 max-w-xl flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#004ac6] text-xs font-bold w-fit shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recomendação Personalizada</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            Continue assim, {profile.name}!
          </h3>
          
          <p className="text-sm md:text-base text-[#434655] font-normal leading-relaxed">
            Sua consistência em <strong className="font-semibold text-[#191c1e]">Ciências</strong> e <strong className="font-semibold text-[#191c1e]">Inglês</strong> está excelente e acima da meta estipulada. Vamos dar uma olhada nos pontos de atenção em <strong className="font-semibold text-[#ba1a1a]">Matemática</strong> hoje?
          </p>

          <button 
            id="banner-focus-session-btn"
            onClick={() => onStartFocus('Pontos de Atenção em Matemática', 'Matemática')}
            className="mt-2 px-6 py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-medium text-sm w-fit transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer group-hover:translate-x-1"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar Sessão de Foco</span>
          </button>
        </div>
      </div>
    </div>
  );
};
