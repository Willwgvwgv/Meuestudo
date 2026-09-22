import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Check,
  Clock,
  AlertTriangle,
  Flame,
  Sparkles,
  Calendar as CalendarIcon,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  BookOpen,
} from 'lucide-react';
import { Task, StudentProfile } from '../types';

interface TasksViewProps {
  tasks: Task[];
  profile: StudentProfile;
  onToggleTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onDeleteTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  profile,
  onToggleTask,
  onOpenNewTaskModal,
  onDeleteTask,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterSubject !== 'all' && task.subject !== filterSubject) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const pendingToday = filteredTasks.filter(
    (t) => !t.completed && (t.dueDate === 'Hoje' || t.dueDate.toLowerCase().includes('hoje')),
  );
  const upcomingTasks = filteredTasks.filter(
    (t) => !t.completed && t.dueDate !== 'Hoje' && !t.dueDate.toLowerCase().includes('hoje'),
  );
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const totalTodayTasks = tasks.filter(
    (t) => t.dueDate === 'Hoje' || t.dueDate.toLowerCase().includes('hoje') || t.completed,
  ).length;
  const completedTodayCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const completionPercent =
    totalTodayTasks > 0
      ? Math.round((completedTodayCount / (completedTodayCount + pendingCount)) * 100)
      : 0;

  // SVG donut calculation (radius = 40, circumference = 251.2)
  const circumference = 251.2;
  const strokeDashoffset = circumference - (circumference * completionPercent) / 100;

  const subjectsList = Array.from(new Set(tasks.map((t) => t.subject)));

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 flex flex-col gap-10">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight mb-2">
            Suas Tarefas
          </h1>
          <p className="text-base md:text-lg text-[#434655] max-w-2xl leading-relaxed">
            Concentre-se no que é importante hoje. Você tem{' '}
            <span className="font-semibold text-[#004ac6] bg-[#dbe1ff] px-2.5 py-0.5 rounded-md text-sm inline-block">
              {pendingCount} tarefa{pendingCount !== 1 ? 's' : ''} pendente
              {pendingCount !== 1 ? 's' : ''}
            </span>{' '}
            e já concluiu{' '}
            <span className="font-semibold text-emerald-700">{completedTodayCount}</span>.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 shrink-0 relative">
          <button
            id="filter-tasks-btn"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`h-11 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 border ${
              filterSubject !== 'all' || filterPriority !== 'all'
                ? 'bg-[#2563eb]/10 border-[#2563eb] text-[#004ac6]'
                : 'bg-[#eceef0] hover:bg-[#e0e3e5] border-transparent text-[#191c1e]'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
            {(filterSubject !== 'all' || filterPriority !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-[#004ac6]" />
            )}
          </button>

          {/* Filter Dropdown Popover */}
          {showFilterMenu && (
            <div
              id="filter-tasks-dropdown"
              className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-[#c3c6d7]/40 p-4 z-40 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
                <span className="text-xs font-bold text-[#191c1e] uppercase">Filtrar Tarefas</span>
                <button
                  onClick={() => setShowFilterMenu(false)}
                  className="text-xs text-[#737686] hover:text-[#191c1e]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* By Subject */}
              <div className="mt-3">
                <label className="text-[11px] font-semibold text-[#737686] uppercase block mb-1.5">
                  Por Matéria
                </label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full bg-[#f2f4f6] text-xs font-medium text-[#191c1e] p-2 rounded-lg border border-transparent focus:border-[#004ac6] outline-hidden"
                >
                  <option value="all">Todas as Matérias</option>
                  {subjectsList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* By Priority */}
              <div className="mt-3">
                <label className="text-[11px] font-semibold text-[#737686] uppercase block mb-1.5">
                  Por Prioridade
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full bg-[#f2f4f6] text-xs font-medium text-[#191c1e] p-2 rounded-lg border border-transparent focus:border-[#004ac6] outline-hidden"
                >
                  <option value="all">Todas as Prioridades</option>
                  <option value="urgente">Urgente</option>
                  <option value="alta">Alta Prioridade</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              {(filterSubject !== 'all' || filterPriority !== 'all') && (
                <button
                  onClick={() => {
                    setFilterSubject('all');
                    setFilterPriority('all');
                  }}
                  className="mt-3 text-xs text-[#ba1a1a] hover:underline font-semibold w-full text-center"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}

          <button
            id="new-task-main-btn"
            onClick={onOpenNewTaskModal}
            className="h-11 px-5 rounded-xl bg-[#004ac6] hover:bg-[#2563eb] transition-all text-white shadow-xs hover:shadow-md font-medium text-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Task columns (8 cols) + Daily Progress & Streak (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Area: Task lists */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Section: Para Hoje */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-[#191c1e]">Para Hoje</h2>
              <span className="w-6 h-6 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center text-xs font-bold shadow-xs">
                {pendingToday.length}
              </span>
            </div>

            {pendingToday.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-dashed border-[#c3c6d7] text-center text-sm text-[#737686]">
                Nenhuma tarefa pendente para hoje! Parabéns pelo progresso.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingToday.map((task) => {
                  const isUrgent = task.priority === 'urgente';
                  const isHigh = task.priority === 'alta';
                  return (
                    <div
                      key={task.id}
                      id={`task-item-${task.id}`}
                      className="group flex items-start gap-4 p-5 rounded-2xl bg-white hover:bg-[#f7f9fb] transition-all shadow-xs hover:shadow-md relative overflow-hidden border border-[#c3c6d7]/30"
                    >
                      {/* Left color bar indicator */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          isUrgent ? 'bg-[#ba1a1a]' : isHigh ? 'bg-[#2563eb]' : 'bg-[#505f76]'
                        }`}
                      />

                      {/* Checkbox button */}
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="mt-1 w-6 h-6 rounded-lg shrink-0 border border-[#737686] hover:border-[#004ac6] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]/20 transition-all flex items-center justify-center bg-white group-hover:bg-[#f2f4f6] cursor-pointer"
                        aria-label="Concluir tarefa"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="text-base font-bold text-[#191c1e] truncate group-hover:text-[#004ac6] transition-colors">
                            {task.title}
                          </h3>

                          {isUrgent && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#ffdad6] text-[#93000a] text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Urgente
                            </span>
                          )}

                          {isHigh && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2563eb] text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto shadow-xs">
                              Alta Prioridade
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#505f76] font-medium">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#dbe1ff]/60 text-[#004ac6] rounded-md font-semibold">
                            <BookOpen className="w-3.5 h-3.5" />
                            {task.subject}
                          </div>

                          <div className="flex items-center gap-1.5 text-[#737686]">
                            <Clock className="w-3.5 h-3.5" />
                            {task.details || `${task.durationMinutes} min`}
                          </div>

                          <div className="flex items-center gap-1.5 text-[#737686]">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            Entrega: {task.dueDate}
                          </div>
                        </div>
                      </div>

                      {/* Delete action on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 text-[#737686] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ffdad6]/50 transition-colors"
                          title="Excluir tarefa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section: Próximos Dias */}
          {upcomingTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-[#191c1e]">Próximos Dias</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#eceef0] text-[#505f76]">
                  {upcomingTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start gap-4 p-5 rounded-2xl bg-white hover:bg-[#f7f9fb] transition-all shadow-xs hover:shadow-md relative overflow-hidden border border-[#c3c6d7]/30"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c3c6d7]" />

                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-1 w-6 h-6 rounded-lg shrink-0 border border-[#737686] hover:border-[#004ac6] focus:outline-hidden transition-all flex items-center justify-center bg-white group-hover:bg-[#f2f4f6] cursor-pointer"
                      aria-label="Concluir tarefa"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-base font-bold text-[#191c1e] truncate group-hover:text-[#004ac6] transition-colors">
                          {task.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#505f76] font-medium">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#eceef0] text-[#434655] rounded-md font-semibold">
                          <BookOpen className="w-3.5 h-3.5" />
                          {task.subject}
                        </div>

                        <div className="flex items-center gap-1.5 text-[#737686]">
                          <Clock className="w-3.5 h-3.5" />
                          {task.durationMinutes} min
                        </div>

                        <div className="flex items-center gap-1.5 text-[#737686]">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {task.dueDate}
                        </div>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-[#737686] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ffdad6]/50 transition-colors"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Concluídas Hoje */}
          {completedTasks.length > 0 && (
            <section className="opacity-80">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-[#737686]">Concluídas Hoje</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {completedTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-[#eceef0] relative overflow-hidden"
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-1 w-6 h-6 rounded-lg shrink-0 bg-[#004ac6] text-white flex items-center justify-center cursor-pointer hover:bg-[#ba1a1a] transition-colors"
                      title="Clique para desmarcar"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#737686] line-through truncate">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#737686]">
                        <span className="px-2 py-0.5 bg-[#eceef0] rounded-md font-medium">
                          {task.subject}
                        </span>
                        {task.completedAt && <span>Concluído {task.completedAt}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-[#737686] hover:text-[#ba1a1a] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Area: Daily Progress + Focus Streak Chart */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card: Progresso Diário */}
          <div
            id="daily-progress-card"
            className="bg-white rounded-3xl p-6 shadow-xs border border-[#c3c6d7]/30 relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#004ac6]/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-xl font-bold text-[#191c1e] mb-6">Progresso Diário</h3>

            {/* Circular Donut Gauge */}
            <div className="flex justify-center mb-6 relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-[#e6e8ea]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-[#004ac6] transition-all duration-1000 ease-out"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-extrabold text-[#191c1e] tracking-tight">
                  {completionPercent}%
                </span>
                <span className="text-[11px] font-semibold text-[#737686] uppercase">Hoje</span>
              </div>
            </div>

            {/* Two Stat counters */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3.5 bg-[#eceef0] rounded-2xl">
                <span className="block text-2xl font-extrabold text-emerald-700">
                  {completedTodayCount}
                </span>
                <span className="block text-[11px] font-bold text-[#505f76] uppercase tracking-wider mt-1">
                  Concluída{completedTodayCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="p-3.5 bg-[#eceef0] rounded-2xl">
                <span className="block text-2xl font-extrabold text-[#004ac6]">{pendingCount}</span>
                <span className="block text-[11px] font-bold text-[#505f76] uppercase tracking-wider mt-1">
                  Restante{pendingCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Sequência de Foco */}
          <div
            id="focus-streak-card"
            className="bg-white rounded-3xl p-6 shadow-xs border border-[#c3c6d7]/30"
          >
            <div className="flex items-center gap-2 mb-4 text-[#505f76]">
              <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737686]">
                Sequência de Foco
              </h3>
            </div>

            {/* Weekly Bars (S, T, Q, H, S) */}
            <div className="flex items-end justify-between h-28 mb-4 gap-3 pt-2">
              {profile.weeklyFocusHistory.map((dayItem, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full">
                  <div className="w-full bg-[#eceef0] rounded-t-lg relative flex-1 overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-700 ${
                        dayItem.isToday
                          ? 'bg-[#004ac6] group-hover:bg-[#2563eb]'
                          : dayItem.heightPercent > 0
                            ? 'bg-[#2563eb]/60 group-hover:bg-[#2563eb]/80'
                            : 'bg-transparent'
                      }`}
                      style={{ height: `${dayItem.heightPercent}%` }}
                      title={`${dayItem.fullDay}: ${dayItem.heightPercent}% da meta`}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      dayItem.isToday ? 'text-[#004ac6]' : 'text-[#737686]'
                    }`}
                  >
                    {dayItem.day}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#434655] text-center leading-relaxed">
              Você está em uma sequência de{' '}
              <strong className="text-[#191c1e] font-bold">{profile.streakDays} dias</strong>.
              Mantenha o ritmo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
