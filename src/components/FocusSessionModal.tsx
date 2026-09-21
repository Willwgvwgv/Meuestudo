import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialSubject?: string;
  onCompleteSession: (minutes: number) => void;
}

export const FocusSessionModal: React.FC<FocusSessionModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'Revisão Geral',
  initialSubject = 'Matemática',
  onCompleteSession,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(durationMinutes * 60);
      setIsActive(false);
      setSessionCompleted(false);
    }
  }, [isOpen, durationMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      setSessionCompleted(true);
      onCompleteSession(durationMinutes);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, durationMinutes, onCompleteSession]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = durationMinutes * 60;
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  const handleFinishEarly = () => {
    setIsActive(false);
    setSessionCompleted(true);
    const completedMins = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60));
    onCompleteSession(completedMins);
    confetti({
      particleCount: 80,
      spread: 70,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#c3c6d7]/30 relative flex flex-col items-center text-center gap-6 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#004ac6]/10 to-transparent pointer-events-none" />

        {/* Close Button & Header */}
        <div className="w-full flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#dbe1ff] text-[#004ac6] rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sessão de Foco Serene</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-[#737686] hover:text-[#191c1e] hover:bg-[#eceef0] transition-colors"
              title={soundEnabled ? 'Silenciar' : 'Ativar som'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737686] hover:text-[#191c1e] hover:bg-[#eceef0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Topic and Subject */}
        <div className="relative z-10">
          <span className="text-xs font-bold text-[#004ac6] uppercase tracking-wider block mb-1">
            {initialSubject}
          </span>
          <h2 className="text-2xl font-extrabold text-[#191c1e] tracking-tight">
            {initialTopic}
          </h2>
        </div>

        {sessionCompleted ? (
          /* Completion State */
          <div className="flex flex-col items-center gap-4 py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#191c1e]">Parabéns pelo Foco!</h3>
              <p className="text-sm text-[#434655] mt-1">
                Você concluiu sua meta de estudo com consistência.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-bold text-sm shadow-md"
            >
              Voltar ao Meu Estudo
            </button>
          </div>
        ) : (
          <>
            {/* Circular Timer Display */}
            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-[#eceef0]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <circle
                  className="text-[#004ac6] transition-all duration-300"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="42"
                  stroke="currentColor"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                  strokeLinecap="round"
                  strokeWidth="6"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-[#191c1e] tracking-tight font-mono">
                  {formattedTime}
                </span>
                <span className="text-xs text-[#737686] font-medium mt-1">
                  {isActive ? 'Foco em andamento' : 'Pausado'}
                </span>
              </div>
            </div>

            {/* Duration presets (if not running) */}
            {!isActive && secondsRemaining === durationMinutes * 60 && (
              <div className="flex items-center gap-2">
                {[15, 25, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setDurationMinutes(mins);
                      setSecondsRemaining(mins * 60);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      durationMinutes === mins
                        ? 'bg-[#004ac6] text-white'
                        : 'bg-[#eceef0] text-[#505f76] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            )}

            {/* Control buttons */}
            <div className="flex items-center gap-4 w-full justify-center">
              <button
                onClick={() => setIsActive(!isActive)}
                className="px-8 py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-base rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{secondsRemaining < durationMinutes * 60 ? 'Continuar' : 'Começar Foco'}</span>
                  </>
                )}
              </button>

              {secondsRemaining < durationMinutes * 60 && (
                <button
                  onClick={handleFinishEarly}
                  className="px-4 py-3.5 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Concluir Agora
                </button>
              )}
            </div>

            {/* Scratchpad note */}
            <div className="w-full text-left">
              <label className="text-[11px] font-bold text-[#737686] uppercase block mb-1">
                Anotações Rápidas da Sessão
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anote dúvidas, fórmulas ou ideias durante a sessão..."
                rows={2}
                className="w-full p-3 bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl text-xs text-[#191c1e] placeholder-[#737686] focus:bg-white focus:border-[#004ac6] outline-hidden resize-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
