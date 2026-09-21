import { ThemeConfig } from '../types';

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'ocean-blue',
    name: 'Azul Oceano (Padrão)',
    mode: 'light',
    primary: '#004ac6',
    primaryHover: '#2563eb',
    primaryLight: '#dbe1ff',
    accent: '#38bdf8',
    background: '#f7f9fb',
    surface: '#ffffff',
    sidebarBg: '#f2f4f6',
    textMain: '#191c1e',
    textMuted: '#737686',
    borderColor: '#c3c6d7',
    borderRadius: '2xl',
  },
  {
    id: 'emerald-green',
    name: 'Esmeralda & Bio',
    mode: 'light',
    primary: '#059669',
    primaryHover: '#10b981',
    primaryLight: '#d1fae5',
    accent: '#34d399',
    background: '#f0fdf4',
    surface: '#ffffff',
    sidebarBg: '#e6f7ed',
    textMain: '#064e3b',
    textMuted: '#4b5563',
    borderColor: '#a7f3d0',
    borderRadius: '2xl',
  },
  {
    id: 'royal-purple',
    name: 'Violeta Real',
    mode: 'light',
    primary: '#7c3aed',
    primaryHover: '#8b5cf6',
    primaryLight: '#ede9fe',
    accent: '#c084fc',
    background: '#faf5ff',
    surface: '#ffffff',
    sidebarBg: '#f3e8ff',
    textMain: '#2e1065',
    textMuted: '#6b7280',
    borderColor: '#ddd6fe',
    borderRadius: '2xl',
  },
  {
    id: 'sunset-orange',
    name: 'Pôr do Sol Enérgico',
    mode: 'light',
    primary: '#ea580c',
    primaryHover: '#f97316',
    primaryLight: '#ffedd5',
    accent: '#fbbf24',
    background: '#fff7ed',
    surface: '#ffffff',
    sidebarBg: '#ffedd5',
    textMain: '#7c2d12',
    textMuted: '#78716c',
    borderColor: '#fed7aa',
    borderRadius: '2xl',
  },
  {
    id: 'magenta-pink',
    name: 'Rosa Magenta',
    mode: 'light',
    primary: '#db2777',
    primaryHover: '#ec4899',
    primaryLight: '#fce7f3',
    accent: '#f472b6',
    background: '#fdf2f8',
    surface: '#ffffff',
    sidebarBg: '#fce7f3',
    textMain: '#831843',
    textMuted: '#6b7280',
    borderColor: '#fbcfe8',
    borderRadius: '2xl',
  },
  {
    id: 'cyan-tech',
    name: 'Ciano Tecnológico',
    mode: 'light',
    primary: '#0891b2',
    primaryHover: '#06b6d4',
    primaryLight: '#cffafe',
    accent: '#38bdf8',
    background: '#ecfeff',
    surface: '#ffffff',
    sidebarBg: '#e0f2fe',
    textMain: '#164e63',
    textMuted: '#64748b',
    borderColor: '#bae6fd',
    borderRadius: '2xl',
  },
  {
    id: 'graphite-slate',
    name: 'Grafite Minimalista',
    mode: 'light',
    primary: '#334155',
    primaryHover: '#475569',
    primaryLight: '#f1f5f9',
    accent: '#94a3b8',
    background: '#f8fafc',
    surface: '#ffffff',
    sidebarBg: '#f1f5f9',
    textMain: '#0f172a',
    textMuted: '#64748b',
    borderColor: '#cbd5e1',
    borderRadius: '2xl',
  },
  {
    id: 'ruby-red',
    name: 'Rubi Acadêmico',
    mode: 'light',
    primary: '#dc2626',
    primaryHover: '#ef4444',
    primaryLight: '#fee2e2',
    accent: '#f87171',
    background: '#fef2f2',
    surface: '#ffffff',
    sidebarBg: '#fee2e2',
    textMain: '#7f1d1d',
    textMuted: '#78716c',
    borderColor: '#fecaca',
    borderRadius: '2xl',
  },
  {
    id: 'sepia-warm',
    name: 'Sépia Livro & Café',
    mode: 'sepia',
    primary: '#9a3412',
    primaryHover: '#c2410c',
    primaryLight: '#fed7aa',
    accent: '#d97706',
    background: '#fcf8f2',
    surface: '#fffdf9',
    sidebarBg: '#f6eedd',
    textMain: '#431407',
    textMuted: '#78716c',
    borderColor: '#e7d9c5',
    borderRadius: '2xl',
  },
  {
    id: 'cosmic-dark',
    name: 'Noturno Cósmico',
    mode: 'dark',
    primary: '#38bdf8',
    primaryHover: '#60a5fa',
    primaryLight: 'rgba(56, 189, 248, 0.15)',
    accent: '#818cf8',
    background: '#090d16',
    surface: '#131b2e',
    sidebarBg: '#0f172a',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    borderColor: '#1e293b',
    borderRadius: '2xl',
  },
  {
    id: 'oled-dark',
    name: 'Noturno OLED Profundo',
    mode: 'dark',
    primary: '#60a5fa',
    primaryHover: '#3b82f6',
    primaryLight: 'rgba(96, 165, 250, 0.15)',
    accent: '#38bdf8',
    background: '#0a0a0a',
    surface: '#141414',
    sidebarBg: '#111111',
    textMain: '#f5f5f5',
    textMuted: '#a3a3a3',
    borderColor: '#262626',
    borderRadius: '2xl',
  },
];

export const DEFAULT_THEME = THEME_PRESETS[0];

export const applyThemeToDocument = (theme: ThemeConfig) => {
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-hover', theme.primaryHover);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-bg', theme.background);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--color-text-main', theme.textMain);
  root.style.setProperty('--color-text-muted', theme.textMuted);
  root.style.setProperty('--color-border', theme.borderColor);

  // Set dark/light class on HTML for CSS selectors
  if (theme.mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set data attributes for easy targeting
  root.setAttribute('data-theme-mode', theme.mode);
  root.setAttribute('data-theme-id', theme.id);
};

export const loadSavedTheme = (): ThemeConfig => {
  try {
    const saved = localStorage.getItem('meu_estudo_theme_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.primary) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_THEME;
};

export const saveThemeToStorage = (theme: ThemeConfig) => {
  try {
    localStorage.setItem('meu_estudo_theme_config', JSON.stringify(theme));
  } catch (e) {
    // fallback
  }
};
