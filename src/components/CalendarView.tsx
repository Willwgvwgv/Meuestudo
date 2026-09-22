import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar as CalendarIcon,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  Clock,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onStartFocus: (topicName?: string, subjectName?: string) => void;
  onAddEvent?: (event: Partial<CalendarEvent>) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onStartFocus }) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    events.find((e) => e.dayNumber === 10) || events[0] || null,
  );

  // Calendar matrix for September 2026 (Starts on Tuesday = day 1)
  // August 30, 31 (faded)
  const calendarDays = [
    { day: 30, isCurrentMonth: false, isWeekend: true },
    { day: 31, isCurrentMonth: false, isWeekend: false },
    { day: 1, isCurrentMonth: true, isWeekend: false },
    { day: 2, isCurrentMonth: true, isWeekend: false },
    { day: 3, isCurrentMonth: true, isWeekend: false },
    { day: 4, isCurrentMonth: true, isWeekend: false },
    { day: 5, isCurrentMonth: true, isWeekend: true },
    { day: 6, isCurrentMonth: true, isWeekend: true },
    { day: 7, isCurrentMonth: true, isWeekend: false },
    { day: 8, isCurrentMonth: true, isWeekend: false },
    { day: 9, isCurrentMonth: true, isWeekend: false },
    { day: 10, isCurrentMonth: true, isWeekend: false },
    { day: 11, isCurrentMonth: true, isWeekend: false },
    { day: 12, isCurrentMonth: true, isWeekend: true },
    { day: 13, isCurrentMonth: true, isWeekend: true },
    { day: 14, isCurrentMonth: true, isWeekend: false },
    { day: 15, isCurrentMonth: true, isWeekend: false },
    { day: 16, isCurrentMonth: true, isWeekend: false },
    { day: 17, isCurrentMonth: true, isWeekend: false },
    { day: 18, isCurrentMonth: true, isWeekend: false },
    { day: 19, isCurrentMonth: true, isWeekend: true },
    { day: 20, isCurrentMonth: true, isWeekend: true },
    { day: 21, isCurrentMonth: true, isWeekend: false },
    { day: 22, isCurrentMonth: true, isWeekend: false },
    { day: 23, isCurrentMonth: true, isWeekend: false },
    { day: 24, isCurrentMonth: true, isWeekend: false },
    { day: 25, isCurrentMonth: true, isWeekend: false },
    { day: 26, isCurrentMonth: true, isWeekend: true },
    { day: 27, isCurrentMonth: true, isWeekend: true },
    { day: 28, isCurrentMonth: true, isWeekend: false },
    { day: 29, isCurrentMonth: true, isWeekend: false },
    { day: 30, isCurrentMonth: true, isWeekend: false },
    { day: 1, isCurrentMonth: false, isWeekend: false },
    { day: 2, isCurrentMonth: false, isWeekend: false },
    { day: 3, isCurrentMonth: false, isWeekend: true },
  ];

  const handleDayClick = (dayItem: { day: number; isCurrentMonth: boolean }) => {
    if (!dayItem.isCurrentMonth) return;
    setSelectedDay(dayItem.day);
    const ev = events.find((e) => e.dayNumber === dayItem.day);
    if (ev) {
      setSelectedEvent(ev);
    } else {
      // Default placeholder event if day clicked has no fixed event
      setSelectedEvent({
        id: `custom-${dayItem.day}`,
        title: `Estudos do Dia ${dayItem.day}`,
        date: `2026-09-${String(dayItem.day).padStart(2, '0')}`,
        dayNumber: dayItem.day,
        type: 'study',
        typeLabel: 'Estudo Pessoal',
        subject: 'Revisão Geral',
        timeStr: 'Horário flexível',
        topics: ['Revisão de anotações da semana', 'Resolução de exercícios pendentes'],
        confidence: 85,
        colorClass: 'text-blue-900',
        bgBadgeClass: 'bg-blue-600 text-white border-blue-700',
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 flex flex-col gap-8">
      {/* Header Area with Month and View switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight">
            Setembro 2026
          </h1>
          <p className="text-base md:text-lg text-[#434655] mt-1">
            Visão geral dos seus compromissos acadêmicos.
          </p>
        </div>

        {/* View Mode Switcher Pill */}
        <div
          id="calendar-view-mode-tabs"
          className="flex items-center bg-[#e6e8ea] rounded-full p-1 shadow-inner self-start sm:self-auto"
        >
          <button
            onClick={() => setViewMode('month')}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
              viewMode === 'month'
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
              viewMode === 'week'
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
              viewMode === 'day'
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            Dia
          </button>
        </div>
      </div>

      {/* Main Content Area: Calendar Grid on Left, Event Detail Panel on Right */}
      <div className="flex flex-col lg:flex-row gap-6 relative items-start">
        {/* Calendar Grid Container */}
        <div
          id="calendar-main-grid-container"
          className="flex-1 w-full bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-[#c3c6d7]/30 relative z-10"
        >
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-3">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((wd, i) => (
              <div
                key={wd}
                className={`text-center text-xs font-bold uppercase tracking-wider py-1 ${
                  i === 0 || i === 6 ? 'text-[#ba1a1a]/70' : 'text-[#737686]'
                }`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {calendarDays.map((item, idx) => {
              const hasEvent = item.isCurrentMonth && events.find((e) => e.dayNumber === item.day);
              const isSelected = item.isCurrentMonth && selectedDay === item.day;
              const isExamDay = item.isCurrentMonth && item.day === 10;

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(item)}
                  className={`min-h-[85px] sm:min-h-[96px] rounded-2xl flex flex-col p-2 sm:p-2.5 transition-all relative select-none cursor-pointer ${
                    !item.isCurrentMonth
                      ? 'bg-[#f2f4f6]/40 text-[#737686]/40 opacity-40 cursor-default'
                      : isExamDay
                        ? 'bg-[#004ac6] text-white shadow-md ring-4 ring-[#2563eb]/20 hover:bg-[#2563eb]'
                        : isSelected
                          ? 'bg-[#dbe1ff]/60 border-2 border-[#004ac6] text-[#004ac6]'
                          : 'bg-white hover:bg-[#f2f4f6] text-[#191c1e] border border-[#eceef0] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        isExamDay
                          ? 'text-white'
                          : item.isWeekend
                            ? 'text-[#ba1a1a]'
                            : 'text-[#191c1e]'
                      }`}
                    >
                      {item.day}
                    </span>

                    {isExamDay && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-white animate-pulse" />
                    )}
                  </div>

                  {/* Badges on days */}
                  {hasEvent && (
                    <div className="mt-auto overflow-hidden">
                      {isExamDay ? (
                        <div className="bg-white text-[#004ac6] text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:py-1 rounded-md truncate shadow-2xs">
                          Prova Matemática
                        </div>
                      ) : hasEvent.type === 'study' ? (
                        <div className="bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md truncate">
                          {hasEvent.title}
                        </div>
                      ) : hasEvent.type === 'delivery' ? (
                        <div className="bg-slate-200 text-slate-800 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md truncate">
                          {hasEvent.title}
                        </div>
                      ) : (
                        <div className="bg-red-100 text-red-800 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md truncate">
                          {hasEvent.title}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Detail Side Card (Matches Screenshot 3 solid blue panel) */}
        {selectedEvent && (
          <div
            id="event-detail-panel"
            className="w-full lg:w-[380px] xl:w-[410px] bg-[#004ac6] rounded-3xl p-7 sm:p-8 shadow-xl text-white flex flex-col shrink-0 relative overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
          >
            {/* Top decorative aura */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Tag + Close */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
                <GraduationCap className="w-4 h-4 text-white" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {selectedEvent.typeLabel}
                </span>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Fechar detalhes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Date */}
            <div className="mb-6 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                {selectedEvent.title}
              </h2>
              <p className="text-sm sm:text-base text-white/80 flex items-center gap-2 font-medium">
                <CalendarIcon className="w-4 h-4 text-white/80" />
                Quinta-feira, {selectedEvent.dayNumber} de Setembro
              </p>
              {selectedEvent.timeStr && (
                <p className="text-xs text-white/70 flex items-center gap-2 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedEvent.timeStr}
                </p>
              )}
            </div>

            {/* Topics Covered Box */}
            <div className="bg-white/10 rounded-2xl p-5 mb-6 relative z-10 border border-white/10 backdrop-blur-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">
                Tópicos Cobertos
              </h3>
              <ul className="space-y-2.5">
                {selectedEvent.topics.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-2 h-2 rounded-full bg-[#dbe1ff] shrink-0" />
                    <span className="text-white">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confidence Bar */}
            <div className="mt-auto mb-6 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Confiança
                </span>
                <span className="text-xs font-extrabold text-white">
                  {selectedEvent.confidence}%
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#dbe1ff] rounded-full transition-all duration-700"
                  style={{ width: `${selectedEvent.confidence}%` }}
                />
              </div>
            </div>

            {/* CTA Button */}
            <button
              id="start-event-revision-btn"
              onClick={() => onStartFocus(selectedEvent.title, selectedEvent.subject)}
              className="w-full py-4 bg-white text-[#004ac6] font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-[#f7f9fb] transition-all flex justify-center items-center gap-2 cursor-pointer relative z-10"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar Revisão</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
