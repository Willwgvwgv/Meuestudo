import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  BookOpen, 
  Trophy, 
  Clock, 
  Flame,
  PlusCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, Subject } from '../types';
import { GenerateQuestionsModal } from './GenerateQuestionsModal';

interface QuestionsViewProps {
  questions: Question[];
  subjects?: Subject[];
  onFinishSession?: (score: number, total: number) => void;
  onSaveQuestions?: (newQuestions: Question[]) => void;
  onRecordAttempt?: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  subjects = [],
  onFinishSession,
  onSaveQuestions,
  onRecordAttempt,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [historyAnswers, setHistoryAnswers] = useState<{ [qId: string]: { selected: number; isCorrect: boolean } }>({});
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);

  const filteredQuestions = questions.filter(q => 
    selectedSubject === 'all' ? true : q.subject === selectedSubject
  );

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0];
  const allSubjectNames = Array.from(new Set([...subjects.map(s => s.name), ...questions.map(q => q.subject)]));

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isSubmitted || !currentQ) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctAnswerIndex;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    setHistoryAnswers(prev => ({
      ...prev,
      [currentQ.id]: { selected: selectedOption, isCorrect },
    }));

    if (onRecordAttempt) {
      onRecordAttempt(currentQ.id, selectedOption, isCorrect);
    }
  };

  const handleNext = () => {
    if (currentIdx < filteredQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
      if (onFinishSession) {
        onFinishSession(score + (selectedOption === currentQ.correctAnswerIndex ? 1 : 0), filteredQuestions.length);
      }
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
    setHistoryAnswers({});
  };

  const handleQuestionsGenerated = (newQs: Question[]) => {
    if (onSaveQuestions) {
      onSaveQuestions(newQs);
    }
    // Set subject filter to match generated subject
    if (newQs[0]?.subject) {
      setSelectedSubject(newQs[0].subject);
      setCurrentIdx(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowResults(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight">
            Banco de Questões
          </h1>
          <p className="text-base md:text-lg text-[#434655] mt-1">
            Pratique ativamente com feedback imediato, estatísticas e gerador inteligente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Generator Button */}
          <button
            type="button"
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#004ac6] to-[#2563eb] hover:from-[#003896] hover:to-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Gerar Questões com IA</span>
          </button>

          {/* Filter by subject */}
          <div className="flex items-center gap-2 bg-[#eceef0] p-1.5 rounded-2xl">
            <Filter className="w-4 h-4 text-[#737686] ml-2" />
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setCurrentIdx(0);
                setSelectedOption(null);
                setIsSubmitted(false);
                setShowResults(false);
              }}
              className="bg-transparent text-sm font-semibold text-[#191c1e] py-1 px-2 outline-hidden cursor-pointer"
            >
              <option value="all">Todas as Matérias</option>
              {allSubjectNames.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showResults ? (
        /* Results View */
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-[#c3c6d7]/30 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center shadow-inner animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-[#191c1e]">
              Sessão Concluída!
            </h2>
            <p className="text-base text-[#434655] mt-2">
              Você acertou <strong className="text-[#004ac6] text-xl font-bold">{score}</strong> de <strong className="text-xl font-bold">{filteredQuestions.length}</strong> questões ({Math.round((score / filteredQuestions.length) * 100)}%).
            </p>
          </div>

          <div className="w-full max-w-md bg-[#f2f4f6] rounded-2xl p-4 flex justify-around">
            <div>
              <span className="text-xs text-[#737686] uppercase font-bold block">Taxa de Acerto</span>
              <span className="text-2xl font-extrabold text-[#004ac6]">
                {Math.round((score / filteredQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-px bg-[#c3c6d7]" />
            <div>
              <span className="text-xs text-[#737686] uppercase font-bold block">Pontos Ganhos</span>
              <span className="text-2xl font-extrabold text-amber-600">
                +{score * 15} XP
              </span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-8 py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : currentQ ? (
        /* Active Question Card */
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-[#c3c6d7]/30 flex flex-col gap-6 relative">
          {/* Top metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#eceef0]">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#dbe1ff] text-[#004ac6] rounded-full text-xs font-bold">
                {currentQ.subject}
              </span>
              <span className="px-3 py-1 bg-[#eceef0] text-[#505f76] rounded-full text-xs font-medium">
                {currentQ.topic}
              </span>
              {currentQ.generatedByAi && (
                <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Gerada por IA</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-[#737686]">
              <span>Questão {currentIdx + 1} de {filteredQuestions.length}</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                {currentQ.difficulty}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-lg sm:text-xl font-semibold text-[#191c1e] leading-relaxed">
            {currentQ.questionText}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === currentQ.correctAnswerIndex;
              const isWrongSelected = isSubmitted && isSelected && !isCorrect;

              let optionStyle = "border-[#c3c6d7]/50 hover:border-[#004ac6] bg-white text-[#191c1e]";
              if (isSelected && !isSubmitted) {
                optionStyle = "border-[#004ac6] bg-[#dbe1ff]/30 text-[#004ac6] font-semibold ring-2 ring-[#004ac6]/20";
              } else if (isSubmitted) {
                if (isCorrect) {
                  optionStyle = "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20";
                } else if (isWrongSelected) {
                  optionStyle = "border-[#ba1a1a] bg-[#ffdad6]/40 text-[#93000a] ring-2 ring-[#ba1a1a]/20";
                } else {
                  optionStyle = "border-[#eceef0] bg-white opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  disabled={isSubmitted}
                  className={`p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected && !isSubmitted 
                        ? 'bg-[#004ac6] text-white' 
                        : isSubmitted && isCorrect 
                        ? 'bg-emerald-600 text-white'
                        : isSubmitted && isWrongSelected 
                        ? 'bg-[#ba1a1a] text-white'
                        : 'bg-[#eceef0] text-[#505f76]'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isSubmitted && isWrongSelected && (
                    <XCircle className="w-5 h-5 text-[#ba1a1a] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on submit */}
          {isSubmitted && (
            <div className="p-5 rounded-2xl bg-[#f2f4f6] border border-[#c3c6d7]/40 flex flex-col gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#004ac6]">
                <HelpCircle className="w-4 h-4" />
                <span>Explicação / Resolução</span>
              </div>
              <p className="text-sm text-[#434655] leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#eceef0]">
            <span className="text-xs font-medium text-[#737686]">
              {score} acerto{score !== 1 ? 's' : ''} nesta rodada
            </span>

            {!isSubmitted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-[#004ac6] hover:bg-[#2563eb] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{currentIdx < filteredQuestions.length - 1 ? 'Próxima Questão' : 'Ver Resultados'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl text-center text-sm text-[#737686]">
          Nenhuma questão cadastrada para este filtro.
        </div>
      )}

      {/* AI Question Generation Modal */}
      <GenerateQuestionsModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        subjects={subjects}
        onQuestionsGenerated={handleQuestionsGenerated}
      />
    </div>
  );
};
