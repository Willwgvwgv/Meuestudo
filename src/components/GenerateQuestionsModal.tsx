import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  Layers,
} from 'lucide-react';
import { Subject, Question } from '../types';

interface GenerateQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onQuestionsGenerated: (newQuestions: Question[]) => void;
}

export const GenerateQuestionsModal: React.FC<GenerateQuestionsModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onQuestionsGenerated,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(
    () => subjects[0]?.name || '__custom__',
  );
  const [customSubject, setCustomSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Médio' | 'Difícil'>('Médio');
  const [count, setCount] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSubjectObj = subjects.find((s) => s.name === selectedSubject);
  const availableTopics = currentSubjectObj?.topics || [];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const isCustom = selectedSubject === '__custom__' || !selectedSubject;
    const finalSubject = isCustom ? customSubject.trim() : selectedSubject;
    const finalTopic = topic.trim();

    if (!finalSubject) {
      setErrorMessage('Por favor selecione ou informe uma matéria de estudo.');
      return;
    }

    if (!finalTopic) {
      setErrorMessage('Informe o tópico ou tema específico das questões.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: finalSubject,
          topic: finalTopic,
          difficulty,
          count,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha na resposta do servidor.');
      }

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Nenhuma questão válida foi gerada. Tente novamente.');
      }

      const generated: Question[] = data.questions.map((q: any, idx: number) => ({
        id: `gen-${Date.now()}-${idx}`,
        subject: finalSubject,
        topic: finalTopic,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: Number(q.correctAnswerIndex) || 0,
        explanation: q.explanation || 'Justificativa da resposta gerada pela IA.',
        difficulty: (q.difficulty as 'Fácil' | 'Médio' | 'Difícil') || difficulty,
        generatedByAi: true,
      }));

      onQuestionsGenerated(generated);
      onClose();
    } catch (err: any) {
      console.error('Erro ao gerar questões:', err);
      setErrorMessage(err?.message || 'Ocorreu um erro ao gerar questões com IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004ac6] to-[#2563eb] text-white flex items-center justify-center shadow-md shadow-[#004ac6]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#191c1e]">Gerar Questões com IA</h2>
              <p className="text-xs text-slate-500">
                Criadas via Gemini para qualquer área, curso ou concurso
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleGenerate} className="p-6 flex flex-col gap-4">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Subject Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Matéria / Área de Estudo
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900 cursor-pointer"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="__custom__">+ Outra área de estudo (digitar livremente)</option>
            </select>
          </div>

          {/* Custom Subject field if selected */}
          {selectedSubject === '__custom__' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nome da Matéria ou Disciplina
              </label>
              <input
                type="text"
                placeholder="Ex: Direito Processual Civil, Farmacologia, Inteligência Artificial..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900"
              />
            </div>
          )}

          {/* Topic */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Tópico Específico
            </label>
            <input
              type="text"
              placeholder="Ex: Recursos e Prazos, Farmacocinética, Árvores de Decisão..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900"
            />

            {/* Suggestions from selected subject */}
            {availableTopics.length > 0 && selectedSubject !== '__custom__' && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {availableTopics.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTopic(t.name)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    + {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Dificuldade</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['Fácil', 'Médio', 'Difícil'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      difficulty === lvl
                        ? 'bg-white text-[#004ac6] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Quantidade</label>
                <span className="text-xs font-bold text-[#004ac6]">{count} questões</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#004ac6]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Prompt info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-500 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#004ac6] shrink-0 mt-0.5" />
            <span>
              As questões geradas serão salvas automaticamente no seu banco de questões pessoal com
              gabarito e resolução detalhada.
            </span>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Questões com Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar {count} Questão(ões)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
