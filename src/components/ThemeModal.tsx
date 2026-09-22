import React, { useState } from 'react';
import {
  Palette,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Sliders,
  Eye,
  Copy,
  LayoutGrid,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { THEME_PRESETS, DEFAULT_THEME } from '../utils/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onApplyTheme: (theme: ThemeConfig) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onApplyTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(currentTheme);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: ThemeConfig) => {
    setCustomTheme(preset);
    onApplyTheme(preset);
  };

  const handleColorChange = (key: keyof ThemeConfig, value: string) => {
    const updated = {
      ...customTheme,
      id: 'custom',
      name: 'Personalizado',
      [key]: value,
    };
    // Auto calculate lighter tint if primary changes
    if (key === 'primary') {
      updated.primaryHover = value;
      updated.primaryLight = `${value}20`; // 12% alpha
    }
    setCustomTheme(updated);
    onApplyTheme(updated);
  };

  const handleResetToDefault = () => {
    setCustomTheme(DEFAULT_THEME);
    onApplyTheme(DEFAULT_THEME);
  };

  const handleCopyPalette = () => {
    const paletteText = `/* Paleta de Cores Personalizada: ${customTheme.name} */
--color-primary: ${customTheme.primary};
--color-primary-hover: ${customTheme.primaryHover};
--color-accent: ${customTheme.accent};
--color-bg: ${customTheme.background};
--color-surface: ${customTheme.surface};
--color-sidebar: ${customTheme.sidebarBg};
--color-text-main: ${customTheme.textMain};
--color-border: ${customTheme.borderColor};`;

    navigator.clipboard.writeText(paletteText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleSaveAndClose = () => {
    onApplyTheme(customTheme);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c3c6d7]/30 relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tabela de Cores do Visual</h2>
              <p className="text-xs text-slate-500">
                Configure temas visuais prontos ou personalize cada tom do aplicativo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Paletas Prontas ({THEME_PRESETS.length})
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Personalizador Avançado (Tabela HEX)
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-3 space-y-5 pr-1">
          {/* Preset Cards Tab */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isSelected =
                    currentTheme.id === preset.id ||
                    (preset.id === 'ocean-blue' && currentTheme.primary === preset.primary);
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`group p-3.5 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs bg-slate-50/40'
                      }`}
                    >
                      {/* Top Info */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          {preset.mode === 'dark' && <Moon className="w-3.5 h-3.5 text-blue-400" />}
                          {preset.mode === 'sepia' && (
                            <Coffee className="w-3.5 h-3.5 text-amber-700" />
                          )}
                          {preset.mode === 'light' && (
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {/* Swatches strip */}
                      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200/60">
                        <div
                          className="w-5 h-5 rounded-lg shrink-0 shadow-2xs"
                          style={{ backgroundColor: preset.primary }}
                          title="Primária"
                        />
                        <div
                          className="w-5 h-5 rounded-lg shrink-0 shadow-2xs"
                          style={{ backgroundColor: preset.accent }}
                          title="Destaque"
                        />
                        <div
                          className="w-5 h-5 rounded-lg shrink-0 shadow-2xs border border-slate-200"
                          style={{ backgroundColor: preset.background }}
                          title="Fundo"
                        />
                        <div
                          className="w-5 h-5 rounded-lg shrink-0 shadow-2xs border border-slate-200"
                          style={{ backgroundColor: preset.sidebarBg }}
                          title="Menu Lateral"
                        />
                        <div
                          className="w-5 h-5 rounded-lg shrink-0 shadow-2xs border border-slate-200"
                          style={{ backgroundColor: preset.surface }}
                          title="Cartões"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Advanced Custom HEX Table Tab */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Sliders className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  Ajuste fino de cada cor da tabela visual. Todas as mudanças refletem
                  instantaneamente na tela para você testar.
                </span>
              </div>

              {/* Color inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Primary */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Cor Primária (Principal)
                    </label>
                    <span className="text-[11px] text-slate-400">Botões, abas ativas e ícones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {customTheme.primary}
                    </span>
                  </div>
                </div>

                {/* Accent */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Cor de Destaque (Accent)
                    </label>
                    <span className="text-[11px] text-slate-400">Tags, brilho e detalhes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {customTheme.accent}
                    </span>
                  </div>
                </div>

                {/* Background */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Fundo da Aplicação
                    </label>
                    <span className="text-[11px] text-slate-400">Área geral de fundo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {customTheme.background}
                    </span>
                  </div>
                </div>

                {/* Surface */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Superfície dos Cartões
                    </label>
                    <span className="text-[11px] text-slate-400">Cartões de matéria, notas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.surface}
                      onChange={(e) => handleColorChange('surface', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {customTheme.surface}
                    </span>
                  </div>
                </div>

                {/* Sidebar Background */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Menu Lateral (Sidebar)
                    </label>
                    <span className="text-[11px] text-slate-400">Navegação e painéis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.sidebarBg}
                      onChange={(e) => handleColorChange('sidebarBg', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {customTheme.sidebarBg}
                    </span>
                  </div>
                </div>

                {/* Text Main */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Texto Principal
                    </label>
                    <span className="text-[11px] text-slate-400">Títulos e texto de leitura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.textMain}
                      onChange={(e) => handleColorChange('textMain', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {customTheme.textMain}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Modo Base do Contraste
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Adapta ícones e caixas de diálogo
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => handleColorChange('mode', 'light')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${customTheme.mode === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                  >
                    Claro
                  </button>
                  <button
                    onClick={() => handleColorChange('mode', 'dark')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${customTheme.mode === 'dark' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                  >
                    Escuro
                  </button>
                  <button
                    onClick={() => handleColorChange('mode', 'sepia')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${customTheme.mode === 'sepia' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                  >
                    Sépia
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Preview Card Box */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Prévia Visual em Tempo Real
              </span>
              <button
                onClick={handleCopyPalette}
                className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedNotification ? 'Copiado!' : 'Copiar Variáveis CSS'}
              </button>
            </div>

            <div
              style={{
                backgroundColor: customTheme.surface,
                borderColor: customTheme.borderColor,
                color: customTheme.textMain,
              }}
              className="p-4 rounded-2xl border shadow-xs flex flex-wrap items-center justify-between gap-3 transition-all"
            >
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm" style={{ color: customTheme.textMain }}>
                  Exemplo de Cartão de Estudo
                </h4>
                <p className="text-xs" style={{ color: customTheme.textMuted }}>
                  Revisão diária de Matemática e Física • 100% Concluído
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  style={{
                    backgroundColor: customTheme.primaryLight,
                    color: customTheme.primary,
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                >
                  Meta Batida
                </span>

                <button
                  style={{
                    backgroundColor: customTheme.primary,
                    color: '#ffffff',
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrão
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleSaveAndClose}
              style={{ backgroundColor: customTheme.primary }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 transition-all"
            >
              <Check className="w-4 h-4" />
              {savedSuccess ? 'Salvo!' : 'Salvar e Usar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
