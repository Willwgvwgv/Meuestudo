import React from 'react';
import { 
  X, 
  Play, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  ArrowUp, 
  ArrowDown, 
  Minus 
} from 'lucide-react';
import { Subject } from '../types';

interface SubjectDetailModalProps {
  subject: Subject | null;
  onClose: () => void;
  onStartFocus: (topicName: string, subjectName: string) => void;
  onPracticeTopic?: (topicName: string, subjectName: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  onClose,
  onStartFocus,
  onPracticeTopic,
}) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c3c6d7]/30 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#eceef0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#737686]">
                Detalhamento da Disciplina
              </span>
              {subject.alertCount && (
                <span className="px-2 py-0.5 bg-[#ffdad6] text-[#93000a] text-xs font-bold rounded-full">
                  {subject.alertCount} alertas
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-[#191c1e] tracking-tight">
              {subject.name}
            </h2>
            <p className="text-sm text-[#434655] mt-1 leading-relaxed">
              {subject.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737686] hover:text-[#191c1e] hover:bg-[#eceef0] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-[#f7f9fb] rounded-2xl border border-[#eceef0]">
            <span className="text-[11px] font-bold text-[#737686] uppercase block">Domínio Geral</span>
            <span className="text-2xl font-extrabold text-[#004ac6]">{subject.masteryPercentage}%</span>
          </div>

          <div className="p-3.5 bg-[#f7f9fb] rounded-2xl border border-[#eceef0]">
            <span className="text-[11px] font-bold text-[#737686] uppercase block">Conteúdos</span>
            <span className="text-2xl font-extrabold text-[#191c1e]">{subject.contentsCount}</span>
          </div>

          <div className="p-3.5 bg-[#f7f9fb] rounded-2xl border border-[#eceef0]">
            <span className="text-[11px] font-bold text-[#737686] uppercase block">Questões Feitas</span>
            <span className="text-2xl font-extrabold text-[#191c1e]">{subject.questionsCount}</span>
          </div>
        </div>

        {/* Topics List */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#191c1e] mb-3">
            Conteúdos e Tópicos Avaliados
          </h3>

          <div className="flex flex-col gap-3">
            {subject.topics.map((topic) => {
              const isDanger = topic.status === 'danger';
              const isAlert = topic.status === 'alert';

              return (
                <div
                  key={topic.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDanger
                      ? 'bg-[#ffdad6]/30 border-[#ba1a1a]/30'
                      : isAlert
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-[#f7f9fb] border-[#eceef0]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#191c1e]">
                        {topic.name}
                      </h4>
                      {isDanger && (
                        <span className="px-2 py-0.5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full">
                          Crítico
                        </span>
                      )}
                      {isAlert && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                          Atenção
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#737686] mt-0.5 block">
                      {topic.questionsDone} questões praticadas
                    </span>
                  </div>

                  {/* Progress bar + Action */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-24 flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className={isDanger ? 'text-[#ba1a1a]' : isAlert ? 'text-amber-800' : 'text-[#004ac6]'}>
                          {topic.masteryPercentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#eceef0] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isDanger ? 'bg-[#ba1a1a]' : isAlert ? 'bg-amber-600' : 'bg-[#004ac6]'
                          }`}
                          style={{ width: `${topic.masteryPercentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onStartFocus(topic.name, subject.name);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Iniciar estudo focado deste tópico"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Revisar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef0]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-sm text-[#434655] hover:bg-[#eceef0]"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onStartFocus(`Revisão Completa: ${subject.name}`, subject.name);
              onClose();
            }}
            className="px-6 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Sessão de Foco em {subject.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
