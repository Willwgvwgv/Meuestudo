import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, Menu, Flame, Play, X, Check, Palette, LogOut } from 'lucide-react';
import { NotificationItem, TabType } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onOpenSettings: () => void;
  onOpenThemeModal: () => void;
  onStartFocus: () => void;
  onNavigate: (tab: TabType) => void;
  streakDays: number;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  notifications,
  onMarkNotificationAsRead,
  onOpenSettings,
  onOpenThemeModal,
  onStartFocus,
  onNavigate,
  streakDays,
  onSignOut,
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#f7f9fb]/85 backdrop-blur-xl z-30 border-b border-[#c3c6d7]/30 flex items-center justify-between px-4 md:px-8 shadow-[0_1px_0_rgba(16,24,40,0.03)]">
      {/* Left: Mobile hamburger & Search input */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-lg">
        <button
          id="mobile-menu-trigger"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#434655] hover:bg-[#e0e3e5] transition-colors"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686] pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Pesquisar estudos, matérias, tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#eceef0] hover:bg-[#e0e3e5]/70 focus:bg-white text-sm text-[#191c1e] placeholder-[#737686] pl-9 pr-8 py-2.5 rounded-full border border-transparent focus:border-[#004ac6]/40 focus:ring-4 focus:ring-[#004ac6]/10 outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191c1e]"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick actions, Streak, Notifications, Settings */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak badge */}
        <div
          onClick={() => onNavigate('evolucao')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer transition-colors border border-amber-500/20"
          title={`Sequência de foco ativa: ${streakDays} dias!`}
        >
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
          <span>{streakDays} dias</span>
        </div>

        {/* Quick Focus Button */}
        <button
          id="header-quick-focus-btn"
          onClick={onStartFocus}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#004ac6] text-white hover:bg-[#2563eb] text-xs font-medium shadow-xs hover:shadow-sm transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Modo Foco</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="p-2 rounded-full text-[#434655] hover:text-[#004ac6] hover:bg-[#eceef0] relative transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifPopover && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#c3c6d7]/40 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#eceef0]">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#191c1e] text-sm">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-[#dbe1ff] text-[#004ac6] font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifPopover(false)}
                  className="text-xs text-[#737686] hover:text-[#191c1e]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#737686] text-center py-6">
                    Nenhuma notificação no momento.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl transition-colors border ${
                        notif.read
                          ? 'bg-[#f7f9fb] border-[#eceef0] text-[#434655]'
                          : 'bg-[#dbe1ff]/30 border-[#2563eb]/20 text-[#191c1e]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold">{notif.title}</h4>
                        <span className="text-[10px] text-[#737686] shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-[#434655] mt-1 leading-relaxed">{notif.message}</p>

                      <div className="mt-2.5 flex items-center justify-between">
                        {notif.actionTab && (
                          <button
                            onClick={() => {
                              onNavigate(notif.actionTab!);
                              setShowNotifPopover(false);
                            }}
                            className="text-[11px] font-semibold text-[#004ac6] hover:underline"
                          >
                            Ver detalhes →
                          </button>
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => onMarkNotificationAsRead(notif.id)}
                            className="text-[11px] text-[#737686] hover:text-emerald-600 flex items-center gap-1 ml-auto"
                          >
                            <Check className="w-3 h-3" /> Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Palette / Colors button */}
        <button
          id="theme-palette-trigger-btn"
          onClick={onOpenThemeModal}
          className="p-2 rounded-full text-[#434655] hover:text-[#004ac6] hover:bg-[#eceef0] transition-colors"
          title="Tabela de Cores do Visual"
          aria-label="Tabela de Cores do Visual"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Settings button */}
        <button
          id="settings-trigger-btn"
          onClick={onOpenSettings}
          className="p-2 rounded-full text-[#434655] hover:text-[#004ac6] hover:bg-[#eceef0] transition-colors"
          aria-label="Configurações"
          title="Configurações"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Sign out button */}
        {onSignOut && (
          <button
            id="header-logout-btn"
            onClick={onSignOut}
            className="p-2 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            aria-label="Sair da Conta"
            title="Sair da Conta (Logout)"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
