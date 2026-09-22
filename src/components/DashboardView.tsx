import React from 'react';
import {
  TrendingUp,
  BookOpen,
  ArrowRight,
  Clock,
  BookMarked,
  Calendar as CalendarIcon,
  Check,
  AlertTriangle,
  Sparkles,
  Play,
} from 'lucide-react';
import { StudentProfile, Task, TabType } from '../types';

interface DashboardViewProps {
  profile: StudentProfile;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onNavigate: (tab: TabType) => void;
  onStartFocus: (topicName?: string, subjectName?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  tasks,
  onToggleTask,
  onNavigate,
  onStartFocus,
}) => {
  const pendingTodayTasks = tasks.filter(
    (t) => !t.completed && (t.dueDate === 'Hoje' || t.dueDate === 'Amanhã'),
  );
  const countToday = pendingTodayTasks.length;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 flex flex-col gap-10">
      {/* Hero / Greeting Section */}
      <section className="relative flex flex-col lg:flex-row gap-8 items-start justify-between overflow-hidden rounded-3xl bg-gradient-mesh p-6 sm:p-8 md:p-10 text-white shadow-[var(--shadow-elevated)]">
        <div className="flex flex-col gap-4 max-w-2xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Bom dia, {profile.name}!
          </h1>
          <p className="text-lg md:text-xl text-white/85 font-normal leading-relaxed">
            Pronto para evoluir hoje? Você tem{' '}
            <strong className="text-white font-bold">
              {countToday} tarefa{countToday !== 1 ? 's' : ''}
            </strong>{' '}
            programada{countToday !== 1 ? 's' : ''} para manter o ritmo.
          </p>

          <div className="mt-2 inline-flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-full w-fit border border-white/20 backdrop-blur-sm">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">
              Seu desempenho geral subiu <span className="font-bold">8%</span> este mês.
            </span>
          </div>
        </div>

        {/* Primary CTA / Next Recommendation */}
        <div
          id="recommended-study-card"
          className="relative z-10 bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all p-6 rounded-2xl w-full lg:w-96 flex flex-col gap-4 overflow-hidden group"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#2563eb]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#004ac6] text-white flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#737686] uppercase tracking-wider">
                Próximo Estudo Recomendado
              </p>
              <h2 className="text-xl font-bold text-[#191c1e]">Revisão de Frações</h2>
            </div>
          </div>

          <p className="text-sm text-[#434655] leading-relaxed relative z-10">
            Foque 30 minutos agora para se preparar para a prova de Matemática.
          </p>

          <button
            id="start-recommended-session-btn"
            onClick={() => onStartFocus('Revisão de Frações', 'Matemática')}
            className="w-full py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-medium text-sm mt-2 transition-all flex justify-center items-center gap-2 shadow-sm group-hover:shadow-md cursor-pointer"
          >
            <span>Iniciar Sessão</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Main Grid: Tasks on Left, Exams & Attention on Right */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#191c1e] tracking-tight">Tarefas de Hoje</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#eceef0] text-[#505f76]">
                {pendingTodayTasks.length}
              </span>
            </div>

            <button
              onClick={() => onNavigate('tarefas')}
              className="text-sm font-semibold text-[#004ac6] hover:text-[#2563eb] hover:underline transition-colors flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {tasks.slice(0, 4).map((task) => {
              const isDone = task.completed;
              return (
                <div
                  key={task.id}
                  id={`dashboard-task-${task.id}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 group ${
                    isDone
                      ? 'bg-white/60 border-[#eceef0] opacity-75'
                      : 'bg-white border-[#c3c6d7]/30 hover:border-[#2563eb]/40 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#004ac6] text-white border border-[#004ac6]'
                        : 'border border-[#737686] hover:border-[#004ac6] bg-white group-hover:bg-[#f2f4f6]'
                    }`}
                    aria-label={isDone ? 'Desmarcar tarefa' : 'Concluir tarefa'}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm sm:text-base font-semibold truncate transition-colors ${
                        isDone
                          ? 'line-through text-[#737686]'
                          : 'text-[#191c1e] group-hover:text-[#004ac6]'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#737686] truncate">
                      <span className="font-medium text-[#505f76]">{task.subject}</span>
                      <span>•</span>
                      <span>{task.details || `${task.durationMinutes} min`}</span>
                    </div>
                  </div>

                  {/* Time Estimate */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#505f76] bg-[#f2f4f6] px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.durationMinutes} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Alerts & Focus */}
        <div className="flex flex-col gap-8">
          {/* Upcoming Exam Alert */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#191c1e]">Próxima Prova</h2>
              <button
                onClick={() => onNavigate('calendario')}
                className="text-xs font-semibold text-[#004ac6] hover:underline"
              >
                Calendário
              </button>
            </div>

            <div
              id="upcoming-exam-card"
              onClick={() => onNavigate('calendario')}
              className="bg-[#ffdad6]/60 border border-[#ba1a1a]/20 p-5 rounded-2xl flex items-start gap-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <CalendarIcon className="w-5 h-5 fill-[#ba1a1a]/20" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#ba1a1a] transition-colors">
                  Matemática
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-[#434655]">10/09</span>
                  <span className="text-xs font-bold text-[#93000a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                    Daqui a 7 dias
                  </span>
                </div>
                <p className="text-xs text-[#737686] mt-2">
                  Frações, Porcentagem, Razão e Proporção
                </p>
              </div>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#191c1e]">Atenção Necessária</h2>
              <button
                onClick={() => onNavigate('materias')}
                className="text-xs font-semibold text-[#004ac6] hover:underline"
              >
                Ver matérias
              </button>
            </div>

            <div className="bg-white border border-[#c3c6d7]/30 p-6 rounded-2xl shadow-xs flex flex-col gap-5">
              <p className="text-xs text-[#737686] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Tópicos com menor desempenho recente.
              </p>

              {/* Topic 1: Frações */}
              <div
                className="cursor-pointer group"
                onClick={() => onStartFocus('Frações', 'Matemática')}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
                    Frações
                  </span>
                  <span className="text-xs font-bold text-[#ba1a1a]">54%</span>
                </div>
                <div className="h-2.5 w-full bg-[#eceef0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#bc4800] rounded-full transition-all duration-700"
                    style={{ width: '54%' }}
                  />
                </div>
              </div>

              {/* Topic 2: Proporção */}
              <div
                className="cursor-pointer group"
                onClick={() => onStartFocus('Razão e Proporção', 'Matemática')}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
                    Proporção
                  </span>
                  <span className="text-xs font-bold text-[#505f76]">63%</span>
                </div>
                <div className="h-2.5 w-full bg-[#eceef0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#505f76] rounded-full transition-all duration-700"
                    style={{ width: '63%' }}
                  />
                </div>
              </div>

              <button
                onClick={() => onNavigate('questoes')}
                className="mt-2 text-xs font-semibold text-center text-[#004ac6] hover:text-[#2563eb] bg-[#dbe1ff]/50 hover:bg-[#dbe1ff] py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Treinar tópicos fracos no Banco de Questões
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
