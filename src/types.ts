export type TabType =
  | 'inicio'
  | 'tarefas'
  | 'calendario'
  | 'materias'
  | 'questoes'
  | 'biblioteca'
  | 'caderno'
  | 'evolucao';

export interface Task {
  id: string;
  title: string;
  subject: string;
  details?: string;
  durationMinutes: number;
  dueDate: string; // e.g. "Hoje", "Amanhã", "10/09/2026", "2026-09-10"
  priority: 'normal' | 'alta' | 'urgente';
  completed: boolean;
  completedAt?: string;
}

export interface SubjectTopic {
  id: string;
  name: string;
  masteryPercentage: number;
  questionsDone: number;
  status: 'good' | 'alert' | 'danger';
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  contentsCount: number;
  questionsCount: number;
  masteryPercentage: number;
  masteryTrend: number; // e.g. +4, -2, 0
  color: string;
  bgColor: string;
  accentColor: string;
  alertCount?: number;
  alertMessage?: string;
  topics: SubjectTopic[];
  description: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  dayNumber: number;
  type: 'exam' | 'study' | 'delivery' | 'simulation';
  typeLabel: string;
  subject: string;
  timeStr?: string;
  topics: string[];
  confidence: number;
  colorClass: string;
  bgBadgeClass: string;
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  generatedByAi?: boolean;
}

export interface LibraryItem {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'notes' | 'summary';
  typeLabel: string;
  sizeOrDuration: string;
  pagesOrDurationText: string;
  updatedAt: string;
  downloadUrl?: string;
  contentPreview?: string;
  tags: string[];
}

export interface StudentProfile {
  id?: string;
  name: string;
  studyContext: string; // "O que você está estudando?" (e.g. "Psicologia - 3º período", "9º ano", "Concurso TRT")
  grade?: string; // alias/fallback
  school?: string;
  avatarUrl?: string;
  generalAverage: number;
  questionsSolved: number;
  streakDays: number;
  dailyGoalMinutes: number;
  weeklyFocusHistory: {
    day: string;
    fullDay: string;
    heightPercent: number;
    active: boolean;
    isToday: boolean;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'success';
  read: boolean;
  actionTab?: TabType;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: 'light' | 'dark' | 'sepia';
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  background: string;
  surface: string;
  sidebarBg: string;
  textMain: string;
  textMuted: string;
  borderColor: string;
  borderRadius: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export interface NoteDocument {
  id: string;
  title: string;
  subject: string;
  content: string; // HTML format for rich-text
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  folder?: string;
  paperStyle?: 'blank' | 'lined' | 'grid' | 'sepia' | 'dark';
}
