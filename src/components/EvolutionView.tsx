import React from 'react';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Target,
  Clock,
  ArrowUp,
  Sparkles,
} from 'lucide-react';
import { Subject, StudentProfile } from '../types';

interface EvolutionViewProps {
  subjects: Subject[];
  profile: StudentProfile;
  onStartFocus: (topic?: string, subject?: string) => void;
}

export const EvolutionView: React.FC<EvolutionViewProps> = ({
  subjects,
  profile,
  onStartFocus,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight">
          Evolução & Desempenho
        </h1>
        <p className="text-base md:text-lg text-[#434655] mt-1">
          Acompanhe seu crescimento contínuo, pontos fortes e recomendações de reforço.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#c3c6d7]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#737686]">Média de Domínio</span>
            <div className="p-2 rounded-xl bg-[#dbe1ff] text-[#004ac6]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#004ac6]">
              {profile.generalAverage}%
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 stroke-[3]" /> +8% neste mês
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#c3c6d7]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#737686]">Questões Feitas</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#191c1e]">
              {profile.questionsSolved.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-[#737686] font-medium mt-1 block">
              145 feitas esta semana
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#c3c6d7]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#737686]">Sequência de Foco</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-600">
              {profile.streakDays} Dias
            </span>
            <span className="text-xs text-[#737686] font-medium mt-1 block">Recorde: 12 dias</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#c3c6d7]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#737686]">Tempo de Estudo</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#191c1e]">18h 45m</span>
            <span className="text-xs text-[#737686] font-medium mt-1 block">Média de 2h30/dia</span>
          </div>
        </div>
      </div>

      {/* Main Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mastery by Discipline */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#c3c6d7]/30 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#191c1e]">Domínio por Disciplina</h2>
            <span className="text-xs font-semibold text-[#737686]">Meta Geral: 85%</span>
          </div>

          <div className="flex flex-col gap-5">
            {subjects.map((sub) => (
              <div key={sub.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#191c1e] flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                    {sub.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#737686]">{sub.questionsCount} questões</span>
                    <span className="text-base font-extrabold text-[#191c1e]">
                      {sub.masteryPercentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar with threshold */}
                <div className="w-full h-3 bg-[#eceef0] rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${sub.masteryPercentage}%`,
                      backgroundColor:
                        sub.masteryPercentage >= 90
                          ? '#004ac6'
                          : sub.masteryPercentage >= 80
                            ? '#505f76'
                            : '#bc4800',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recommendations & Weak points */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#c3c6d7]/30 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Recomendações da Semana
              </h3>
            </div>

            <p className="text-xs text-[#434655] leading-relaxed">
              Com base nos seus erros mais recentes, concentre suas próximas 2 sessões nestes
              conteúdos:
            </p>

            <div className="flex flex-col gap-2.5 mt-1">
              <div
                onClick={() => onStartFocus('Frações e Operações', 'Matemática')}
                className="p-3 bg-[#ffdad6]/40 hover:bg-[#ffdad6] rounded-xl border border-[#ba1a1a]/20 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#191c1e]">Frações e Operações</span>
                  <span className="text-xs font-extrabold text-[#ba1a1a]">54%</span>
                </div>
                <span className="text-[11px] text-[#737686]">Matemática • Prova em 7 dias</span>
              </div>

              <div
                onClick={() => onStartFocus('Biomas Brasileiros', 'Geografia')}
                className="p-3 bg-[#f2f4f6] hover:bg-[#eceef0] rounded-xl border border-[#c3c6d7]/30 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#191c1e]">Biomas do Brasil</span>
                  <span className="text-xs font-extrabold text-[#505f76]">72%</span>
                </div>
                <span className="text-[11px] text-[#737686]">Geografia • Trabalho de entrega</span>
              </div>
            </div>

            <button
              onClick={() => onStartFocus('Sessão Estratégica de Reforço', 'Matemática')}
              className="mt-2 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Iniciar Sessão Estratégica</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
