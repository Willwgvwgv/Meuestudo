import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Key,
  ExternalLink,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  isSupabaseConfigured,
  setManualSupabaseConfig,
  getSupabaseConfig,
} from '../utils/supabase';

interface AuthViewProps {
  onSuccess?: () => void;
  onAuthenticated?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onAuthenticated }) => {
  const triggerSuccess = () => {
    if (onAuthenticated) onAuthenticated();
    if (onSuccess) onSuccess();
  };

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studyContext, setStudyContext] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Manual configuration drawer if secrets are not set
  const [showConfigDrawer, setShowConfigDrawer] = useState(!isSupabaseConfigured());
  const [inputUrl, setInputUrl] = useState(getSupabaseConfig().url || '');
  const [inputAnonKey, setInputAnonKey] = useState(getSupabaseConfig().anonKey || '');
  const [configSaved, setConfigSaved] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputAnonKey) {
      setErrorMessage('Por favor informe a Project URL e a Anon Public Key.');
      return;
    }
    setManualSupabaseConfig(inputUrl, inputAnonKey);
    setConfigSaved(true);
    setShowConfigDrawer(false);
    setErrorMessage(null);
    setInfoMessage(
      'Configuração do Supabase salva com sucesso! Agora você pode criar sua conta ou entrar.',
    );
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!isSupabaseConfigured()) {
      setShowConfigDrawer(true);
      setErrorMessage('Configure sua Project URL e Anon Key do Supabase antes de prosseguir.');
      return;
    }

    if (!email || !password) {
      setErrorMessage('Preencha seu e-mail e sua senha.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        triggerSuccess();
      } else {
        if (!name.trim()) {
          setErrorMessage('Por favor, informe seu nome.');
          setLoading(false);
          return;
        }

        const finalContext = studyContext.trim() || 'Estudos Gerais';
        const res = await signUpWithEmail(email, password, name.trim(), finalContext);

        if (res?.session) {
          triggerSuccess();
        } else {
          // If email confirmation is required by Supabase project settings
          setInfoMessage(
            'Conta criada com sucesso! Se o e-mail exigir confirmação, verifique sua caixa de entrada, ou faça login com suas credenciais.',
          );
          setMode('login');
        }
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      const msg = err?.message || 'Falha ao autenticar.';
      if (msg.includes('Invalid login credentials')) {
        setErrorMessage('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else if (msg.includes('User already registered')) {
        setErrorMessage('Este e-mail já está cadastrado. Tente fazer login.');
        setMode('login');
      } else if (msg.includes('Password should be')) {
        setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    if (!isSupabaseConfigured()) {
      setShowConfigDrawer(true);
      setErrorMessage('Configure as chaves do Supabase antes de usar o login com Google.');
      return;
    }

    try {
      setLoading(true);
      await signInWithGoogle();
      // OAuth redirects or opens popup
    } catch (err: any) {
      console.error('Erro no login com Google:', err);
      setErrorMessage(err?.message || 'Falha ao iniciar autenticação com Google.');
      setLoading(false);
    }
  };

  const studySuggestions = [
    'Ensino Médio / ENEM',
    'Direito - 4º Período',
    'Concurso TRT / Tribunais',
    'Medicina / Residência',
    'Engenharia de Software',
    'Psicologia - 3º Período',
    'Concurso Bancário',
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#191c1e] flex flex-col justify-between selection:bg-[#004ac6] selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <header className="w-full px-6 py-5 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004ac6] to-[#2563eb] text-white flex items-center justify-center shadow-md shadow-[#004ac6]/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#191c1e] block leading-none">
              Meu Estudo
            </span>
            <span className="text-[11px] font-medium text-[#737686]">
              Plataforma Inteligente de Aprendizagem
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowConfigDrawer(!showConfigDrawer)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Ver credenciais de conexão do Supabase"
        >
          <Key className="w-3.5 h-3.5 text-[#004ac6]" />
          <span>Configuração Supabase</span>
          {isSupabaseConfigured() ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" title="Configurado" />
          ) : (
            <span
              className="w-2 h-2 rounded-full bg-amber-500 ml-1 animate-pulse"
              title="Pendente de chaves"
            />
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Quick Setup Drawer if Supabase keys not set */}
          {showConfigDrawer && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">Credenciais do Supabase</h3>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Você pode colar sua <strong>Project URL</strong> e <strong>anon key</strong>{' '}
                    abaixo para conectar imediatamente ou adicioná-las aos <strong>Secrets</strong>{' '}
                    do AI Studio (<code>SUPABASE_URL</code> e <code>SUPABASE_ANON_KEY</code>).
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="flex flex-col gap-2.5 mt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Anon Public Key
                  </label>
                  <input
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={inputAnonKey}
                    onChange={(e) => setInputAnonKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900 font-mono"
                    required
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Salvo com segurança no navegador
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Salvar Conexão
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Main Auth Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-7 sm:p-8 flex flex-col gap-6">
            {/* Tab switch: Login / Register */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#191c1e] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Entrar na Conta
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#191c1e] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Criar Nova Conta
              </button>
            </div>

            {/* Title & subtitle */}
            <div>
              <h2 className="text-2xl font-extrabold text-[#191c1e] tracking-tight">
                {mode === 'login' ? 'Bem-vindo de volta!' : 'Comece seus estudos'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Acesse seu plano de estudos, matérias e simuladores.'
                  : 'Crie seu perfil personalizado com isolamento total de dados.'}
              </p>
            </div>

            {/* Error & Info Alerts */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {infoMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar com Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ou com e-mail
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Seu Nome Completo
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ex: Lucas Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      O que você está estudando?
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ex: Psicologia - 3º período, Concurso TRT, 9º ano..."
                        value={studyContext}
                        onChange={(e) => setStudyContext(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900 transition-all"
                      />
                    </div>
                    {/* Quick Context Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {studySuggestions.slice(0, 4).map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setStudyContext(sug)}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors cursor-pointer"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Senha</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() =>
                        setInfoMessage(
                          'Para redefinir sua senha, solicite o link através do painel de Auth do Supabase ou cadastre um novo usuário.',
                        )
                      }
                      className="text-[11px] text-[#004ac6] hover:underline font-semibold cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6] text-slate-900 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Processando...</span>
                ) : mode === 'login' ? (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Criar Minha Conta</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-xs text-slate-500">
                {mode === 'login' ? 'Não tem uma conta ainda? ' : 'Já possui uma conta? '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setErrorMessage(null);
                  }}
                  className="text-[#004ac6] font-bold hover:underline cursor-pointer"
                >
                  {mode === 'login' ? 'Cadastre-se gratuitamente' : 'Fazer login'}
                </button>
              </p>
            </div>
          </div>

          {/* Privacy & RLS reassurance footer */}
          <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Banco protegido por Row Level Security (RLS) no Supabase</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/60">
        Meu Estudo &copy; {new Date().getFullYear()} &bull; Plataforma segura com Supabase e IA
      </footer>
    </div>
  );
};
