import React from 'react';
import { TabType, StudentProfile } from '../types';
import {
  Home,
  CheckSquare,
  Calendar as CalendarIcon,
  BookOpen,
  Edit3,
  Library,
  FileText,
  TrendingUp,
  User,
  Palette,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  profile: StudentProfile;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  pendingTasksCount: number;
  onOpenThemeModal?: () => void;
  onSignOut?: () => void;
}

const BrandMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="var(--color-primary)" />
    <path d="M8 12.5 16 8l8 4.5-8 4.5-8-4.5Z" fill="white" />
    <path
      d="M11 15.2v4.6c0 1.3 2.2 2.7 5 2.7s5-1.4 5-2.7v-4.6"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M23 13v5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  mobileOpen,
  setMobileOpen,
  isMobileOpen,
  onCloseMobile,
  pendingTasksCount,
  onOpenThemeModal,
  onSignOut,
}) => {
  const isOpen = isMobileOpen ?? mobileOpen ?? false;
  const handleClose = () => {
    if (onCloseMobile) onCloseMobile();
    if (setMobileOpen) setMobileOpen(false);
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'inicio', label: 'Início', icon: <Home className="w-5 h-5" /> },
    {
      id: 'tarefas',
      label: 'Tarefas',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    { id: 'caderno', label: 'Caderno', icon: <FileText className="w-5 h-5" /> },
    { id: 'calendario', label: 'Calendário', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'materias', label: 'Matérias', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'questoes', label: 'Questões', icon: <Edit3 className="w-5 h-5" /> },
    { id: 'biblioteca', label: 'Biblioteca', icon: <Library className="w-5 h-5" /> },
    { id: 'evolucao', label: 'Evolução', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    handleClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={handleClose}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 h-full w-72 bg-[#f2f4f6] z-50 flex flex-col border-r border-[#c3c6d7]/30 shadow-[4px_0_24px_-8px_rgba(16,24,40,0.08)] lg:shadow-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleNavClick('inicio')}
          >
            <BrandMark className="h-9 w-9 shrink-0 shadow-sm rounded-[10px]" />
            <div className="leading-tight">
              <span className="font-extrabold text-xl text-[#191c1e] tracking-tight block">
                Meu Estudo
              </span>
              <span className="text-[11px] font-medium text-[#737686]">Plataforma de Estudos</span>
            </div>
          </div>

          <button
            id="close-sidebar-btn"
            className="lg:hidden p-1.5 rounded-lg text-[#434655] hover:bg-[#e0e3e5] transition-colors"
            onClick={handleClose}
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                  isActive
                    ? 'bg-[#004ac6] text-white shadow-sm shadow-[#004ac6]/25 font-semibold'
                    : 'text-[#434655] hover:bg-white hover:text-[#191c1e]'
                }`}
              >
                {isActive && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#004ac6]" />
                )}
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-[#505f76]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#004ac6]/10 text-[#004ac6]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Theme & Palette button & Profile Card */}
        <div className="p-4 border-t border-[#c3c6d7]/30 space-y-2.5">
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-white text-slate-700 hover:text-[#004ac6] text-xs font-semibold border border-[#c3c6d7]/40 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              title="Personalizar Tabela de Cores do Visual"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#004ac6] group-hover:rotate-12 transition-transform" />
                <span>Tabela de Cores</span>
              </div>
              <span className="text-[10px] bg-[#dbe1ff] text-[#004ac6] font-bold px-1.5 py-0.5 rounded-md">
                Visual
              </span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div
              id="user-profile-card"
              className="flex items-center gap-3 bg-white hover:bg-white p-2.5 rounded-xl border border-[#c3c6d7]/40 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex-1 overflow-hidden"
              onClick={() => handleNavClick('evolucao')}
            >
              <div className="w-9 h-9 rounded-full bg-[#004ac6] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                {profile.name?.trim()?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-[#191c1e] truncate group-hover:text-[#004ac6] transition-colors">
                  {profile.name}
                </p>
                <p className="text-xs text-[#737686] truncate">
                  {profile.studyContext || profile.grade || 'Estudos'}
                </p>
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white shrink-0"
                title="Conectado ao Supabase"
              />
            </div>

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 transition-colors cursor-pointer shrink-0"
                title="Sair da Conta (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
