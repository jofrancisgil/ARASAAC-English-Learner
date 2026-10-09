import React, { useState } from 'react';
import {
  StudentProfile,
  QuizSession,
  VocabularyItem,
  ProgressSummary,
  SemanticCategory,
} from '../types';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  FileSpreadsheet,
  Printer,
  Plus,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit3,
  Save,
  FolderPlus,
  UserPlus,
} from 'lucide-react';

interface EducatorDashboardProps {
  students: StudentProfile[];
  activeStudent: StudentProfile | null;
  categories: SemanticCategory[];
  onSelectStudent: (student: StudentProfile) => void;
  onUpdateStudent: (updated: StudentProfile) => void;
  onOpenManageStudentsModal: () => void;
  onOpenAddCategoryModal: () => void;
  onOpenAddWordModal: () => void;
  summary: ProgressSummary;
  sessions: QuizSession[];
  vocabularyList: VocabularyItem[];
  onOpenExportModal: (template?: 'iep-progress' | 'visual-board' | 'session-log') => void;
}

export const EducatorDashboard: React.FC<EducatorDashboardProps> = ({
  students,
  activeStudent,
  categories,
  onSelectStudent,
  onUpdateStudent,
  onOpenManageStudentsModal,
  onOpenAddCategoryModal,
  onOpenAddWordModal,
  summary,
  sessions,
  vocabularyList,
  onOpenExportModal,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(activeStudent?.notes || '');

  if (!activeStudent || students.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 font-fredoka mb-2">
          Educator Progress Tracking
        </h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          No students have been registered yet. Add your students to monitor vocabulary improvements, record practice accuracy, and export customized printable IEP reports.
        </p>
        <button
          onClick={onOpenManageStudentsModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Your First Student</span>
        </button>
      </div>
    );
  }

  const studentSessions = sessions.filter((s) => s.studentId === activeStudent.id);
  const masteredItems = vocabularyList.filter((v) =>
    summary.masteredWordIds.includes(v.id)
  );
  const struggleItems = vocabularyList.filter((v) =>
    summary.strugglingWordIds.includes(v.id)
  );

  const handleSaveNotes = () => {
    onUpdateStudent({
      ...activeStudent,
      notes: notesText,
    });
    setIsEditingNotes(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Student Switcher & Quick Actions */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Active Student Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-3xl shadow-xs border border-teal-200">
              {activeStudent.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-800 font-fredoka">
                  {activeStudent.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {activeStudent.gradeOrGroup}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Level: <strong className="text-slate-700">{activeStudent.targetLevel}</strong> • Speech Rate:{' '}
                <strong className="text-slate-700">{activeStudent.speechRate}x</strong>
              </p>
            </div>
          </div>

          {/* Student Selector & Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={activeStudent.id}
              onChange={(e) => {
                const s = students.find((item) => item.id === e.target.value);
                if (s) {
                  onSelectStudent(s);
                  setNotesText(s.notes || '');
                }
              }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.avatarEmoji} {s.name} ({s.gradeOrGroup})
                </option>
              ))}
            </select>

            <button
              onClick={onOpenManageStudentsModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Students ({students.length})</span>
            </button>

            <button
              onClick={onOpenAddCategoryModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition"
            >
              <FolderPlus className="w-3.5 h-3.5 text-purple-600" />
              <span>+ Category</span>
            </button>

            <button
              onClick={onOpenAddWordModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>+ Add Word</span>
            </button>

            <button
              onClick={() => onOpenExportModal('iep-progress')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF Report</span>
            </button>

            <button
              onClick={() => onOpenExportModal('iep-progress')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Sheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-teal-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Overall Accuracy
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800">
            {summary.overallAccuracy}%
          </p>
          <span className="text-[11px] text-teal-700 font-medium">
            Based on {summary.totalPractices} practice sessions
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Mastered Words
            </span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800">
            {summary.masteredWordsCount}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">
            Recognized ARASAAC symbols
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Practice Time
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800">
            {summary.totalTimeMinutes} <span className="text-sm font-semibold">min</span>
          </p>
          <span className="text-[11px] text-purple-700 font-medium">
            Active engagement time
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-sky-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Curriculum Scope
            </span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800">
            {vocabularyList.length} <span className="text-sm font-semibold">words</span>
          </p>
          <span className="text-[11px] text-sky-700 font-medium">
            Across {categories.length} categories
          </span>
        </div>
      </div>

      {/* Semantic Categories Mastery Section (Default + Custom Categories) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Category Mastery & Progress
            </h3>
            <p className="text-xs text-slate-500">
              Includes default semantic topics and your custom classroom categories
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddCategoryModal}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 transition"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Custom Category</span>
            </button>
            <button
              onClick={onOpenAddWordModal}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Import ARASAAC Word</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const stat = summary.categoryStats[cat.id] || {
              attempted: 0,
              correct: 0,
              accuracy: 0,
              masteredCount: 0,
              totalCategoryWords: 0,
            };
            const accuracy = stat.attempted > 0 ? stat.accuracy : 0;

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl border transition ${cat.pastelBg} ${cat.pastelBorder}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${cat.pastelText} flex items-center gap-1`}>
                    <span>{cat.emoji || '🏷️'}</span>
                    <span>{cat.name}</span>
                    {cat.custom && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-semibold">
                        Custom
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {accuracy}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/80 h-2.5 rounded-full overflow-hidden border border-slate-200/60 mb-2">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>{stat.masteredCount} Mastered</span>
                  <span>
                    {stat.attempted} attempts / {stat.totalCategoryWords} words
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mastered vs Struggle Words */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800">
                Mastered Vocabulary ({masteredItems.length})
              </h3>
            </div>
            <button
              onClick={() => onOpenExportModal('visual-board')}
              className="text-xs text-teal-700 hover:underline font-bold"
            >
              Print Flashcard Board
            </button>
          </div>

          {masteredItems.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              No words marked as mastered yet. Complete practice sessions to build mastery!
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1">
              {masteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center"
                >
                  <img
                    src={getArasaacImageUrl(item.arasaacId)}
                    alt={item.word}
                    className="w-12 h-12 object-contain mb-1"
                  />
                  <span className="text-[11px] font-bold text-slate-800 truncate w-full">
                    {item.word}
                  </span>
                  <span className="text-[9px] uppercase text-slate-400">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Needs Reinforcement ({struggleItems.length})
            </h3>
          </div>

          {struggleItems.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <Sparkles className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <span>Great progress! No struggle words currently flagged.</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1">
              {struggleItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center p-2 rounded-xl bg-amber-50/40 border border-amber-200 text-center"
                >
                  <img
                    src={getArasaacImageUrl(item.arasaacId)}
                    alt={item.word}
                    className="w-12 h-12 object-contain mb-1"
                  />
                  <span className="text-[11px] font-bold text-amber-900 truncate w-full">
                    {item.word}
                  </span>
                  <span className="text-[9px] text-amber-600 font-semibold">
                    Target in IEP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Educator Pedagogical Notes */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Educator Observations & IEP Notes
            </h3>
          </div>

          {!isEditingNotes ? (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              Edit Notes
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Record notes on student responses, visual preferences, sensory accommodations, and target IEP goals..."
          />
        ) : (
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
            "{activeStudent.notes || 'No educator notes recorded yet. Tap Edit Notes to add observations.'}"
          </div>
        )}
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Recent Practice Sessions ({studentSessions.length})
            </h3>
          </div>
          <button
            onClick={() => onOpenExportModal('session-log')}
            className="text-xs text-teal-700 hover:underline font-bold"
          >
            Full Printable Log
          </button>
        </div>

        {studentSessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No quiz sessions completed yet for this student.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                  <th className="pb-2">Date & Time</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Accuracy</th>
                  <th className="pb-2">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentSessions.slice(0, 8).map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-medium">
                      {new Date(sess.date).toLocaleDateString()} {new Date(sess.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 capitalize font-semibold text-slate-800">
                      {sess.category}
                    </td>
                    <td className="py-2.5">
                      {sess.correctAnswers} / {sess.totalQuestions}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sess.accuracy >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : sess.accuracy >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sess.accuracy}%
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">
                      {sess.durationSeconds || 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
