export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  hasGeminiKey: boolean;
}

export function getAppConfig(): AppConfig {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

  return { supabaseUrl, supabaseAnonKey, hasGeminiKey };
}
