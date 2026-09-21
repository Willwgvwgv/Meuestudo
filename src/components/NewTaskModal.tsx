import React, { useState } from 'react';
import { X, Plus, Clock, BookOpen, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { Task, Subject } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  subjects: Subject[];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  subjects,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0]?.name || 'Matemática');
  const [details, setDetails] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [dueDate, setDueDate] = useState('Hoje');
  const [priority, setPriority] = useState<'normal' | 'alta' | 'urgente'>('normal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      subject,
      details: details.trim() || undefined,
      durationMinutes: Number(durationMinutes) || 30,
      dueDate,
      priority,
    });

    setTitle('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#c3c6d7]/30 relative flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#dbe1ff] text-[#004ac6]">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#191c1e]">Nova Tarefa</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737686] hover:text-[#191c1e] hover:bg-[#eceef0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#191c1e] block mb-1">
              Título da Tarefa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Resolver lista de equações do 1º grau"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#191c1e] block mb-1">
                Disciplina
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#191c1e] block mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
              >
                <option value="normal">Normal</option>
                <option value="alta">Alta Prioridade</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#191c1e] block mb-1">
                Tempo Estimado (min)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#191c1e] block mb-1">
                Prazo / Data
              </label>
              <input
                type="text"
                placeholder="Hoje, Amanhã, 10/09..."
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#191c1e] block mb-1">
              Detalhes ou Páginas (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Páginas 40 a 52 ou 15 exercícios"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3.5 py-2 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-medium text-sm text-[#434655] hover:bg-[#eceef0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
            >
              Adicionar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
