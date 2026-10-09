import { StudentProfile, QuizSession, VocabularyItem, ProgressSummary, SemanticCategoryId, SemanticCategory } from '../types';
import { INITIAL_VOCABULARY } from '../data/initialVocabulary';
import { SEMANTIC_CATEGORIES } from '../data/categories';

const STORAGE_KEYS = {
  STUDENTS: 'arasaac_sen_students_v2', // v2 to cleanly isolate from sample data
  SESSIONS: 'arasaac_sen_sessions_v2',
  ACTIVE_STUDENT_ID: 'arasaac_sen_active_student_v2',
  CUSTOM_VOCAB: 'arasaac_sen_custom_vocab_v2',
  CUSTOM_CATEGORIES: 'arasaac_sen_custom_categories_v2',
  APP_SETTINGS: 'arasaac_sen_settings_v2',
};

export interface AppSettings {
  speechRate: number;
  sensoryCalmMode: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  soundFx: boolean;
  quizScaffoldingChoices: 2 | 3 | 4;
}

const DEFAULT_SETTINGS: AppSettings = {
  speechRate: 0.85,
  sensoryCalmMode: false,
  fontSize: 'large',
  soundFx: true,
  quizScaffoldingChoices: 3,
};

// Students
export const loadStudents = (): StudentProfile[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out old sample students if any residual data exists
    const filtered = parsed.filter(
      (s: StudentProfile) =>
        s &&
        !['student-1', 'student-2', 'student-3'].includes(s.id) &&
        !['Liam Carter', 'Maya Rodriguez', 'Alex Chen'].includes(s.name)
    );
    return filtered;
  } catch {
    return [];
  }
};

export const saveStudents = (students: StudentProfile[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const deleteStudent = (studentId: string): StudentProfile[] => {
  const current = loadStudents();
  const updated = current.filter((s) => s.id !== studentId);
  saveStudents(updated);
  return updated;
};

// Active Student ID
export const loadActiveStudentId = (): string => {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
  if (stored) return stored;
  const students = loadStudents();
  return students[0]?.id || '';
};

export const saveActiveStudentId = (id: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
};

// Sessions
export const loadSessions = (): QuizSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out legacy sessions for sample students
    return parsed.filter(
      (sess: QuizSession) => !['student-1', 'student-2', 'student-3'].includes(sess.studentId)
    );
  } catch {
    return [];
  }
};

export const saveSessions = (sessions: QuizSession[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};

export const recordQuizSession = (session: QuizSession) => {
  const current = loadSessions();
  const updated = [session, ...current];
  saveSessions(updated);

  // Update active student's lastActive timestamp
  const students = loadStudents();
  const idx = students.findIndex((s) => s.id === session.studentId);
  if (idx !== -1) {
    students[idx].lastActive = new Date().toISOString();
    saveStudents(students);
  }
};

// Custom Categories
export const loadCustomCategories = (): SemanticCategory[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCustomCategories = (cats: SemanticCategory[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(cats));
};

export const addCustomCategory = (category: SemanticCategory): SemanticCategory[] => {
  const existing = loadCustomCategories();
  const filtered = existing.filter((c) => c.id !== category.id);
  const updated = [...filtered, category];
  saveCustomCategories(updated);
  return updated;
};

export const deleteCustomCategory = (categoryId: string): SemanticCategory[] => {
  const existing = loadCustomCategories();
  const updated = existing.filter((c) => c.id !== categoryId);
  saveCustomCategories(updated);
  return updated;
};

export const getAllCategories = (): SemanticCategory[] => {
  const custom = loadCustomCategories();
  return [...SEMANTIC_CATEGORIES, ...custom];
};

// Custom vocabulary added by educators
export const loadCustomVocabulary = (): VocabularyItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VOCAB);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCustomVocabulary = (items: VocabularyItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CUSTOM_VOCAB, JSON.stringify(items));
};

export const addCustomVocabularyItem = (item: VocabularyItem): VocabularyItem[] => {
  const existing = loadCustomVocabulary();
  // If item with same ID exists, update it, otherwise prepend
  const filtered = existing.filter((i) => i.id !== item.id);
  const updated = [item, ...filtered];
  saveCustomVocabulary(updated);
  return updated;
};

export const deleteVocabularyItem = (itemId: string): VocabularyItem[] => {
  const existing = loadCustomVocabulary();
  const updated = existing.filter((i) => i.id !== itemId);
  saveCustomVocabulary(updated);
  return updated;
};

export const getAllVocabulary = (): VocabularyItem[] => {
  const custom = loadCustomVocabulary();
  return [...INITIAL_VOCABULARY, ...custom];
};

// App Settings
export const loadAppSettings = (): AppSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveAppSettings = (settings: AppSettings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
};

// Compute analytics for student
export const calculateStudentProgress = (
  studentId: string,
  allSessions: QuizSession[],
  vocabularyList: VocabularyItem[],
  categoriesList: SemanticCategory[] = getAllCategories()
): ProgressSummary => {
  const studentSessions = allSessions.filter((s) => s.studentId === studentId);

  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalSeconds = 0;

  // Track attempts per vocabulary ID
  const wordStats: Record<string, { correct: number; wrong: number; word: string; category: SemanticCategoryId }> = {};

  const categoryStats: ProgressSummary['categoryStats'] = {};

  // Initialize for all known categories (default + custom)
  categoriesList.forEach((cat) => {
    categoryStats[cat.id] = {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      masteredCount: 0,
      totalCategoryWords: 0,
    };
  });

  // Count total words per category in curriculum
  vocabularyList.forEach((v) => {
    if (!categoryStats[v.category]) {
      categoryStats[v.category] = {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        masteredCount: 0,
        totalCategoryWords: 0,
      };
    }
    categoryStats[v.category].totalCategoryWords += 1;
  });

  studentSessions.forEach((sess) => {
    totalQuestions += sess.totalQuestions;
    totalCorrect += sess.correctAnswers;
    totalSeconds += sess.durationSeconds || 60;

    sess.attempts.forEach((att) => {
      const cat = att.category;
      if (!categoryStats[cat]) {
        categoryStats[cat] = {
          attempted: 0,
          correct: 0,
          accuracy: 0,
          masteredCount: 0,
          totalCategoryWords: 0,
        };
      }

      categoryStats[cat].attempted += 1;
      if (att.isCorrect) {
        categoryStats[cat].correct += 1;
      }

      if (!wordStats[att.vocabularyId]) {
        wordStats[att.vocabularyId] = {
          correct: 0,
          wrong: 0,
          word: att.word,
          category: att.category,
        };
      }
      if (att.isCorrect) {
        wordStats[att.vocabularyId].correct += 1;
      } else {
        wordStats[att.vocabularyId].wrong += 1;
      }
    });
  });

  // Calculate percentage per category
  Object.keys(categoryStats).forEach((catId) => {
    const stats = categoryStats[catId];
    if (stats.attempted > 0) {
      stats.accuracy = Math.round((stats.correct / stats.attempted) * 100);
    } else {
      stats.accuracy = 0;
    }
  });

  const masteredWordIds: string[] = [];
  const strugglingWordIds: string[] = [];

  Object.entries(wordStats).forEach(([vocId, stats]) => {
    if (stats.correct >= 2 && stats.correct > stats.wrong) {
      masteredWordIds.push(vocId);
      if (categoryStats[stats.category]) {
        categoryStats[stats.category].masteredCount += 1;
      }
    } else if (stats.wrong >= 1 && stats.wrong >= stats.correct) {
      strugglingWordIds.push(vocId);
    }
  });

  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    totalPractices: studentSessions.length,
    totalTimeMinutes: Math.max(0, Math.round(totalSeconds / 60)),
    overallAccuracy,
    masteredWordsCount: masteredWordIds.length,
    categoryStats,
    masteredWordIds,
    strugglingWordIds,
  };
};

export const exportAllDataJSON = () => {
  return JSON.stringify(
    {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      students: loadStudents(),
      sessions: loadSessions(),
      customCategories: loadCustomCategories(),
      customVocabulary: loadCustomVocabulary(),
    },
    null,
    2
  );
};

export const importAllDataJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.students && Array.isArray(parsed.students)) {
      saveStudents(parsed.students);
    }
    if (parsed.sessions && Array.isArray(parsed.sessions)) {
      saveSessions(parsed.sessions);
    }
    if (parsed.customCategories && Array.isArray(parsed.customCategories)) {
      saveCustomCategories(parsed.customCategories);
    }
    if (parsed.customVocabulary && Array.isArray(parsed.customVocabulary)) {
      saveCustomVocabulary(parsed.customVocabulary);
    }
    return true;
  } catch {
    return false;
  }
};
