import { StudentProfile, ProgressSummary, QuizSession, VocabularyItem, ReportConfig } from '../types';
import { SEMANTIC_CATEGORIES } from '../data/categories';

/**
 * Format student progress data into CSV for Google Sheets
 */
export const generateGoogleSheetsCSV = (
  student: StudentProfile,
  summary: ProgressSummary,
  sessions: QuizSession[],
  vocabularyList: VocabularyItem[]
): string => {
  const rows: string[][] = [];

  // Header / Title
  rows.push(['ARASAAC SEN English Learning - Student Progress Report']);
  rows.push(['Exported for Google Sheets Analysis', new Date().toLocaleString()]);
  rows.push([]);

  // Student Info Section
  rows.push(['--- STUDENT PROFILE ---']);
  rows.push(['Student Name', student.name]);
  rows.push(['Grade / Group', student.gradeOrGroup]);
  rows.push(['Target Level', student.targetLevel]);
  rows.push(['Speech Rate', `${student.speechRate}x`]);
  rows.push(['Educator Notes', `"${(student.notes || '').replace(/"/g, '""')}"`]);
  rows.push([]);

  // Summary Metrics Section
  rows.push(['--- OVERALL PERFORMANCE SUMMARY ---']);
  rows.push(['Metric', 'Value']);
  rows.push(['Total Practice Sessions', summary.totalPractices.toString()]);
  rows.push(['Estimated Practice Time (Minutes)', summary.totalTimeMinutes.toString()]);
  rows.push(['Overall Accuracy (%)', `${summary.overallAccuracy}%`]);
  rows.push(['Mastered Words Count', summary.masteredWordsCount.toString()]);
  rows.push([]);

  // Category Mastery Breakdown Section
  rows.push(['--- SEMANTIC CATEGORY BREAKDOWN ---']);
  rows.push(['Category', 'Words in Curriculum', 'Attempts', 'Correct', 'Accuracy (%)', 'Mastered Words']);
  SEMANTIC_CATEGORIES.forEach((cat) => {
    const stat = summary.categoryStats[cat.id];
    rows.push([
      cat.name,
      stat.totalCategoryWords.toString(),
      stat.attempted.toString(),
      stat.correct.toString(),
      `${stat.accuracy}%`,
      stat.masteredCount.toString(),
    ]);
  });
  rows.push([]);

  // Mastered Vocabulary Section
  rows.push(['--- MASTERED VOCABULARY ITEMS ---']);
  rows.push(['Word', 'Category', 'ARASAAC ID', 'Syllables', 'Example Sentence']);
  const masteredItems = vocabularyList.filter((v) => summary.masteredWordIds.includes(v.id));
  if (masteredItems.length === 0) {
    rows.push(['(No words fully mastered yet - continue practice sessions)']);
  } else {
    masteredItems.forEach((item) => {
      rows.push([
        item.word,
        item.category.toUpperCase(),
        item.arasaacId.toString(),
        item.syllables || '',
        `"${(item.exampleSentence || '').replace(/"/g, '""')}"`,
      ]);
    });
  }
  rows.push([]);

  // Words Needing Support / Struggle Items
  rows.push(['--- VOCABULARY NEEDING REINFORCEMENT ---']);
  rows.push(['Word', 'Category', 'ARASAAC ID']);
  const struggleItems = vocabularyList.filter((v) => summary.strugglingWordIds.includes(v.id));
  if (struggleItems.length === 0) {
    rows.push(['(None currently flagged)']);
  } else {
    struggleItems.forEach((item) => {
      rows.push([item.word, item.category.toUpperCase(), item.arasaacId.toString()]);
    });
  }
  rows.push([]);

  // Detailed Sessions Log
  rows.push(['--- DETAILED SESSION HISTORY ---']);
  rows.push(['Session Date', 'Category Practiced', 'Total Questions', 'Correct', 'Accuracy (%)', 'Duration (Seconds)']);
  const studentSessions = sessions.filter((s) => s.studentId === student.id);
  studentSessions.forEach((sess) => {
    rows.push([
      new Date(sess.date).toLocaleString(),
      sess.category.toUpperCase(),
      sess.totalQuestions.toString(),
      sess.correctAnswers.toString(),
      `${sess.accuracy}%`,
      sess.durationSeconds.toString(),
    ]);
  });
  rows.push([]);
  rows.push(['--- ARASAAC LICENSE ATTRIBUTION ---']);
  rows.push(['"Pictographic symbols are property of the Government of Aragon and created by Sergio Palao for ARASAAC (https://arasaac.org), distributed under Creative Commons License BY-NC-SA 4.0."']);

  return rows.map((r) => r.join(',')).join('\n');
};

/**
 * Generate TSV (Tab-Separated Values) for 1-click clipboard paste into Google Sheets
 */
export const generateGoogleSheetsTSV = (
  student: StudentProfile,
  summary: ProgressSummary,
  sessions: QuizSession[],
  vocabularyList: VocabularyItem[]
): string => {
  const csv = generateGoogleSheetsCSV(student, summary, sessions, vocabularyList);
  // Transform comma to tab for spreadsheet pasting
  return csv
    .split('\n')
    .map((line) => {
      // split by commas outside quotes
      return line
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((cell) => cell.replace(/^"|"$/g, ''))
        .join('\t');
    })
    .join('\n');
};

/**
 * Trigger CSV file download
 */
export const downloadCSVFile = (content: string, filename: string) => {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Trigger Print dialog for clean PDF generation
 */
export const triggerPrintToPDF = () => {
  window.print();
};
