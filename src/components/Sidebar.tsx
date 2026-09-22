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

export const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDA-8GdXJibg6kWaVUsYnr_tbMKQsC-9qCHiAfdVUMGEsd1rVmAhNHxFqXbbx467gihIOHcdj_2T42JUvZlr_MXTKyIqOPvuve4vfXQ4EpqYzBMQ2wH3PkwMTQIZoZjfpIcBO3N5FmU1Ud1msWIkTHBEtYf-JYdSM7uLe44cAzCPpwvU2Q_0KsdeDKZe3bgdSzTZxIRFl8cQMKd6xB__p7g6Y6iVnnUZkB2_vLJZlXs12-cogcDWJD70w';

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
        className={`fixed top-0 left-0 h-full w-72 bg-[#f2f4f6] z-50 flex flex-col border-r border-[#c3c6d7]/30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleNavClick('inicio')}
          >
            <img
              src={LOGO_URL}
              alt="Meu Estudo Logo"
              className="h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback graceful vector icon if external link blocked
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-bold text-2xl text-[#004ac6] tracking-tight">Meu Estudo</span>
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
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-sm font-semibold'
                    : 'text-[#434655] hover:bg-[#e6e8ea] hover:text-[#191c1e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-[#505f76]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#2563eb]/10 text-[#004ac6]'
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
        <div className="p-4 border-t border-[#c3c6d7]/30 space-y-2">
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/70 hover:bg-white text-slate-700 hover:text-indigo-600 text-xs font-semibold border border-slate-200/80 transition-all shadow-2xs group"
              title="Personalizar Tabela de Cores do Visual"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span>Tabela de Cores</span>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md">
                Visual
              </span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div
              id="user-profile-card"
              className="flex items-center gap-3 bg-[#e0e3e5]/60 hover:bg-[#e0e3e5] p-3 rounded-xl transition-colors cursor-pointer group flex-1 overflow-hidden"
              onClick={() => handleNavClick('evolucao')}
            >
              <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-[#191c1e] truncate group-hover:text-[#004ac6] transition-colors">
                  {profile.name}
                </p>
                <p className="text-xs text-[#434655] truncate">
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
