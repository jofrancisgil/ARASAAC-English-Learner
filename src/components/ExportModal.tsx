import React, { useState } from 'react';
import {
  StudentProfile,
  ProgressSummary,
  QuizSession,
  VocabularyItem,
  ReportTemplateType,
  ReportConfig,
} from '../types';
import { SEMANTIC_CATEGORIES } from '../data/categories';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import {
  generateGoogleSheetsCSV,
  generateGoogleSheetsTSV,
  downloadCSVFile,
  triggerPrintToPDF,
} from '../utils/exportHelpers';
import {
  exportAllDataJSON,
  importAllDataJSON,
} from '../utils/storage';
import {
  Printer,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  FileText,
  Grid,
  ListOrdered,
  Settings2,
  Sparkles,
  School,
  Database,
  Upload,
} from 'lucide-react';

interface ExportModalProps {
  student: StudentProfile;
  summary: ProgressSummary;
  sessions: QuizSession[];
  vocabularyList: VocabularyItem[];
  initialTemplate?: ReportTemplateType;
  onClose: () => void;
  onDataReload?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  student,
  summary,
  sessions,
  vocabularyList,
  initialTemplate = 'iep-progress',
  onClose,
  onDataReload,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'sheets' | 'backup'>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplateType>(initialTemplate);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [backupCopied, setBackupCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Report configuration
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    template: initialTemplate,
    schoolName: 'Lincoln Inclusive Learning Academy',
    educatorName: 'Sarah Jenkins, M.Ed. (SEN Specialist)',
    reportPeriod: 'Autumn Term 2026',
    includeThumbnails: true,
    includeNotes: true,
    includeSignatures: true,
    paperSize: 'a4',
    colorMode: 'pastel',
    customNotes: student.notes || '',
  });

  const studentSessions = sessions.filter((s) => s.studentId === student.id);
  const masteredItems = vocabularyList.filter((v) =>
    summary.masteredWordIds.includes(v.id)
  );
  const struggleItems = vocabularyList.filter((v) =>
    summary.strugglingWordIds.includes(v.id)
  );

  const handleDownloadCSV = () => {
    const csvData = generateGoogleSheetsCSV(student, summary, sessions, vocabularyList);
    const filename = `${student.name.replace(/\s+/g, '_')}_Progress_GoogleSheets.csv`;
    downloadCSVFile(csvData, filename);
  };

  const handleCopyTSV = async () => {
    const tsvData = generateGoogleSheetsTSV(student, summary, sessions, vocabularyList);
    try {
      await navigator.clipboard.writeText(tsvData);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handleDownloadBackup = () => {
    const json = exportAllDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARASAAC_SEN_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importAllDataJSON(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        if (onDataReload) onDataReload();
      } else {
        setImportStatus('Failed to parse backup file. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 font-fredoka">
                Export & Reports Hub
              </h2>
              <p className="text-xs text-slate-500">
                Printable PDF templates & Google Sheets integration for{' '}
                <strong className="text-slate-700">{student.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-100 gap-4 bg-white">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'pdf'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Printable PDF Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'sheets'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Google Sheets Export</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'backup'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-purple-600" />
            <span>Offline Backup & Sync</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PRINTABLE PDF REPORTS */}
          {activeTab === 'pdf' && (
            <div className="space-y-6">
              {/* Template Selection Cards */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                  Select Custom Printable Template:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setSelectedTemplate('iep-progress');
                      setReportConfig((prev) => ({ ...prev, template: 'iep-progress' }));
                    }}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition ${
                      selectedTemplate === 'iep-progress'
                        ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-teal-700">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs font-bold text-slate-800">
                        IEP Progress Report
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Comprehensive report with category breakdown, mastered words, notes & signature lines.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTemplate('visual-board');
                      setReportConfig((prev) => ({ ...prev, template: 'visual-board' }));
                    }}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition ${
                      selectedTemplate === 'visual-board'
                        ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-amber-600">
                      <Grid className="w-4 h-4" />
                      <span className="text-xs font-bold text-slate-800">
                        Visual PECS Board
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Printable grid of ARASAAC pictograms with labels for student desks or binders.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTemplate('session-log');
                      setReportConfig((prev) => ({ ...prev, template: 'session-log' }));
                    }}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition ${
                      selectedTemplate === 'session-log'
                        ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-purple-600">
                      <ListOrdered className="w-4 h-4" />
                      <span className="text-xs font-bold text-slate-800">
                        Session History Log
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Detailed chronological log of all quiz and practice attempts with accuracy rates.
                    </p>
                  </button>
                </div>
              </div>

              {/* Template Customization Options */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Settings2 className="w-4 h-4 text-teal-600" />
                  <span>Report Template Customization:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      School / Center Name
                    </label>
                    <input
                      type="text"
                      value={reportConfig.schoolName}
                      onChange={(e) =>
                        setReportConfig((prev) => ({ ...prev, schoolName: e.target.value }))
                      }
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Educator Name & Role
                    </label>
                    <input
                      type="text"
                      value={reportConfig.educatorName}
                      onChange={(e) =>
                        setReportConfig((prev) => ({ ...prev, educatorName: e.target.value }))
                      }
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Reporting Period
                    </label>
                    <input
                      type="text"
                      value={reportConfig.reportPeriod}
                      onChange={(e) =>
                        setReportConfig((prev) => ({ ...prev, reportPeriod: e.target.value }))
                      }
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeThumbnails}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          includeThumbnails: e.target.checked,
                        }))
                      }
                      className="rounded text-teal-600 focus:ring-teal-400"
                    />
                    <span>Include ARASAAC Images</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeNotes}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          includeNotes: e.target.checked,
                        }))
                      }
                      className="rounded text-teal-600 focus:ring-teal-400"
                    />
                    <span>Include Educator Notes</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeSignatures}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          includeSignatures: e.target.checked,
                        }))
                      }
                      className="rounded text-teal-600 focus:ring-teal-400"
                    />
                    <span>Include Signature Lines</span>
                  </label>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[11px] text-slate-500">Color Palette:</span>
                    <button
                      onClick={() =>
                        setReportConfig((prev) => ({
                          ...prev,
                          colorMode: prev.colorMode === 'pastel' ? 'monochrome' : 'pastel',
                        }))
                      }
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700"
                    >
                      {reportConfig.colorMode === 'pastel' ? '🌸 Soft Pastel' : '🖨️ Eco Black & White'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Printable Document Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Printable Document Preview:
                  </span>
                  <button
                    onClick={triggerPrintToPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save to PDF</span>
                  </button>
                </div>

                <div
                  id="printable-report-area"
                  className={`bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-sm ${
                    reportConfig.colorMode === 'monochrome' ? 'filter grayscale contrast-125' : ''
                  }`}
                >
                  {/* Report Header */}
                  <div className="flex items-start justify-between pb-4 border-b-2 border-slate-800 mb-6">
                    <div>
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-widest block">
                        {reportConfig.schoolName}
                      </span>
                      <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
                        {selectedTemplate === 'iep-progress'
                          ? 'Individual Educational Progress Report (SNE / EFL)'
                          : selectedTemplate === 'visual-board'
                          ? 'ARASAAC Visual Communication Board'
                          : 'Student Practice & Assessment History'}
                      </h1>
                      <p className="text-xs text-slate-500 mt-1">
                        Student: <strong className="text-slate-800">{student.name}</strong> • Grade:{' '}
                        <strong className="text-slate-800">{student.gradeOrGroup}</strong> • Period:{' '}
                        <strong className="text-slate-800">{reportConfig.reportPeriod}</strong>
                      </p>
                    </div>

                    <div className="text-right text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">Educator / Evaluator:</p>
                      <p>{reportConfig.educatorName}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Date: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Template 1: IEP Progress Report Body */}
                  {selectedTemplate === 'iep-progress' && (
                    <div className="space-y-6">
                      {/* Summary Metrics */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-center">
                          <span className="text-[10px] font-bold text-teal-800 uppercase">
                            Overall Accuracy
                          </span>
                          <p className="text-xl font-black text-teal-900">
                            {summary.overallAccuracy}%
                          </p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                          <span className="text-[10px] font-bold text-amber-800 uppercase">
                            Mastered Words
                          </span>
                          <p className="text-xl font-black text-amber-900">
                            {summary.masteredWordsCount}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
                          <span className="text-[10px] font-bold text-purple-800 uppercase">
                            Sessions Completed
                          </span>
                          <p className="text-xl font-black text-purple-900">
                            {summary.totalPractices}
                          </p>
                        </div>
                        <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-center">
                          <span className="text-[10px] font-bold text-sky-800 uppercase">
                            Practice Time
                          </span>
                          <p className="text-xl font-black text-sky-900">
                            {summary.totalTimeMinutes} min
                          </p>
                        </div>
                      </div>

                      {/* Category Breakdown Table */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          1. Performance by Semantic Category
                        </h3>
                        <table className="w-full text-left text-xs border border-slate-200">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">Category</th>
                              <th className="p-2 border-b text-center">Vocabulary in Scope</th>
                              <th className="p-2 border-b text-center">Attempts</th>
                              <th className="p-2 border-b text-center">Mastered Words</th>
                              <th className="p-2 border-b text-right">Accuracy Rate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {SEMANTIC_CATEGORIES.map((cat) => {
                              const stat = summary.categoryStats[cat.id];
                              return (
                                <tr key={cat.id}>
                                  <td className="p-2 font-bold text-slate-800">{cat.name}</td>
                                  <td className="p-2 text-center text-slate-600">
                                    {stat.totalCategoryWords}
                                  </td>
                                  <td className="p-2 text-center text-slate-600">
                                    {stat.attempted}
                                  </td>
                                  <td className="p-2 text-center font-semibold text-teal-800">
                                    {stat.masteredCount}
                                  </td>
                                  <td className="p-2 text-right font-bold text-slate-800">
                                    {stat.accuracy}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mastered Vocabulary with Thumbnails */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          2. Mastered Vocabulary Items ({masteredItems.length})
                        </h3>
                        {masteredItems.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">
                            No vocabulary items marked as fully mastered yet.
                          </p>
                        ) : (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {masteredItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col items-center p-2 rounded-xl border border-slate-200 text-center bg-white"
                              >
                                {reportConfig.includeThumbnails && (
                                  <img
                                    src={getArasaacImageUrl(item.arasaacId)}
                                    alt={item.word}
                                    className="w-10 h-10 object-contain mb-1"
                                  />
                                )}
                                <span className="text-[11px] font-bold text-slate-800">
                                  {item.word}
                                </span>
                                <span className="text-[8px] uppercase text-slate-400">
                                  {item.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Struggle Words */}
                      {struggleItems.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                            3. Vocabulary Needing Targeted Reinforcement ({struggleItems.length})
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {struggleItems.map((item) => (
                              <span
                                key={item.id}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold"
                              >
                                {item.word} ({item.category})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Educator Notes */}
                      {reportConfig.includeNotes && (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                            Educator Observations & Recommendations
                          </h3>
                          <p className="text-xs text-slate-700 leading-relaxed italic">
                            "{reportConfig.customNotes || student.notes || 'Student is responding well to ARASAAC visual supports and speech rate adjustments.'}"
                          </p>
                        </div>
                      )}

                      {/* Signatures */}
                      {reportConfig.includeSignatures && (
                        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 mt-6">
                          <div>
                            <div className="border-b border-slate-400 h-8 mb-1" />
                            <p className="text-xs font-bold text-slate-700">
                              Educator / SEN Specialist Signature
                            </p>
                            <p className="text-[10px] text-slate-400">{reportConfig.educatorName}</p>
                          </div>
                          <div>
                            <div className="border-b border-slate-400 h-8 mb-1" />
                            <p className="text-xs font-bold text-slate-700">
                              Parent / Guardian Signature
                            </p>
                            <p className="text-[10px] text-slate-400">Date: _______________</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Template 2: Printable PECS Communication Board */}
                  {selectedTemplate === 'visual-board' && (
                    <div>
                      <p className="text-xs text-slate-500 mb-4">
                        Printable ARASAAC communication board. Cut out or laminate for student desk and home practice.
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {vocabularyList.slice(0, 24).map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col items-center justify-between p-2 rounded-xl border-2 border-slate-400 text-center bg-white aspect-square shadow-2xs"
                          >
                            <span className="text-[10px] uppercase font-bold text-slate-500">
                              {item.category}
                            </span>
                            <img
                              src={getArasaacImageUrl(item.arasaacId)}
                              alt={item.word}
                              className="w-14 h-14 object-contain my-1"
                            />
                            <span className="text-xs font-black text-slate-900">{item.word}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Template 3: Detailed Session Log */}
                  {selectedTemplate === 'session-log' && (
                    <div>
                      <table className="w-full text-left text-xs border border-slate-200">
                        <thead className="bg-slate-100 text-slate-700 font-bold">
                          <tr>
                            <th className="p-2 border-b">Session Date</th>
                            <th className="p-2 border-b">Category</th>
                            <th className="p-2 border-b text-center">Score</th>
                            <th className="p-2 border-b text-center">Accuracy</th>
                            <th className="p-2 border-b text-right">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {studentSessions.map((sess) => (
                            <tr key={sess.id}>
                              <td className="p-2">
                                {new Date(sess.date).toLocaleDateString()} {new Date(sess.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-2 capitalize font-semibold">{sess.category}</td>
                              <td className="p-2 text-center">
                                {sess.correctAnswers} / {sess.totalQuestions}
                              </td>
                              <td className="p-2 text-center font-bold">{sess.accuracy}%</td>
                              <td className="p-2 text-right text-slate-500">
                                {sess.durationSeconds}s
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ARASAAC Legal Attribution on Printed Reports */}
                  <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-500 text-center">
                    Pictograms created by <strong>Sergio Palao</strong> for <strong>ARASAAC</strong> (Government of Aragón), distributed under <strong>Creative Commons License BY-NC-SA 4.0</strong> (https://arasaac.org).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SHEETS EXPORT */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 sm:p-6">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-950 font-fredoka">
                      Export Directly to Google Sheets
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                      Export all student progress metrics, category accuracy, mastered vocabulary, and session logs into Google Sheets for multi-educator tracking, IEP meetings, and longitudinal analysis.
                    </p>
                  </div>
                </div>

                {/* 3 Step Workflow */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 text-left">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] inline-flex items-center justify-center mb-1.5">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">
                      Download CSV or Copy Table
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Get clean structured data formatted for spreadsheet columns.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 text-left">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] inline-flex items-center justify-center mb-1.5">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">
                      Open Google Sheets
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Click the Google Sheets button below to open a new spreadsheet.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 text-left">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] inline-flex items-center justify-center mb-1.5">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">
                      Paste or Import CSV
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Paste directly or click File &gt; Import &gt; Upload CSV.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV for Google Sheets</span>
                  </button>

                  <button
                    onClick={handleCopyTSV}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs transition active:scale-95"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Table for Google Sheets</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition ml-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open sheets.new in Browser</span>
                  </a>
                </div>
              </div>

              {/* Data Preview */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Sample Data Structure Included in Export:
                </span>
                <div className="font-mono text-[11px] text-slate-700 bg-white p-3 rounded-xl border border-slate-200 overflow-x-auto max-h-48">
                  <pre>{`Student Name: ${student.name}
Grade: ${student.gradeOrGroup}
Overall Accuracy: ${summary.overallAccuracy}%
Sessions: ${summary.totalPractices}
Mastered Words: ${summary.masteredWordsCount}
Category Breakdown:
- School: ${summary.categoryStats.school.accuracy}% (${summary.categoryStats.school.masteredCount} mastered)
- Family: ${summary.categoryStats.family.accuracy}% (${summary.categoryStats.family.masteredCount} mastered)
- Home: ${summary.categoryStats.home.accuracy}% (${summary.categoryStats.home.masteredCount} mastered)
- Weather: ${summary.categoryStats.weather.accuracy}% (${summary.categoryStats.weather.masteredCount} mastered)
- Moods: ${summary.categoryStats.moods.accuracy}% (${summary.categoryStats.moods.masteredCount} mastered)
- Actions: ${summary.categoryStats.actions.accuracy}% (${summary.categoryStats.actions.masteredCount} mastered)
- Food: ${summary.categoryStats.food.accuracy}% (${summary.categoryStats.food.masteredCount} mastered)`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OFFLINE BACKUP & SYNC */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-5 sm:p-6">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-purple-950 font-fredoka">
                      Offline Backup & Data Portability
                    </h3>
                    <p className="text-xs text-purple-800 leading-relaxed mt-0.5">
                      Because this app is designed for schools and areas without reliable internet, all data is stored safely in your browser. You can export a full offline backup or import it onto another school tablet.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadBackup}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Backup (.JSON)</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs cursor-pointer transition active:scale-95">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span>Restore from Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {importStatus && (
                  <div className="mt-3 text-xs font-bold text-purple-900 bg-white p-2.5 rounded-xl border border-purple-200">
                    {importStatus}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
