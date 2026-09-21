import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { 
  StudentProfile, 
  Subject, 
  SubjectTopic, 
  Task, 
  CalendarEvent, 
  Question, 
  LibraryItem 
} from '../types';
import { INITIAL_SUBJECTS, INITIAL_TASKS, INITIAL_CALENDAR_EVENTS, INITIAL_QUESTIONS, INITIAL_LIBRARY } from '../data/initialData';

// Storage keys for optional local overrides / fallbacks
const STORAGE_URL_KEY = 'meu_estudo_supabase_url';
const STORAGE_ANON_KEY = 'meu_estudo_supabase_anon';

let cachedClient: SupabaseClient | null = null;
let currentConfig = {
  url: '',
  anonKey: '',
};

export const getSupabaseConfig = () => {
  if (currentConfig.url && currentConfig.anonKey) {
    return currentConfig;
  }

  // 1. Check Vite env variables and process.env
  let envUrl = '';
  let envAnon = '';

  try {
    envUrl = 
      (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
      (import.meta as any).env?.SUPABASE_URL ||
      (import.meta as any).env?.VITE_SUPABASE_URL ||
      '';
    envAnon = 
      (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
      (import.meta as any).env?.SUPABASE_ANON_KEY ||
      (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
      '';
  } catch (e) {
    // ignore
  }

  // 2. Check localStorage
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const localAnon = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) || '' : '';

  const finalUrl = (envUrl || localUrl || '').trim();
  const finalAnon = (envAnon || localAnon || '').trim();

  currentConfig = { url: finalUrl, anonKey: finalAnon };
  return currentConfig;
};

export const initSupabaseClientFromBackend = async (): Promise<SupabaseClient | null> => {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data.supabaseUrl && data.supabaseAnonKey) {
        currentConfig = {
          url: data.supabaseUrl.trim(),
          anonKey: data.supabaseAnonKey.trim(),
        };
        cachedClient = createClient(currentConfig.url, currentConfig.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
        return cachedClient;
      }
    }
  } catch (e) {
    console.warn('Não foi possível carregar config do Supabase via /api/config', e);
  }
  return getSupabaseClient();
};

export const setManualSupabaseConfig = (url: string, anonKey: string) => {
  currentConfig = { url: url.trim(), anonKey: anonKey.trim() };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, currentConfig.url);
    localStorage.setItem(STORAGE_ANON_KEY, currentConfig.anonKey);
  }
  cachedClient = null;
  return getSupabaseClient();
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error('Falha ao inicializar cliente Supabase:', err);
    return null;
  }
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
};

/* =========================================================================
   AUTH HELPER FUNCTIONS
   ========================================================================= */

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string, 
  studyContext: string
) => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase não configurado.');

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        study_context: studyContext,
      },
    },
  });

  if (error) throw error;

  // Ensure profile is created in public.profiles
  if (data.user) {
    try {
      await client.from('profiles').upsert({
        id: data.user.id,
        name,
        study_context: studyContext,
        daily_goal_minutes: 60,
        streak_days: 1,
      });
    } catch (e) {
      console.warn('Erro ao atualizar tabela profiles no signup:', e);
    }
  }

  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase não configurado.');

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase não configurado.');

  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data.user || null;
};

export const getCurrentSession = async (): Promise<Session | null> => {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session || null;
};

/* =========================================================================
   DATABASE SYNC FUNCTIONS (Strict RLS auth.uid())
   ========================================================================= */

// 1. Profile
export const fetchProfile = async (userId: string, defaultName?: string, defaultContext?: string): Promise<StudentProfile> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      id: userId,
      name: defaultName || 'Estudante',
      studyContext: defaultContext || 'Estudos Gerais',
      generalAverage: 80,
      questionsSolved: 0,
      streakDays: 1,
      dailyGoalMinutes: 60,
      weeklyFocusHistory: [
        { day: 'S', fullDay: 'Segunda', heightPercent: 40, active: true, isToday: false },
        { day: 'T', fullDay: 'Terça', heightPercent: 70, active: true, isToday: false },
        { day: 'Q', fullDay: 'Quarta', heightPercent: 90, active: true, isToday: false },
        { day: 'H', fullDay: 'Hoje', heightPercent: 35, active: true, isToday: true },
        { day: 'S', fullDay: 'Sexta', heightPercent: 0, active: false, isToday: false },
      ],
    };
  }

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    // If not found, insert one
    const fallbackProfile: StudentProfile = {
      id: userId,
      name: defaultName || 'Estudante',
      studyContext: defaultContext || 'Estudos Gerais',
      generalAverage: 80,
      questionsSolved: 0,
      streakDays: 1,
      dailyGoalMinutes: 60,
      weeklyFocusHistory: [
        { day: 'S', fullDay: 'Segunda', heightPercent: 30, active: true, isToday: false },
        { day: 'T', fullDay: 'Terça', heightPercent: 60, active: true, isToday: false },
        { day: 'Q', fullDay: 'Quarta', heightPercent: 80, active: true, isToday: false },
        { day: 'H', fullDay: 'Hoje', heightPercent: 45, active: true, isToday: true },
        { day: 'S', fullDay: 'Sexta', heightPercent: 0, active: false, isToday: false },
      ],
    };

    await client.from('profiles').upsert({
      id: userId,
      name: fallbackProfile.name,
      study_context: fallbackProfile.studyContext,
      daily_goal_minutes: fallbackProfile.dailyGoalMinutes,
      streak_days: fallbackProfile.streakDays,
    });

    return fallbackProfile;
  }

  return {
    id: data.id,
    name: data.name || defaultName || 'Estudante',
    studyContext: data.study_context || defaultContext || 'Estudos Gerais',
    grade: data.study_context || '',
    generalAverage: 82,
    questionsSolved: 0,
    streakDays: data.streak_days || 1,
    dailyGoalMinutes: data.daily_goal_minutes || 60,
    weeklyFocusHistory: [
      { day: 'S', fullDay: 'Segunda', heightPercent: 40, active: true, isToday: false },
      { day: 'T', fullDay: 'Terça', heightPercent: 70, active: true, isToday: false },
      { day: 'Q', fullDay: 'Quarta', heightPercent: 90, active: true, isToday: false },
      { day: 'H', fullDay: 'Hoje', heightPercent: 45, active: true, isToday: true },
      { day: 'S', fullDay: 'Sexta', heightPercent: 0, active: false, isToday: false },
    ],
  };
};

export const updateProfile = async (userId: string, updates: Partial<StudentProfile>) => {
  const client = getSupabaseClient();
  if (!client) return;

  const payload: any = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.studyContext !== undefined) payload.study_context = updates.studyContext;
  if (updates.dailyGoalMinutes !== undefined) payload.daily_goal_minutes = updates.dailyGoalMinutes;
  if (updates.streakDays !== undefined) payload.streak_days = updates.streakDays;

  await client.from('profiles').update(payload).eq('id', userId);
};

// 2. Subjects & Topics
export const fetchSubjects = async (userId: string): Promise<Subject[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data: subjectsData, error: subError } = await client
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (subError) throw subError;
  if (!subjectsData || subjectsData.length === 0) return [];

  const { data: topicsData } = await client
    .from('subject_topics')
    .select('*')
    .eq('user_id', userId);

  return subjectsData.map((s: any) => {
    const topics: SubjectTopic[] = (topicsData || [])
      .filter((t: any) => t.subject_id === s.id)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        masteryPercentage: Number(t.mastery_percentage) || 0,
        questionsDone: Number(t.questions_done) || 0,
        status: (t.status as 'good' | 'alert' | 'danger') || 'good',
      }));

    return {
      id: s.id,
      name: s.name,
      icon: s.icon || 'book',
      contentsCount: topics.length,
      questionsCount: topics.reduce((acc, t) => acc + t.questionsDone, 0),
      masteryPercentage: Number(s.mastery_percentage) || 0,
      masteryTrend: 0,
      color: s.color || '#004ac6',
      bgColor: s.color || '#004ac6',
      accentColor: '#dbe1ff',
      topics,
      description: s.description || '',
    };
  });
};

export const createSubject = async (userId: string, subject: Omit<Subject, 'id'>): Promise<Subject> => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase indisponível');

  const { data, error } = await client
    .from('subjects')
    .insert({
      user_id: userId,
      name: subject.name,
      icon: subject.icon,
      color: subject.color,
      mastery_percentage: subject.masteryPercentage || 0,
      description: subject.description || '',
    })
    .select()
    .single();

  if (error) throw error;

  // Insert topics if any
  let createdTopics: SubjectTopic[] = [];
  if (subject.topics && subject.topics.length > 0) {
    const topicInserts = subject.topics.map(t => ({
      subject_id: data.id,
      user_id: userId,
      name: t.name,
      mastery_percentage: t.masteryPercentage || 0,
      questions_done: t.questionsDone || 0,
      status: t.status || 'good',
    }));

    const { data: tData } = await client
      .from('subject_topics')
      .insert(topicInserts)
      .select();

    if (tData) {
      createdTopics = tData.map((t: any) => ({
        id: t.id,
        name: t.name,
        masteryPercentage: t.mastery_percentage,
        questionsDone: t.questions_done,
        status: t.status,
      }));
    }
  }

  return {
    ...subject,
    id: data.id,
    topics: createdTopics,
  };
};

export const deleteSubject = async (userId: string, subjectId: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('subjects').delete().eq('id', subjectId).eq('user_id', userId);
};

// 3. Tasks
export const fetchTasks = async (userId: string): Promise<Task[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    subject: t.subject || 'Geral',
    details: t.details || undefined,
    durationMinutes: t.duration_minutes || 30,
    dueDate: t.due_date || 'Hoje',
    priority: (t.priority as 'normal' | 'alta' | 'urgente') || 'normal',
    completed: Boolean(t.completed),
    completedAt: t.completed_at || undefined,
  }));
};

export const createTask = async (userId: string, task: Omit<Task, 'id'>): Promise<Task> => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase indisponível');

  // format date if needed
  let dueDateVal = task.dueDate;
  if (dueDateVal === 'Hoje' || dueDateVal === 'Amanhã') {
    const today = new Date();
    if (dueDateVal === 'Amanhã') today.setDate(today.getDate() + 1);
    dueDateVal = today.toISOString().split('T')[0];
  }

  const { data, error } = await client
    .from('tasks')
    .insert({
      user_id: userId,
      title: task.title,
      subject: task.subject,
      details: task.details || null,
      duration_minutes: task.durationMinutes,
      due_date: dueDateVal,
      priority: task.priority,
      completed: false,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...task,
    id: data.id,
  };
};

export const updateTask = async (userId: string, taskId: string, updates: Partial<Task>) => {
  const client = getSupabaseClient();
  if (!client) return;

  const payload: any = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.subject !== undefined) payload.subject = updates.subject;
  if (updates.details !== undefined) payload.details = updates.details;
  if (updates.durationMinutes !== undefined) payload.duration_minutes = updates.durationMinutes;
  if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.completed !== undefined) {
    payload.completed = updates.completed;
    payload.completed_at = updates.completed ? new Date().toISOString() : null;
  }

  await client.from('tasks').update(payload).eq('id', taskId).eq('user_id', userId);
};

export const deleteTask = async (userId: string, taskId: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('tasks').delete().eq('id', taskId).eq('user_id', userId);
};

// 4. Calendar Events
export const fetchCalendarEvents = async (userId: string): Promise<CalendarEvent[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) throw error;

  return (data || []).map((e: any) => {
    const dayNumber = e.date ? parseInt(e.date.split('-')[2] || '1', 10) : 1;
    const type = (e.type as 'exam' | 'study' | 'delivery' | 'simulation') || 'study';
    const typeLabel = 
      type === 'exam' ? 'Prova' :
      type === 'study' ? 'Estudo' :
      type === 'simulation' ? 'Simulado' : 'Entrega';

    return {
      id: e.id,
      title: e.title,
      date: e.date,
      dayNumber,
      type,
      typeLabel,
      subject: e.subject || 'Geral',
      timeStr: e.time_str || undefined,
      topics: Array.isArray(e.topics) ? e.topics : [],
      confidence: 85,
      colorClass: type === 'exam' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50',
      bgBadgeClass: type === 'exam' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700',
    };
  });
};

export const createCalendarEvent = async (userId: string, event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase indisponível');

  const { data, error } = await client
    .from('calendar_events')
    .insert({
      user_id: userId,
      title: event.title,
      date: event.date,
      type: event.type,
      subject: event.subject,
      time_str: event.timeStr || null,
      topics: event.topics || [],
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...event,
    id: data.id,
  };
};

export const deleteCalendarEvent = async (userId: string, eventId: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('calendar_events').delete().eq('id', eventId).eq('user_id', userId);
};

// 5. Questions & Attempts
export const fetchQuestions = async (userId: string): Promise<Question[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('questions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((q: any) => ({
    id: q.id,
    subject: q.subject,
    topic: q.topic,
    questionText: q.question_text,
    options: Array.isArray(q.options) ? q.options : [],
    correctAnswerIndex: Number(q.correct_answer_index) || 0,
    explanation: q.explanation || '',
    difficulty: (q.difficulty as 'Fácil' | 'Médio' | 'Difícil') || 'Médio',
    generatedByAi: Boolean(q.generated_by_ai),
  }));
};

export const insertQuestions = async (
  userId: string, 
  questions: Array<{
    subject: string;
    topic: string;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
    generatedByAi?: boolean;
  }>
): Promise<Question[]> => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase indisponível');

  const payload = questions.map(q => ({
    user_id: userId,
    subject: q.subject,
    topic: q.topic,
    question_text: q.questionText,
    options: q.options,
    correct_answer_index: q.correctAnswerIndex,
    explanation: q.explanation,
    difficulty: q.difficulty,
    generated_by_ai: Boolean(q.generatedByAi),
  }));

  const { data, error } = await client
    .from('questions')
    .insert(payload)
    .select();

  if (error) throw error;

  return (data || []).map((q: any) => ({
    id: q.id,
    subject: q.subject,
    topic: q.topic,
    questionText: q.question_text,
    options: q.options,
    correctAnswerIndex: q.correct_answer_index,
    explanation: q.explanation,
    difficulty: q.difficulty,
    generatedByAi: q.generated_by_ai,
  }));
};

export const recordQuestionAttempt = async (
  userId: string, 
  questionId: string, 
  selectedIndex: number, 
  isCorrect: boolean
) => {
  const client = getSupabaseClient();
  if (!client) return;

  await client.from('question_attempts').insert({
    user_id: userId,
    question_id: questionId,
    selected_index: selectedIndex,
    is_correct: isCorrect,
  });
};

// 6. Library Items
export const fetchLibraryItems = async (userId: string): Promise<LibraryItem[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('library_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    subject: item.subject || 'Geral',
    type: (item.type as 'pdf' | 'video' | 'notes' | 'summary') || 'pdf',
    typeLabel: item.type === 'video' ? 'Vídeo' : item.type === 'notes' ? 'Notas' : item.type === 'summary' ? 'Resumo' : 'PDF',
    sizeOrDuration: '2.4 MB',
    pagesOrDurationText: 'Material de Apoio',
    updatedAt: new Date(item.created_at || Date.now()).toLocaleDateString('pt-BR'),
    downloadUrl: item.url || undefined,
    tags: Array.isArray(item.tags) ? item.tags : [],
  }));
};

export const createLibraryItem = async (userId: string, item: Omit<LibraryItem, 'id'>): Promise<LibraryItem> => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase indisponível');

  const { data, error } = await client
    .from('library_items')
    .insert({
      user_id: userId,
      title: item.title,
      subject: item.subject,
      type: item.type,
      url: item.downloadUrl || null,
      tags: item.tags || [],
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...item,
    id: data.id,
  };
};

export const deleteLibraryItem = async (userId: string, itemId: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('library_items').delete().eq('id', itemId).eq('user_id', userId);
};

// 7. Initial Seed for New Users (if user has 0 subjects)
export const seedInitialUserData = async (userId: string, name: string, studyContext: string) => {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    // Check if user already has subjects
    const { count } = await client
      .from('subjects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (count && count > 0) {
      return; // already has data
    }

    // Seed 2 default subjects adapted to user context
    const isMedOrBio = studyContext.toLowerCase().includes('med') || studyContext.toLowerCase().includes('bio') || studyContext.toLowerCase().includes('psico');
    const isLawOrConcurso = studyContext.toLowerCase().includes('direito') || studyContext.toLowerCase().includes('concurso') || studyContext.toLowerCase().includes('oab');
    const isTech = studyContext.toLowerCase().includes('ti') || studyContext.toLowerCase().includes('comp') || studyContext.toLowerCase().includes('prog');

    let starterSubjects = INITIAL_SUBJECTS.slice(0, 3);
    if (isLawOrConcurso) {
      starterSubjects = [
        {
          ...INITIAL_SUBJECTS[0],
          name: 'Direito Constitucional',
          description: 'Direitos fundamentais, organização do Estado e poderes.',
          topics: [
            { id: 'dc-1', name: 'Direitos e Garantias Fundamentais', masteryPercentage: 70, questionsDone: 30, status: 'good' },
            { id: 'dc-2', name: 'Controle de Constitucionalidade', masteryPercentage: 55, questionsDone: 20, status: 'alert' },
          ],
        },
        {
          ...INITIAL_SUBJECTS[1],
          name: 'Direito Administrativo',
          description: 'Regime jurídico, atos administrativos e licitações.',
          topics: [
            { id: 'da-1', name: 'Princípios da Administração Pública', masteryPercentage: 80, questionsDone: 25, status: 'good' },
            { id: 'da-2', name: 'Atos e Poderes Administrativos', masteryPercentage: 60, questionsDone: 15, status: 'alert' },
          ],
        },
      ];
    } else if (isMedOrBio) {
      starterSubjects = [
        {
          ...INITIAL_SUBJECTS[0],
          name: 'Fisiologia Humana',
          description: 'Sistemas cardiovascular, renal e endócrino.',
          topics: [
            { id: 'fis-1', name: 'Potencial de Ação e Sinapses', masteryPercentage: 75, questionsDone: 20, status: 'good' },
            { id: 'fis-2', name: 'Hemodinâmica e Ciclo Cardíaco', masteryPercentage: 65, questionsDone: 18, status: 'alert' },
          ],
        },
        {
          ...INITIAL_SUBJECTS[1],
          name: 'Farmacologia Básica',
          description: 'Farmacocinética, farmacodinâmica e receptores.',
          topics: [
            { id: 'far-1', name: 'Mecanismos de Ação de Fármacos', masteryPercentage: 70, questionsDone: 15, status: 'good' },
          ],
        },
      ];
    }

    for (const sub of starterSubjects) {
      await createSubject(userId, sub);
    }

    // Seed 2 default tasks
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await createTask(userId, {
      title: `Iniciar plano de estudos de ${starterSubjects[0]?.name || 'Revisão'}`,
      subject: starterSubjects[0]?.name || 'Geral',
      details: 'Definir os horários diários e resolver primeiras questões.',
      durationMinutes: 45,
      dueDate: todayStr,
      priority: 'alta',
      completed: false,
    });

    await createTask(userId, {
      title: 'Resolver 5 questões com IA',
      subject: starterSubjects[0]?.name || 'Geral',
      details: 'Testar a ferramenta de geração automática de questões.',
      durationMinutes: 30,
      dueDate: tomorrowStr,
      priority: 'normal',
      completed: false,
    });

    // Seed default calendar event
    await createCalendarEvent(userId, {
      title: 'Revisão Semanal de Tópicos',
      date: todayStr,
      type: 'study',
      subject: starterSubjects[0]?.name || 'Geral',
      timeStr: '14:00 - 15:30',
      topics: ['Síntese de Conteúdos', 'Mapeamento de Dúvidas'],
      dayNumber: new Date().getDate(),
      typeLabel: 'Estudo',
      confidence: 90,
      colorClass: 'border-blue-500 bg-blue-50',
      bgBadgeClass: 'bg-blue-100 text-blue-700',
    });

    // Seed 2 initial starter questions
    await insertQuestions(userId, [
      {
        subject: starterSubjects[0]?.name || 'Geral',
        topic: 'Fundamentos e Conceitos Básicos',
        questionText: `Em relação aos fundamentos centrais de ${starterSubjects[0]?.name || 'Estudos'}, qual princípio garante a retenção e consolidação a longo prazo?`,
        options: [
          'Repetição espaçada com prática ativa de evocação',
          'Leitura passiva linear repetida no mesmo dia',
          'Apenas assistir videoaulas sem resolução de problemas',
          'Memorização de véspera sem revisão posterior',
        ],
        correctAnswerIndex: 0,
        explanation: 'A prática de recuperação ativa combinada com espaçamento temporal é cientificamente comprovada como o método mais eficaz para consolidação da memória de longo prazo.',
        difficulty: 'Fácil',
        generatedByAi: false,
      },
    ]);
  } catch (e) {
    console.warn('Erro ao popular dados iniciais do usuário:', e);
  }
};
