import React, { useState, useEffect } from 'react';
import { X, User, Check, Palette, Sparkles, Sliders, Moon, Sun, Coffee, Eye, RotateCcw, BookOpen } from 'lucide-react';
import { StudentProfile, ThemeConfig } from '../types';
import { THEME_PRESETS, DEFAULT_THEME } from '../utils/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  currentTheme: ThemeConfig;
  onApplyTheme: (theme: ThemeConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  currentTheme,
  onApplyTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'colors'>('profile');
  const [name, setName] = useState(profile.name);
  const [studyContext, setStudyContext] = useState(profile.studyContext || profile.grade || '');
  const [school, setSchool] = useState(profile.school || '');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(profile.dailyGoalMinutes || 60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setStudyContext(profile.studyContext || profile.grade || '');
      setSchool(profile.school || '');
      setDailyGoalMinutes(profile.dailyGoalMinutes || 60);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      studyContext,
      grade: studyContext,
      school,
      dailyGoalMinutes,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleCustomColorChange = (key: keyof ThemeConfig, value: string) => {
    const updated: ThemeConfig = {
      ...currentTheme,
      id: 'custom',
      name: 'Personalizado',
      [key]: value,
    };
    if (key === 'primary') {
      updated.primaryHover = value;
      updated.primaryLight = `${value}25`;
    }
    onApplyTheme(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#c3c6d7]/30 relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div 
              style={{ backgroundColor: currentTheme.primaryLight, color: currentTheme.primary }}
              className="p-2 rounded-2xl"
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Configurações do Meu Estudo</h2>
              <p className="text-xs text-slate-500">Ajuste seu perfil de estudante e personalize a tabela de cores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 pt-3 pb-2 shrink-0 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Perfil & Metas
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'colors'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Tabela de Cores do Visual
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-3 pr-1">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#191c1e] block mb-1">
                  Nome do Estudante
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#191c1e] block mb-1">
                  O que você está estudando?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Psicologia - 3º período, 9º ano, Concurso TRT..."
                  value={studyContext}
                  onChange={(e) => setStudyContext(e.target.value)}
                  className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
                />
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[11px] text-slate-400 font-medium">Sugestões:</span>
                  {[
                    '9º ano',
                    '3º ano EM & Vestibulares',
                    'Direito - 5º período',
                    'Medicina - Internato',
                    'Concurso TRF / TRT',
                    'Ciência da Computação',
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setStudyContext(sug)}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-[#dbe1ff] text-slate-600 hover:text-[#004ac6] transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Adequado para qualquer nível: ensino fundamental, médio, faculdade, pós ou concursos.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#191c1e] block mb-1">
                  Instituição de Ensino ou Órgão Alvo (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: USP, Colégio Modelo, TRT 2ª Região..."
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#191c1e] block mb-1">
                  Meta Diária de Estudo (minutos)
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#191c1e] focus:bg-white focus:border-[#004ac6] outline-hidden"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Alterações salvas com sucesso!
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentTheme.primary }}
                  className="px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all shadow-xs hover:opacity-90"
                >
                  Salvar Perfil
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Escolha uma Paleta Pronta</h3>
                  <p className="text-xs text-slate-500">Mude as cores de todo o app com um único clique</p>
                </div>
                <button
                  type="button"
                  onClick={() => onApplyTheme(DEFAULT_THEME)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Padrão
                </button>
              </div>

              {/* Grid of presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                {THEME_PRESETS.map(preset => {
                  const isSelected = currentTheme.id === preset.id || currentTheme.primary === preset.primary;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => onApplyTheme(preset)}
                      className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 truncate">{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: preset.primary }} />
                        <span className="w-4 h-4 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: preset.accent }} />
                        <span className="w-4 h-4 rounded-md shrink-0 border border-slate-200" style={{ backgroundColor: preset.background }} />
                        <span className="w-4 h-4 rounded-md shrink-0 border border-slate-200" style={{ backgroundColor: preset.surface }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Color Pickers Section */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" /> Tabela de Cores Personalizada
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Primary */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">Cor Primária</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={currentTheme.primary}
                        onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-xs text-slate-500">{currentTheme.primary}</span>
                    </div>
                  </div>

                  {/* Accent */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">Destaque (Accent)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={currentTheme.accent}
                        onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-xs text-slate-500">{currentTheme.accent}</span>
                    </div>
                  </div>

                  {/* Background */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">Fundo Geral</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={currentTheme.background}
                        onChange={(e) => handleCustomColorChange('background', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-xs text-slate-500">{currentTheme.background}</span>
                    </div>
                  </div>

                  {/* Surface */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">Superfície / Cartão</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={currentTheme.surface}
                        onChange={(e) => handleCustomColorChange('surface', e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-xs text-slate-500">{currentTheme.surface}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close / Apply button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  style={{ backgroundColor: currentTheme.primary }}
                  className="px-6 py-2 text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-all"
                >
                  Concluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

