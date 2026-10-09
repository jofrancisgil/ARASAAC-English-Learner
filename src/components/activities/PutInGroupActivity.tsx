import React, { useState, useEffect } from 'react';
import { VocabularyItem, StudentProfile, QuizSession, SemanticCategory, SemanticCategoryId } from '../../types';
import { getCategoryById } from '../../data/categories';
import { getArasaacImageUrl } from '../../data/initialVocabulary';
import { speakText } from '../../utils/speech';
import { ActivityTopicSelector } from './ActivityTopicSelector';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, ArrowRight, Award, Sparkles, Volume2 } from 'lucide-react';

interface PutInGroupProps {
  vocabularyList: VocabularyItem[];
  categories: SemanticCategory[];
  activeStudent: StudentProfile | null;
  selectedCategory?: SemanticCategoryId | 'all';
  onCategoryChange?: (cat: SemanticCategoryId | 'all') => void;
  onComplete: (session: QuizSession) => void;
  onExit: () => void;
}

interface GroupQuestion {
  targetItem: VocabularyItem;
  correctCategory: SemanticCategory;
  categoryChoices: SemanticCategory[];
}

export const PutInGroupActivity: React.FC<PutInGroupProps> = ({
  vocabularyList,
  categories,
  activeStudent,
  selectedCategory = 'all',
  onCategoryChange,
  onComplete,
  onExit,
}) => {
  const [currentTopic, setCurrentTopic] = useState<SemanticCategoryId | 'all'>(selectedCategory);
  const [questions, setQuestions] = useState<GroupQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const generateQuestions = (topic: SemanticCategoryId | 'all') => {
    if (categories.length < 2 || vocabularyList.length < 3) return;

    const pool =
      topic === 'all'
        ? vocabularyList
        : vocabularyList.filter((v) => v.category === topic);
    const safePool = pool.length >= 3 ? pool : vocabularyList;

    const shuffledItems = [...safePool].sort(() => 0.5 - Math.random()).slice(0, 5);

    const generated: GroupQuestion[] = shuffledItems.map((target) => {
      const correctCat = getCategoryById(target.category, categories);
      const otherCats = categories
        .filter((c) => c.id !== target.category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const categoryChoices = [correctCat, ...otherCats].sort(() => 0.5 - Math.random());
      return {
        targetItem: target,
        correctCategory: correctCat,
        categoryChoices,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedCatId(null);
    setIsChecked(false);
    setScore(0);
    setIsFinished(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    generateQuestions(currentTopic);
  }, [currentTopic, vocabularyList, categories]);

  const handleTopicChange = (newTopic: SemanticCategoryId | 'all') => {
    setCurrentTopic(newTopic);
    if (onCategoryChange) {
      onCategoryChange(newTopic);
    }
  };

  const currentQ = questions[currentIndex];

  if (!currentQ && !isFinished) {
    return <div className="p-8 text-center text-slate-400">Loading activity...</div>;
  }

  const handleSelect = (chosenCat: SemanticCategory) => {
    if (isChecked) return;
    setSelectedCatId(chosenCat.id);
    setIsChecked(true);

    const isCorrect = chosenCat.id === currentQ.correctCategory.id;
    if (isCorrect) {
      setScore((s) => s + 1);
      speakText(`Yes! ${currentQ.targetItem.word} belongs to ${chosenCat.name}.`, {
        rate: activeStudent?.speechRate || 0.85,
      });
    } else {
      speakText(`${currentQ.targetItem.word} belongs to ${currentQ.correctCategory.name}.`, {
        rate: activeStudent?.speechRate || 0.85,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setSelectedCatId(null);
      setIsChecked(false);
    } else {
      setIsFinished(true);
      const accuracy = Math.round((score / questions.length) * 100);
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      const session: QuizSession = {
        id: `sess-${Date.now()}`,
        date: new Date().toISOString(),
        studentId: activeStudent?.id || 'guest',
        category: currentTopic,
        totalQuestions: questions.length,
        correctAnswers: score,
        accuracy,
        durationSeconds,
        attempts: [],
      };
      onComplete(session);

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-emerald-200 shadow-sm text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 font-fredoka mb-1">
          Sorting Superstar!
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          You classified the pictograms into their semantic groups!
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Score</span>
            <p className="text-2xl font-black text-emerald-900">{score} / {questions.length}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Accuracy</span>
            <p className="text-2xl font-black text-amber-900">{accuracy}%</p>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => generateQuestions(currentTopic)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
          >
            Activities Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-sm">
      {/* Header with Topic Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              🗂️😊 Put It in the Group
            </span>
            <span className="text-[11px] text-slate-400">
              Round {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Topic Selector */}
          <ActivityTopicSelector
            categories={categories}
            selectedCategory={currentTopic}
            onSelectCategory={handleTopicChange}
          />
          <button onClick={onExit} className="text-xs font-bold text-slate-400 hover:text-slate-600">
            Exit
          </button>
        </div>
      </div>

      {/* Pictogram Prompt */}
      <div className="flex flex-col items-center text-center my-4">
        <span className="text-xs text-slate-500 font-medium mb-3">
          Which group does this pictogram belong to?
        </span>

        <div className="w-40 h-40 rounded-3xl bg-slate-50 p-4 border-4 border-emerald-200 shadow-xs flex items-center justify-center">
          <img
            src={getArasaacImageUrl(currentQ.targetItem.arasaacId)}
            alt={currentQ.targetItem.word}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-black text-slate-800 font-fredoka">
            {currentQ.targetItem.word}
          </span>
          <button
            onClick={() => speakText(currentQ.targetItem.word, { rate: activeStudent?.speechRate || 0.85 })}
            className="p-1 text-slate-400 hover:text-emerald-700"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
        {currentQ.categoryChoices.map((cat) => {
          const isSelected = selectedCatId === cat.id;
          const isCorrect = cat.id === currentQ.correctCategory.id;

          let btnClass = `${cat.pastelBg} ${cat.pastelBorder} border-2 hover:shadow-md text-slate-800`;
          if (isChecked) {
            if (isCorrect) {
              btnClass = 'bg-emerald-100 border-3 border-emerald-500 ring-2 ring-emerald-300 text-emerald-950 font-black';
            } else if (isSelected) {
              btnClass = 'bg-rose-50 border-2 border-rose-300 text-rose-800 opacity-60';
            } else {
              btnClass = 'bg-slate-50 border border-slate-200 opacity-40';
            }
          }

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              disabled={isChecked}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${btnClass}`}
            >
              <span className="text-2xl">{cat.emoji || '🏷️'}</span>
              <span className="text-sm font-bold block">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Action / Next */}
      {isChecked && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            {selectedCatId === currentQ.correctCategory.id ? (
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Correct! {currentQ.targetItem.word} belongs to {currentQ.correctCategory.name}!
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-700">
                {currentQ.targetItem.word} belongs to <strong>{currentQ.correctCategory.name}</strong>.
              </span>
            )}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next' : 'Finish'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
