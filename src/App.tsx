/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  StudentProfile,
  QuizSession,
  VocabularyItem,
  SemanticCategoryId,
  SemanticCategory,
  ReportTemplateType,
} from './types';
import { getCategoryById } from './data/categories';
import {
  loadStudents,
  saveStudents,
  deleteStudent,
  loadActiveStudentId,
  saveActiveStudentId,
  loadSessions,
  saveSessions,
  recordQuizSession,
  getAllCategories,
  addCustomCategory,
  getAllVocabulary,
  addCustomVocabularyItem,
  loadAppSettings,
  saveAppSettings,
  calculateStudentProgress,
  AppSettings,
} from './utils/storage';
import { speakText } from './utils/speech';

import { Header, AppNavMode } from './components/Header';
import { StudentBoardView } from './components/StudentBoardView';
import { FlashcardModal } from './components/FlashcardModal';
import { EducatorDashboard } from './components/EducatorDashboard';
import { ExportModal } from './components/ExportModal';
import { ArasaacSearchModal } from './components/ArasaacSearchModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { AddWordModal } from './components/AddWordModal';
import { ManageStudentsModal } from './components/ManageStudentsModal';
import { SettingsModal } from './components/SettingsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ArasaacAttribution } from './components/ArasaacAttribution';

// 6 Interactive Activities
import { ActivitiesHub, ActivityType } from './components/activities/ActivitiesHub';
import { ListenChooseActivity } from './components/activities/ListenChooseActivity';
import { PictogramMemoryActivity } from './components/activities/PictogramMemoryActivity';
import { PictureWordActivity } from './components/activities/PictureWordActivity';
import { OddOneOutActivity } from './components/activities/OddOneOutActivity';
import { PutInGroupActivity } from './components/activities/PutInGroupActivity';

import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export default function App() {
  // Persistent state
  const [students, setStudents] = useState<StudentProfile[]>(() => loadStudents());
  const [activeStudentId, setActiveStudentId] = useState<string>(() => loadActiveStudentId());
  const [categories, setCategories] = useState<SemanticCategory[]>(() => getAllCategories());
  const [sessions, setSessions] = useState<QuizSession[]>(() => loadSessions());
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(() => getAllVocabulary());
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  // Navigation & mode state
  const [currentMode, setCurrentMode] = useState<AppNavMode>('board');
  const [activeActivity, setActiveActivity] = useState<ActivityType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SemanticCategoryId | 'all'>('school');
  const [sentenceItems, setSentenceItems] = useState<VocabularyItem[]>([]);
  const [activeFlashcard, setActiveFlashcard] = useState<VocabularyItem | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportInitialTemplate, setExportInitialTemplate] = useState<ReportTemplateType>('iep-progress');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isManageStudentsModalOpen, setIsManageStudentsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Active student computation
  const activeStudent = useMemo(() => {
    if (students.length === 0) return null;
    return students.find((s) => s.id === activeStudentId) || students[0];
  }, [students, activeStudentId]);

  // Student progress summary
  const studentProgress = useMemo(() => {
    if (!activeStudent) {
      return {
        totalPractices: 0,
        totalTimeMinutes: 0,
        overallAccuracy: 0,
        masteredWordsCount: 0,
        categoryStats: {},
        masteredWordIds: [],
        strugglingWordIds: [],
      };
    }
    return calculateStudentProgress(activeStudent.id, sessions, vocabularyList, categories);
  }, [activeStudent, sessions, vocabularyList, categories]);

  // Filtered vocabulary for flashcards
  const categoryVocabulary = useMemo(() => {
    return selectedCategory === 'all'
      ? vocabularyList
      : vocabularyList.filter((v) => v.category === selectedCategory);
  }, [vocabularyList, selectedCategory]);

  // Student management handlers
  const handleSelectStudent = (student: StudentProfile) => {
    setActiveStudentId(student.id);
    saveActiveStudentId(student.id);
  };

  const handleUpdateStudent = (updated: StudentProfile) => {
    const updatedList = students.map((s) => (s.id === updated.id ? updated : s));
    setStudents(updatedList);
    saveStudents(updatedList);
  };

  const handleAddStudent = (newStudent: StudentProfile) => {
    const updatedList = [newStudent, ...students];
    setStudents(updatedList);
    saveStudents(updatedList);
    setActiveStudentId(newStudent.id);
    saveActiveStudentId(newStudent.id);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updated = deleteStudent(studentId);
    setStudents(updated);
    if (activeStudentId === studentId) {
      const nextId = updated[0]?.id || '';
      setActiveStudentId(nextId);
      saveActiveStudentId(nextId);
    }
  };

  // Custom categories and words handlers
  const handleAddCategory = (newCat: SemanticCategory) => {
    addCustomCategory(newCat);
    setCategories(getAllCategories());
    setSelectedCategory(newCat.id);
  };

  const handleAddWord = (newWord: VocabularyItem) => {
    addCustomVocabularyItem(newWord);
    setVocabularyList(getAllVocabulary());
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
  };

  const handleAddToSentence = (item: VocabularyItem) => {
    setSentenceItems((prev) => [...prev, item]);
  };

  const handleRemoveSentenceItem = (index: number) => {
    setSentenceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearSentence = () => {
    setSentenceItems([]);
  };

  const handleAddStarter = (starterText: string, arasaacId: number = 5441) => {
    const starterItem: VocabularyItem = {
      id: `starter-${Date.now()}`,
      arasaacId,
      word: starterText,
      category: 'actions',
    };
    setSentenceItems((prev) => [...prev, starterItem]);
    speakText(starterText, { rate: activeStudent?.speechRate || 0.85 });
  };

  const handleCompleteSession = (newSession: QuizSession) => {
    recordQuizSession(newSession);
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleOpenExportWithTemplate = (template: ReportTemplateType = 'iep-progress') => {
    setExportInitialTemplate(template);
    setIsExportModalOpen(true);
  };

  const handleDataReload = () => {
    setStudents(loadStudents());
    setSessions(loadSessions());
    setCategories(getAllCategories());
    setVocabularyList(getAllVocabulary());
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${settings.sensoryCalmMode ? 'contrast-95' : ''}`}>
      {/* App Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          if (mode === 'activities') {
            setActiveActivity(null);
          }
        }}
        activeStudent={activeStudent}
        students={students}
        onSelectStudent={handleSelectStudent}
        onOpenManageStudentsModal={() => setIsManageStudentsModalOpen(true)}
        onOpenExportModal={() => handleOpenExportWithTemplate('iep-progress')}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5">
        {/* MODE 1: STUDENT PICTOGRAM BOARD */}
        {currentMode === 'board' && (
          <StudentBoardView
            vocabularyList={vocabularyList}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sentenceItems={sentenceItems}
            onAddToSentence={handleAddToSentence}
            onRemoveSentenceItem={handleRemoveSentenceItem}
            onClearSentence={handleClearSentence}
            onAddStarter={handleAddStarter}
            onOpenAddCategoryModal={() => setIsAddCategoryModalOpen(true)}
            onOpenAddWordModal={() => setIsAddWordModalOpen(true)}
            speechRate={activeStudent?.speechRate || 0.85}
          />
        )}

        {/* MODE 2: ACTIVITIES & GAMES (6 Specific Activities) */}
        {currentMode === 'activities' && (
          <div>
            {!activeActivity && (
              <ActivitiesHub
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onLaunchActivity={(act) => {
                  setActiveActivity(act);
                  if (act === 'flashcards') {
                    setFlashcardIndex(0);
                  }
                }}
              />
            )}

            {/* Activity 1: Listen & choose */}
            {activeActivity === 'listen-choose' && (
              <ListenChooseActivity
                vocabularyList={vocabularyList}
                categories={categories}
                activeStudent={activeStudent}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onComplete={handleCompleteSession}
                onExit={() => setActiveActivity(null)}
              />
            )}

            {/* Activity 2: Pictogram Memory */}
            {activeActivity === 'memory' && (
              <PictogramMemoryActivity
                vocabularyList={vocabularyList}
                categories={categories}
                activeStudent={activeStudent}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onComplete={handleCompleteSession}
                onExit={() => setActiveActivity(null)}
              />
            )}

            {/* Activity 3: Picture → word */}
            {activeActivity === 'picture-word' && (
              <PictureWordActivity
                vocabularyList={vocabularyList}
                categories={categories}
                activeStudent={activeStudent}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onComplete={handleCompleteSession}
                onExit={() => setActiveActivity(null)}
              />
            )}

            {/* Activity 4: Which one doesn't belong? */}
            {activeActivity === 'odd-one-out' && (
              <OddOneOutActivity
                vocabularyList={vocabularyList}
                categories={categories}
                activeStudent={activeStudent}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onComplete={handleCompleteSession}
                onExit={() => setActiveActivity(null)}
              />
            )}

            {/* Activity 5: Put it in the group */}
            {activeActivity === 'put-in-group' && (
              <PutInGroupActivity
                vocabularyList={vocabularyList}
                categories={categories}
                activeStudent={activeStudent}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onComplete={handleCompleteSession}
                onExit={() => setActiveActivity(null)}
              />
            )}

            {/* Activity 6: Flashcards */}
            {activeActivity === 'flashcards' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Back button & Category selection */}
                <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setActiveActivity(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Activities Menu</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Topic:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value as SemanticCategoryId | 'all');
                        setFlashcardIndex(0);
                      }}
                      className="text-xs font-bold bg-slate-50 p-2 rounded-xl border border-slate-200"
                    >
                      <option value="all">All Topics ({vocabularyList.length})</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji || '🏷️'} {c.name} {c.custom ? '(Custom)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {categoryVocabulary.length > 0 ? (
                  (() => {
                    const card = categoryVocabulary[flashcardIndex] || categoryVocabulary[0];
                    const cat = getCategoryById(card.category, categories);

                    return (
                      <div
                        className="bg-white rounded-3xl shadow-sm border-3 overflow-hidden text-center"
                        style={{ borderColor: cat.aacColorCode || '#E2E8F0' }}
                      >
                        <div className={`p-4 border-b flex items-center justify-between ${cat.pastelBg} ${cat.pastelBorder}`}>
                          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${cat.badgeBg}`}>
                            {cat.emoji} {cat.name}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {flashcardIndex + 1} of {categoryVocabulary.length}
                          </span>
                        </div>

                        <div className="p-8 flex flex-col items-center">
                          <div
                            className="w-56 h-56 rounded-3xl bg-slate-50/70 p-4 border-4 shadow-sm flex items-center justify-center mb-5"
                            style={{ borderColor: cat.aacColorCode || '#CBD5E1' }}
                          >
                            <img
                              src={`https://static.arasaac.org/pictograms/${card.arasaacId}/${card.arasaacId}_500.png`}
                              alt={card.word}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <h2 className="text-4xl font-black text-slate-800 font-fredoka mb-2">
                            {card.word}
                          </h2>

                          {card.syllables && (
                            <span className="text-sm font-bold text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200 mb-5">
                              {card.syllables}
                            </span>
                          )}

                          <div className="flex items-center gap-3 mb-6">
                            <button
                              onClick={() => speakText(card.word, { rate: activeStudent?.speechRate || 0.85 })}
                              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-xs transition active:scale-95"
                            >
                              <Volume2 className="w-5 h-5" />
                              <span>Listen</span>
                            </button>

                            <button
                              onClick={() => speakText(card.word, { rate: 0.6 })}
                              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-sm transition active:scale-95"
                            >
                              <span>Slow Audio</span>
                            </button>
                          </div>

                          {card.exampleSentence && (
                            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Example Sentence:
                              </span>
                              <p className="text-sm font-semibold text-slate-800">
                                "{card.exampleSentence}"
                              </p>
                              <button
                                onClick={() =>
                                  speakText(card.exampleSentence!, {
                                    rate: activeStudent?.speechRate || 0.85,
                                  })
                                }
                                className="mt-2 text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Hear sentence</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
                          <button
                            onClick={() => setFlashcardIndex((p) => Math.max(0, p - 1))}
                            disabled={flashcardIndex === 0}
                            className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-xs disabled:opacity-40"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>

                          <button
                            onClick={() => handleAddToSentence(card)}
                            className="text-xs font-bold text-teal-700 hover:underline"
                          >
                            + Add to Sentence Strip
                          </button>

                          <button
                            onClick={() =>
                              setFlashcardIndex((p) => Math.min(categoryVocabulary.length - 1, p + 1))
                            }
                            disabled={flashcardIndex >= categoryVocabulary.length - 1}
                            className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs disabled:opacity-40"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* MODE 3: EDUCATOR DASHBOARD & TRACKING */}
        {currentMode === 'dashboard' && (
          <EducatorDashboard
            students={students}
            activeStudent={activeStudent}
            categories={categories}
            onSelectStudent={handleSelectStudent}
            onUpdateStudent={handleUpdateStudent}
            onOpenManageStudentsModal={() => setIsManageStudentsModalOpen(true)}
            onOpenAddCategoryModal={() => setIsAddCategoryModalOpen(true)}
            onOpenAddWordModal={() => setIsAddWordModalOpen(true)}
            summary={studentProgress}
            sessions={sessions}
            vocabularyList={vocabularyList}
            onOpenExportModal={handleOpenExportWithTemplate}
          />
        )}

        {/* Prominent ARASAAC Creative Commons Attribution */}
        <ArasaacAttribution />
      </main>

      {/* Offline Toast */}
      <OfflineIndicator />

      {/* Footer License */}
      <ArasaacAttribution compact />

      {/* MODAL: Full Flashcard Details */}
      {activeFlashcard && (
        <FlashcardModal
          item={activeFlashcard}
          itemsList={categoryVocabulary}
          onClose={() => setActiveFlashcard(null)}
          onSelectNext={(next) => setActiveFlashcard(next)}
          onSelectPrev={(prev) => setActiveFlashcard(prev)}
          speechRate={activeStudent?.speechRate || 0.85}
        />
      )}

      {/* MODAL: Export & Reports (Printable PDF & Google Sheets) */}
      {isExportModalOpen && activeStudent && (
        <ExportModal
          student={activeStudent}
          summary={studentProgress}
          sessions={sessions}
          vocabularyList={vocabularyList}
          initialTemplate={exportInitialTemplate}
          onClose={() => setIsExportModalOpen(false)}
          onDataReload={handleDataReload}
        />
      )}

      {/* MODAL: Live ARASAAC API Search */}
      {isSearchModalOpen && (
        <ArasaacSearchModal
          onAddVocabulary={handleAddWord}
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}

      {/* MODAL: Manage Students */}
      {isManageStudentsModalOpen && (
        <ManageStudentsModal
          students={students}
          activeStudentId={activeStudentId}
          onSelectStudent={handleSelectStudent}
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
          onUpdateStudent={handleUpdateStudent}
          onClose={() => setIsManageStudentsModalOpen(false)}
        />
      )}

      {/* MODAL: Add Custom Category */}
      {isAddCategoryModalOpen && (
        <AddCategoryModal
          onAddCategory={handleAddCategory}
          onClose={() => setIsAddCategoryModalOpen(false)}
        />
      )}

      {/* MODAL: Add Word & Import ARASAAC Pictogram */}
      {isAddWordModalOpen && (
        <AddWordModal
          categories={categories}
          defaultCategory={selectedCategory !== 'all' ? selectedCategory : undefined}
          onAddWord={handleAddWord}
          onClose={() => setIsAddWordModalOpen(false)}
        />
      )}

      {/* MODAL: Settings & Audio Controls */}
      {isSettingsModalOpen && activeStudent && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          activeStudent={activeStudent}
          onUpdateStudent={handleUpdateStudent}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
}
