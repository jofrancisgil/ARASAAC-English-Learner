import React, { useState, useEffect } from 'react';
import { VocabularyItem, StudentProfile, QuizSession, QuizAttempt, SemanticCategory, SemanticCategoryId } from '../../types';
import { getCategoryById } from '../../data/categories';
import { getArasaacImageUrl } from '../../data/initialVocabulary';
import { speakText } from '../../utils/speech';
import { ActivityTopicSelector } from './ActivityTopicSelector';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, ArrowRight, Award, Sparkles } from 'lucide-react';

interface OddOneOutProps {
  vocabularyList: VocabularyItem[];
  categories: SemanticCategory[];
  activeStudent: StudentProfile | null;
  selectedCategory?: SemanticCategoryId | 'all';
  onCategoryChange?: (cat: SemanticCategoryId | 'all') => void;
  onComplete: (session: QuizSession) => void;
  onExit: () => void;
}

interface OddOneQuestion {
  mainCategory: SemanticCategory;
  oddItem: VocabularyItem;
  sameItems: VocabularyItem[];
  allChoices: VocabularyItem[];
}

export const OddOneOutActivity: React.FC<OddOneOutProps> = ({
  vocabularyList,
  categories,
  activeStudent,
  selectedCategory = 'all',
  onCategoryChange,
  onComplete,
  onExit,
}) => {
  const [currentTopic, setCurrentTopic] = useState<SemanticCategoryId | 'all'>(selectedCategory);
  const [questions, setQuestions] = useState<OddOneQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const generateQuestions = (topic: SemanticCategoryId | 'all') => {
    const validCats = categories.filter(
      (c) => vocabularyList.filter((v) => v.category === c.id).length >= 2
    );
    if (validCats.length < 2) return;

    const generated: OddOneQuestion[] = [];

    for (let i = 0; i < 5; i++) {
      let mainCat: SemanticCategory;
      let otherCat: SemanticCategory;

      if (topic !== 'all') {
        const foundMain = categories.find((c) => c.id === topic);
        const hasEnoughItems =
          foundMain && vocabularyList.filter((v) => v.category === foundMain.id).length >= 2;
        mainCat = hasEnoughItems ? foundMain : validCats[0];

        const otherPool = categories.filter((c) => c.id !== mainCat.id);
        otherCat = otherPool[Math.floor(Math.random() * otherPool.length)] || validCats[1];
      } else {
        const shuffledCats = [...validCats].sort(() => 0.5 - Math.random());
        mainCat = shuffledCats[0];
        otherCat = shuffledCats[1];
      }

      const mainItems = vocabularyList
        .filter((v) => v.category === mainCat.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const otherItems = vocabularyList.filter((v) => v.category === otherCat.id);
      const oddItem = otherItems.length > 0 ? otherItems[Math.floor(Math.random() * otherItems.length)] : null;

      if (mainItems.length === 2 && oddItem) {
        const allChoices = [...mainItems, oddItem].sort(() => 0.5 - Math.random());
        generated.push({
          mainCategory: mainCat,
          oddItem,
          sameItems: mainItems,
          allChoices,
        });
      }
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedId(null);
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

  const handleSelect = (item: VocabularyItem) => {
    if (isChecked) return;
    setSelectedId(item.id);
    setIsChecked(true);

    const isCorrect = item.id === currentQ.oddItem.id;
    if (isCorrect) {
      setScore((s) => s + 1);
      const oddCat = getCategoryById(currentQ.oddItem.category, categories);
      speakText(`Correct! ${item.word} is ${oddCat.name}, but the others are ${currentQ.mainCategory.name}.`, {
        rate: activeStudent?.speechRate || 0.85,
      });
    } else {
      speakText(`${item.word} belongs to ${currentQ.mainCategory.name}.`, {
        rate: activeStudent?.speechRate || 0.85,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setSelectedId(null);
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
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-sm text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 font-fredoka mb-1">
          Activity Completed!
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          You identified the different topics!
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Score</span>
            <p className="text-2xl font-black text-amber-900">{score} / {questions.length}</p>
          </div>
          <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100">
            <span className="text-[10px] font-bold text-teal-700 uppercase">Accuracy</span>
            <p className="text-2xl font-black text-teal-900">{accuracy}%</p>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => generateQuestions(currentTopic)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
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

  const oddCat = getCategoryById(currentQ.oddItem.category, categories);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-100 shadow-sm">
      {/* Header with Topic Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              🔎🧩 Which One Doesn't Belong?
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

      <div className="text-center my-4">
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Find the pictogram that comes from a <strong>different topic</strong>:
        </p>
      </div>

      {/* 3 Choices Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 my-6">
        {currentQ.allChoices.map((item) => {
          const isSelected = selectedId === item.id;
          const isTheOddOne = item.id === currentQ.oddItem.id;
          const itemCat = getCategoryById(item.category, categories);

          let btnClass = 'bg-white border-3 border-slate-200 hover:border-amber-400 hover:bg-amber-50/30';
          if (isChecked) {
            if (isTheOddOne) {
              btnClass = 'bg-emerald-50 border-4 border-emerald-500 ring-2 ring-emerald-300';
            } else if (isSelected) {
              btnClass = 'bg-rose-50 border-3 border-rose-300 opacity-60';
            } else {
              btnClass = 'bg-slate-50 border border-slate-200 opacity-40';
            }
          }

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              disabled={isChecked}
              className={`flex flex-col items-center justify-between p-4 rounded-3xl transition-all aspect-square active:scale-95 ${btnClass}`}
            >
              <div className="w-24 h-24 my-auto flex items-center justify-center">
                <img
                  src={getArasaacImageUrl(item.arasaacId)}
                  alt={item.word}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center w-full mt-1">
                <span className="text-xs sm:text-sm font-bold text-slate-800 block truncate">
                  {item.word}
                </span>
                {isChecked && (
                  <span className={`text-[10px] font-semibold block uppercase ${itemCat.pastelText}`}>
                    {itemCat.name}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation & Next */}
      {isChecked && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 gap-3 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-950 block">
              {selectedId === currentQ.oddItem.id ? '⭐ Brilliant thinking!' : '💡 Look closely:'}
            </span>
            <p className="text-xs text-amber-800 mt-0.5">
              <strong>{currentQ.oddItem.word}</strong> is <strong>{oddCat.name}</strong>, while the other two belong to <strong>{currentQ.mainCategory.name}</strong>!
            </p>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Round' : 'Finish'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
