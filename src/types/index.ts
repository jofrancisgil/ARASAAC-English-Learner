export type SemanticCategoryId = string;

export interface SemanticCategory {
  id: SemanticCategoryId;
  name: string;
  iconName?: string;
  emoji?: string;
  description: string;
  pastelBg: string;
  pastelBorder: string;
  pastelText: string;
  badgeBg: string;
  aacColorCode: string; // Fitzgerald key color coding standard
  custom?: boolean;
}

export interface VocabularyItem {
  id: string; // unique item id
  arasaacId: number; // official ARASAAC pictogram id
  word: string; // English word
  category: SemanticCategoryId;
  phonetic?: string;
  exampleSentence?: string;
  syllables?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  custom?: boolean;
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  vocabularyId: string;
  word: string;
  category: SemanticCategoryId;
  isCorrect: boolean;
  selectedAnswer: string;
  mode: 'pic-to-word' | 'word-to-pic' | 'listening';
}

export interface QuizSession {
  id: string;
  date: string;
  studentId: string;
  category: SemanticCategoryId | 'all';
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  durationSeconds: number;
  attempts: QuizAttempt[];
}

export interface StudentProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  gradeOrGroup: string;
  targetLevel: 'Beginner' | 'Elementary' | 'Intermediate';
  notes: string;
  targetWords: string[]; // word IDs targeted in IEP
  speechRate: number; // 0.5 to 1.2
  highContrastMode?: boolean;
  fontSizePreference?: 'normal' | 'large' | 'xlarge';
  createdAt: string;
  lastActive: string;
}

export interface ProgressSummary {
  totalPractices: number;
  totalTimeMinutes: number;
  overallAccuracy: number;
  masteredWordsCount: number;
  categoryStats: Record<
    SemanticCategoryId,
    {
      attempted: number;
      correct: number;
      accuracy: number;
      masteredCount: number;
      totalCategoryWords: number;
    }
  >;
  masteredWordIds: string[];
  strugglingWordIds: string[];
}

export type ReportTemplateType =
  | 'iep-progress' // Comprehensive Individual Educational Progress Report
  | 'visual-board' // Printable PECS / Communication Board grid
  | 'session-log'; // Detailed chronological session history

export interface ReportConfig {
  template: ReportTemplateType;
  schoolName: string;
  educatorName: string;
  reportPeriod: string;
  includeThumbnails: boolean;
  includeNotes: boolean;
  includeSignatures: boolean;
  paperSize: 'a4' | 'letter';
  colorMode: 'pastel' | 'monochrome';
  customNotes?: string;
}
