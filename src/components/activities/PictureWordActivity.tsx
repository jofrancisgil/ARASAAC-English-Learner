import React, { useState, useEffect } from 'react';
import { VocabularyItem, StudentProfile, QuizSession, QuizAttempt, SemanticCategory, SemanticCategoryId } from '../../types';
import { getArasaacImageUrl } from '../../data/initialVocabulary';
import { speakText } from '../../utils/speech';
import { ActivityTopicSelector } from './ActivityTopicSelector';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Award, Sparkles, Smile } from 'lucide-react';

interface PictureWordProps {
  vocabularyList: VocabularyItem[];
  categories: SemanticCategory[];
  activeStudent: StudentProfile | null;
  selectedCategory: SemanticCategoryId | 'all';
  onCategoryChange?: (cat: SemanticCategoryId | 'all') => void;
  onComplete: (session: QuizSession) => void;
  onExit: () => void;
}

export const PictureWordActivity: React.FC<PictureWordProps> = ({
  vocabularyList,
  categories,
  activeStudent,
  selectedCategory,
  onCategoryChange,
  onComplete,
  onExit,
}) => {
  const [currentTopic, setCurrentTopic] = useState<SemanticCategoryId | 'all'>(selectedCategory);
  const [questions, setQuestions] = useState<Array<{ target: VocabularyItem; choices: VocabularyItem[] }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const generateQuestions = (topic: SemanticCategoryId | 'all') => {
    const pool =
      topic === 'all'
        ? vocabularyList
        : vocabularyList.filter((v) => v.category === topic);
    const safePool = pool.length >= 3 ? pool : vocabularyList;

    const shuffled = [...safePool].sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, Math.min(5, shuffled.length));

    const generated = targets.map((target) => {
      const distractors = safePool
        .filter((item) => item.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const choices = [target, ...distractors].sort(() => 0.5 - Math.random());
      return { target, choices };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedWord(null);
    setIsChecked(false);
    setAttempts([]);
    setIsFinished(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    generateQuestions(currentTopic);
  }, [currentTopic, vocabularyList]);

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
    setSelectedWord(item.word);
    setIsChecked(true);

    const isCorrect = item.id === currentQ.target.id;
    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}-${currentIndex}`,
      timestamp: new Date().toISOString(),
      vocabularyId: currentQ.target.id,
      word: currentQ.target.word,
      category: currentQ.target.category,
      isCorrect,
      selectedAnswer: item.word,
      mode: 'pic-to-word',
    };
    setAttempts((prev) => [...prev, newAttempt]);

    speakText(item.word, { rate: activeStudent?.speechRate || 0.85 });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setSelectedWord(null);
      setIsChecked(false);
    } else {
      setIsFinished(true);
      const correctCount = attempts.filter((a) => a.isCorrect).length;
      const accuracy = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      const session: QuizSession = {
        id: `sess-${Date.now()}`,
        date: new Date().toISOString(),
        studentId: activeStudent?.id || 'guest',
        category: currentTopic,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        accuracy,
        durationSeconds,
        attempts,
      };
      onComplete(session);

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  if (isFinished) {
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const accuracy = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-sky-200 shadow-sm text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 font-fredoka mb-1">
          Great Job!
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          You read and identified the English words!
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100">
            <span className="text-[10px] font-bold text-sky-700 uppercase">Score</span>
            <p className="text-2xl font-black text-sky-900">{correctCount} / {questions.length}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Accuracy</span>
            <p className="text-2xl font-black text-amber-900">{accuracy}%</p>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => generateQuestions(currentTopic)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700"
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
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-sm">
      {/* Header with Topic Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
              🖼️🔤 Picture → Word
            </span>
            <span className="text-[11px] text-slate-400">
              Question {currentIndex + 1} of {questions.length}
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

      {/* Main ARASAAC Pictogram Card */}
      <div className="flex flex-col items-center text-center my-4">
        <span className="text-xs text-slate-500 font-medium mb-3">
          Look at the pictogram. What is this in English?
        </span>

        <div className="w-44 h-44 rounded-3xl bg-slate-50 p-4 border-4 border-sky-200 shadow-xs flex items-center justify-center">
          <img
            src={getArasaacImageUrl(currentQ.target.arasaacId)}
            alt="Prompt"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Word Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
        {currentQ.choices.map((choice) => {
          const isSelected = selectedWord === choice.word;
          const isCorrect = choice.id === currentQ.target.id;

          let btnClass = 'bg-white border-2 border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800';
          if (isChecked) {
            if (isCorrect) {
              btnClass = 'bg-emerald-50 border-3 border-emerald-500 text-emerald-900 font-black ring-2 ring-emerald-300';
            } else if (isSelected) {
              btnClass = 'bg-rose-50 border-2 border-rose-300 text-rose-800 opacity-70';
            } else {
              btnClass = 'bg-slate-50 border border-slate-200 text-slate-400 opacity-40';
            }
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              disabled={isChecked}
              className={`p-4 rounded-2xl font-bold text-base transition-all active:scale-95 text-center ${btnClass}`}
            >
              {choice.word}
            </button>
          );
        })}
      </div>

      {/* Next Step / Action bar */}
      {isChecked && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            {selectedWord === currentQ.target.word ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Correct! That is {currentQ.target.word}!
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                <Smile className="w-4 h-4 text-amber-500" />
                This is {currentQ.target.word}.
              </span>
            )}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition active:scale-95"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next' : 'Finish'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
