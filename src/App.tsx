/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  TabType, 
  StudentProfile, 
  Task, 
  Subject, 
  CalendarEvent, 
  Question, 
  LibraryItem, 
  NotificationItem, 
  NoteDocument,
  ThemeConfig 
} from './types';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_SUBJECTS, 
  INITIAL_TASKS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_QUESTIONS, 
  INITIAL_LIBRARY,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCUMENTS 
} from './data/initialData';
import { 
  getSupabaseClient, 
  initSupabaseClientFromBackend, 
  fetchProfile, 
  updateProfile,
  fetchSubjects,
  createSubject,
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  fetchQuestions,
  insertQuestions,
  recordQuestionAttempt,
  fetchLibraryItems,
  seedInitialUserData,
  signOut
} from './utils/supabase';
import { AuthView } from './components/AuthView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { TasksView } from './components/TasksView';
import { CalendarView } from './components/CalendarView';
import { QuestionsView } from './components/QuestionsView';
import { LibraryView } from './components/LibraryView';
import { EvolutionView } from './components/EvolutionView';
import { NotebookView } from './components/NotebookView';
import { FocusSessionModal } from './components/FocusSessionModal';
import { NewTaskModal } from './components/NewTaskModal';
import { SubjectDetailModal } from './components/SubjectDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { ThemeModal } from './components/ThemeModal';
import { loadSavedTheme, saveThemeToStorage, applyThemeToDocument } from './utils/theme';
import { Loader2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Theme & Visual styling state
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = loadSavedTheme();
    applyThemeToDocument(saved);
    return saved;
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Authentication State
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain state
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(INITIAL_LIBRARY);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [documents, setDocuments] = useState<NoteDocument[]>(() => {
    const saved = localStorage.getItem('meu_estudo_documents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore fallback
      }
    }
    return INITIAL_DOCUMENTS;
  });

  // Modals state
  const [isFocusModalOpen, setIsFocusModalOpen] = useState<boolean>(false);
  const [focusTopic, setFocusTopic] = useState<string>('Revisão Geral');
  const [focusSubject, setFocusSubject] = useState<string>('Estudos');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState<Subject | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Apply theme
  const handleApplyTheme = (newTheme: ThemeConfig) => {
    setTheme(newTheme);
    applyThemeToDocument(newTheme);
    saveThemeToStorage(newTheme);
  };

  // Load all user data from Supabase tables
  const loadUserData = useCallback(async (userId: string) => {
    setDataLoading(true);
    setDataError(null);

    try {
      // 1. Fetch Profile
      const userProfile = await fetchProfile(userId);
      setProfile(userProfile);

      // 2. Fetch Subjects
      let userSubjects = await fetchSubjects(userId);

      // If user is brand new (0 subjects), seed starter subjects adapted to their studyContext
      if (userSubjects.length === 0) {
        await seedInitialUserData(userId, userProfile.name, userProfile.studyContext || userProfile.grade || '');
        userSubjects = await fetchSubjects(userId);
      }

      setSubjects(userSubjects.length > 0 ? userSubjects : INITIAL_SUBJECTS);

      // 3. Fetch Tasks
      const userTasks = await fetchTasks(userId);
      setTasks(userTasks);

      // 4. Fetch Calendar Events
      const userEvents = await fetchCalendarEvents(userId);
      setCalendarEvents(userEvents.length > 0 ? userEvents : INITIAL_CALENDAR_EVENTS);

      // 5. Fetch Questions
      const userQuestions = await fetchQuestions(userId);
      setQuestions(userQuestions.length > 0 ? userQuestions : INITIAL_QUESTIONS);

      // 6. Fetch Library Items
      const userLibrary = await fetchLibraryItems(userId);
      setLibraryItems(userLibrary.length > 0 ? userLibrary : INITIAL_LIBRARY);

    } catch (err: any) {
      console.error('Erro ao carregar dados do Supabase:', err);
      setDataError(err?.message || 'Falha ao sincronizar dados com o Supabase.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Initialize Auth & Supabase
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;

    const setupAuth = async () => {
      setAuthLoading(true);
      try {
        // Initialize client from backend /api/config or env
        const client = await initSupabaseClientFromBackend() || getSupabaseClient();
        
        if (!client) {
          setAuthLoading(false);
          return;
        }

        const { data: sessionData } = await client.auth.getSession();
        const currentSession = sessionData?.session || null;
        setSession(currentSession);

        if (currentSession?.user) {
          await loadUserData(currentSession.user.id);
        }

        const { data: authListener } = client.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);
          if (newSession?.user) {
            await loadUserData(newSession.user.id);
          } else {
            // Reset to defaults on signout
            setProfile(INITIAL_STUDENT_PROFILE);
            setSubjects(INITIAL_SUBJECTS);
            setTasks(INITIAL_TASKS);
            setCalendarEvents(INITIAL_CALENDAR_EVENTS);
            setQuestions(INITIAL_QUESTIONS);
            setLibraryItems(INITIAL_LIBRARY);
          }
        });

        unsubscribeAuth = () => authListener.subscription.unsubscribe();
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    setupAuth();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [loadUserData]);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Erro ao sair:', e);
    }
    setSession(null);
    setActiveTab('inicio');
  };

  // Document Handlers
  const handleSaveDocument = (updatedDoc: NoteDocument) => {
    setDocuments(prev => {
      const exists = prev.some(d => d.id === updatedDoc.id);
      let next: NoteDocument[];
      if (exists) {
        next = prev.map(d => d.id === updatedDoc.id ? updatedDoc : d);
      } else {
        next = [updatedDoc, ...prev];
      }
      try {
        localStorage.setItem('meu_estudo_documents', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => {
      const next = prev.filter(d => d.id !== docId);
      try {
        localStorage.setItem('meu_estudo_documents', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleCreateDocument = (newDocData: Omit<NoteDocument, 'id' | 'createdAt' | 'updatedAt'>): NoteDocument => {
    const newDoc: NoteDocument = {
      ...newDocData,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDocuments(prev => {
      const next = [newDoc, ...prev];
      try {
        localStorage.setItem('meu_estudo_documents', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return newDoc;
  };

  // Task Handlers with Supabase persistence
  const handleToggleTask = async (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const nextCompleted = !targetTask.completed;

    if (nextCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    // Optimistic local update
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? 'Agora mesmo' : undefined,
          };
        }
        return t;
      })
    );

    // Persist to Supabase if logged in
    if (session?.user) {
      try {
        await updateTask(session.user.id, taskId, {
          completed: nextCompleted,
        });
      } catch (err) {
        console.error('Erro ao atualizar tarefa no Supabase:', err);
      }
    }
  };

  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      ...newTaskData,
      id: tempId,
      completed: false,
    };

    // Optimistic UI update
    setTasks(prev => [newTask, ...prev]);

    // Persist to Supabase if logged in
    if (session?.user) {
      try {
        const created = await createTask(session.user.id, { ...newTaskData, completed: false });
        // Replace tempId with real database id
        setTasks(prev => prev.map(t => t.id === tempId ? created : t));
      } catch (err) {
        console.error('Erro ao salvar tarefa no Supabase:', err);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (session?.user) {
      try {
        await deleteTask(session.user.id, taskId);
      } catch (err) {
        console.error('Erro ao excluir tarefa do Supabase:', err);
      }
    }
  };

  // Question Handlers with Supabase persistence
  const handleSaveQuestions = async (newQs: Question[]) => {
    // Optimistic update
    setQuestions(prev => [...newQs, ...prev]);

    if (session?.user) {
      try {
        const saved = await insertQuestions(session.user.id, newQs);
        // Update with true DB generated IDs
        setQuestions(prev => {
          const others = prev.filter(p => !newQs.some(n => n.id === p.id));
          return [...saved, ...others];
        });
      } catch (err) {
        console.error('Erro ao persistir questões no Supabase:', err);
      }
    }
  };

  const handleRecordAttempt = async (questionId: string, selectedIndex: number, isCorrect: boolean) => {
    if (session?.user) {
      try {
        await recordQuestionAttempt(session.user.id, questionId, selectedIndex, isCorrect);
      } catch (err) {
        console.error('Erro ao registrar tentativa de questão:', err);
      }
    }
  };

  // Focus & Evolution Handlers
  const handleStartFocus = (topicName?: string, subjectName?: string) => {
    if (topicName) setFocusTopic(topicName);
    if (subjectName) setFocusSubject(subjectName);
    setIsFocusModalOpen(true);
  };

  const handleCompleteFocusSession = async (minutes: number) => {
    const updatedStreak = profile.streakDays + 1;
    setProfile(prev => ({
      ...prev,
      streakDays: updatedStreak,
    }));

    if (session?.user) {
      try {
        await updateProfile(session.user.id, { streakDays: updatedStreak });
      } catch (err) {
        console.error('Erro ao atualizar streak no Supabase:', err);
      }
    }
  };

  const handleMarkNotificationAsRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleUpdateProfile = async (updated: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));

    if (session?.user) {
      try {
        await updateProfile(session.user.id, updated);
      } catch (err) {
        console.error('Erro ao atualizar perfil no Supabase:', err);
      }
    }
  };

  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Initial Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-[#004ac6] flex items-center justify-center shadow-lg shadow-[#004ac6]/20">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-700">Iniciando Meu Estudo...</p>
          <p className="text-xs text-slate-400">Verificando sessão segura no Supabase</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Screen -> Render AuthView
  if (!session) {
    return (
      <AuthView 
        onAuthenticated={() => {
          const client = getSupabaseClient();
          if (client) {
            client.auth.getSession().then(({ data }) => {
              if (data.session) {
                setSession(data.session);
                loadUserData(data.session.user.id);
              }
            });
          }
        }} 
      />
    );
  }

  // 3. Authenticated App Layout
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans selection:bg-[#dbe1ff] selection:text-[#004ac6]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        profile={profile}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingTasksCount={tasks.filter(t => !t.completed).length}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300">
        {/* Fixed Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onStartFocus={() => handleStartFocus()}
          onNavigate={handleNavigate}
          streakDays={profile.streakDays}
          onSignOut={handleSignOut}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 px-4 sm:px-8 md:px-12 pt-20 pb-16 w-full overflow-x-hidden">
          {/* Subtle Data Refresh Banner if error occurred */}
          {dataError && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-4">
              <span>{dataError}</span>
              <button
                type="button"
                onClick={() => session?.user && loadUserData(session.user.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-bold text-xs text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {activeTab === 'inicio' && (
            <DashboardView
              profile={profile}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onNavigate={handleNavigate}
              onStartFocus={handleStartFocus}
            />
          )}

          {activeTab === 'materias' && (
            <SubjectsView
              subjects={subjects}
              profile={profile}
              onSelectSubject={(subj) => setSelectedSubjectDetail(subj)}
              onStartFocus={handleStartFocus}
            />
          )}

          {activeTab === 'tarefas' && (
            <TasksView
              tasks={tasks}
              profile={profile}
              onToggleTask={handleToggleTask}
              onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'caderno' && (
            <NotebookView
              documents={documents}
              onSaveDocument={handleSaveDocument}
              onDeleteDocument={handleDeleteDocument}
              onCreateDocument={handleCreateDocument}
              subjects={subjects}
            />
          )}

          {activeTab === 'calendario' && (
            <CalendarView
              events={calendarEvents}
              onStartFocus={handleStartFocus}
            />
          )}

          {activeTab === 'questoes' && (
            <QuestionsView
              questions={questions}
              subjects={subjects}
              onSaveQuestions={handleSaveQuestions}
              onRecordAttempt={handleRecordAttempt}
            />
          )}

          {activeTab === 'biblioteca' && (
            <LibraryView
              items={libraryItems}
            />
          )}

          {activeTab === 'evolucao' && (
            <EvolutionView
              subjects={subjects}
              profile={profile}
              onStartFocus={handleStartFocus}
            />
          )}
        </main>
      </div>

      {/* Focus Timer Modal */}
      <FocusSessionModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        initialTopic={focusTopic}
        initialSubject={focusSubject}
        onCompleteSession={handleCompleteFocusSession}
      />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        subjects={subjects}
      />

      {/* Subject Drilldown Modal */}
      <SubjectDetailModal
        subject={selectedSubjectDetail}
        onClose={() => setSelectedSubjectDetail(null)}
        onStartFocus={handleStartFocus}
      />

      {/* Profile & Preferences Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        currentTheme={theme}
        onApplyTheme={handleApplyTheme}
      />

      {/* Visual Color Palette Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onApplyTheme={handleApplyTheme}
      />
    </div>
  );
}
