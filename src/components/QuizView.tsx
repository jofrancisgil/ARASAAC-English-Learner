import React, { useState, useEffect } from 'react';
import { VocabularyItem, SemanticCategoryId, QuizAttempt, QuizSession, StudentProfile } from '../types';
import { getCategoryById } from '../data/categories';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import { speakText } from '../utils/speech';
import confetti from 'canvas-confetti';
import {
  Volume2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Award,
  ArrowRight,
  Smile,
  GraduationCap,
} from 'lucide-react';

interface QuizViewProps {
  vocabularyList: VocabularyItem[];
  activeStudent: StudentProfile;
  selectedCategory: SemanticCategoryId | 'all';
  onCompleteQuiz: (session: QuizSession) => void;
  onExitQuiz: () => void;
  choicesCount?: 2 | 3 | 4;
}

interface Question {
  targetItem: VocabularyItem;
  options: VocabularyItem[];
  mode: 'pic-to-word' | 'word-to-pic' | 'listening';
}

export const QuizView: React.FC<QuizViewProps> = ({
  vocabularyList,
  activeStudent,
  selectedCategory,
  onCompleteQuiz,
  onExitQuiz,
  choicesCount = 3,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [startTime] = useState<number>(Date.now());

  // Generate 5 questions based on selected category
  useEffect(() => {
    const pool =
      selectedCategory === 'all'
        ? vocabularyList
        : vocabularyList.filter((v) => v.category === selectedCategory);

    const safePool = pool.length >= 3 ? pool : vocabularyList;

    // Shuffle and pick 5 items
    const shuffled = [...safePool].sort(() => 0.5 - Math.random());
    const targetItems = shuffled.slice(0, Math.min(5, shuffled.length));

    const generatedQuestions: Question[] = targetItems.map((target, idx) => {
      // Pick distractors
      const distractors = safePool
        .filter((item) => item.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, choicesCount - 1);

      const options = [target, ...distractors].sort(() => 0.5 - Math.random());

      // Alternate quiz modes for multi-sensory learning
      const mode: Question['mode'] =
        idx % 3 === 0 ? 'listening' : idx % 2 === 0 ? 'pic-to-word' : 'word-to-pic';

      return {
        targetItem: target,
        options,
        mode,
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setAttempts([]);
    setQuizFinished(false);
  }, [selectedCategory, vocabularyList, choicesCount]);

  const currentQ = questions[currentIndex];

  // Auto-speak word on new question
  useEffect(() => {
    if (currentQ && !quizFinished) {
      // Play audio prompt
      const timer = setTimeout(() => {
        speakText(currentQ.targetItem.word, { rate: activeStudent.speechRate || 0.85 });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentQ, activeStudent, quizFinished]);

  if (!currentQ && !quizFinished) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading interactive learning quiz...
      </div>
    );
  }

  const handleSelectOption = (chosen: VocabularyItem) => {
    if (isAnswerChecked) return;

    setSelectedOptionId(chosen.id);
    setIsAnswerChecked(true);

    const isCorrect = chosen.id === currentQ.targetItem.id;

    // Record attempt
    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}-${currentIndex}`,
      timestamp: new Date().toISOString(),
      vocabularyId: currentQ.targetItem.id,
      word: currentQ.targetItem.word,
      category: currentQ.targetItem.category,
      isCorrect,
      selectedAnswer: chosen.word,
      mode: currentQ.mode,
    };

    setAttempts((prev) => [...prev, newAttempt]);

    if (isCorrect) {
      speakText(`Great job! ${currentQ.targetItem.word}`, {
        rate: activeStudent.speechRate || 0.85,
      });
    } else {
      speakText(`Nice try. This is ${currentQ.targetItem.word}.`, {
        rate: activeStudent.speechRate || 0.85,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerChecked(false);
    } else {
      // Finish quiz
      setQuizFinished(true);

      const correctCount = attempts.filter((a) => a.isCorrect).length;
      const accuracy =
        attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      const session: QuizSession = {
        id: `sess-${Date.now()}`,
        date: new Date().toISOString(),
        studentId: activeStudent.id,
        category: selectedCategory,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        accuracy,
        durationSeconds,
        attempts,
      };

      onCompleteQuiz(session);

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34D399', '#60A5FA', '#F472B6', '#FBBF24'],
        });
      } catch (e) {
        console.log('Confetti effect:', e);
      }
    }
  };

  // Summary screen
  if (quizFinished) {
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const accuracy =
      attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;

    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-teal-100 text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mx-auto rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-4 shadow-xs">
          <Award className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-800 font-fredoka mb-1">
          Wonderful Effort, {activeStudent.name}!
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Your practice session was recorded to your learning profile.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-teal-50 rounded-2xl p-3 border border-teal-100">
            <span className="text-[10px] font-bold text-teal-700 uppercase">Correct</span>
            <p className="text-2xl font-black text-teal-800">
              {correctCount} / {questions.length}
            </p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Accuracy</span>
            <p className="text-2xl font-black text-amber-800">{accuracy}%</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-3 border border-purple-100">
            <span className="text-[10px] font-bold text-purple-700 uppercase">Stars</span>
            <p className="text-2xl font-black text-purple-800">
              {correctCount >= 4 ? '⭐⭐⭐' : correctCount >= 2 ? '⭐⭐' : '⭐'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setQuizFinished(false);
              setCurrentIndex(0);
              setSelectedOptionId(null);
              setIsAnswerChecked(false);
              setAttempts([]);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>

          <button
            onClick={onExitQuiz}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <span>Back to Board</span>
          </button>
        </div>
      </div>
    );
  }

  const category = getCategoryById(currentQ.targetItem.category);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-teal-100">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${category.badgeBg}`}
          >
            {category.name}
          </span>
        </div>

        <button
          onClick={onExitQuiz}
          className="text-xs font-bold text-slate-400 hover:text-slate-600"
        >
          Exit Practice
        </button>
      </div>

      {/* Question Prompt */}
      <div className="text-center mb-6">
        {currentQ.mode === 'listening' ? (
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 inline-flex items-center gap-1.5 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <Volume2 className="w-3.5 h-3.5" />
              Listen and choose the matching pictogram
            </span>
            <div className="my-3">
              <button
                onClick={() =>
                  speakText(currentQ.targetItem.word, {
                    rate: activeStudent.speechRate || 0.85,
                  })
                }
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-base shadow-sm active:scale-95 transition"
              >
                <Volume2 className="w-5 h-5 animate-bounce" />
                <span>Hear "{currentQ.targetItem.word}"</span>
              </button>
            </div>
          </div>
        ) : currentQ.mode === 'pic-to-word' ? (
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">
              Which English word matches this ARASAAC pictogram?
            </span>
            <div
              className="w-32 h-32 mx-auto rounded-2xl bg-white p-3 border-4 shadow-xs flex items-center justify-center my-3"
              style={{ borderColor: category.aacColorCode || '#CBD5E1' }}
            >
              <img
                src={getArasaacImageUrl(currentQ.targetItem.arasaacId)}
                alt="Prompt pictogram"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              Find the ARASAAC pictogram for:
            </span>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl my-2">
              <span className="text-2xl font-black text-amber-900 font-fredoka">
                {currentQ.targetItem.word}
              </span>
              <button
                onClick={() =>
                  speakText(currentQ.targetItem.word, {
                    rate: activeStudent.speechRate || 0.85,
                  })
                }
                className="p-1 rounded-full hover:bg-amber-100 text-amber-700"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {currentQ.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === currentQ.targetItem.id;
          const optionCategory = getCategoryById(option.category);

          let optionStyle =
            'bg-white border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30';
          if (isAnswerChecked) {
            if (isCorrect) {
              optionStyle =
                'bg-emerald-50 border-3 border-emerald-500 ring-2 ring-emerald-300 text-emerald-900';
            } else if (isSelected) {
              optionStyle =
                'bg-rose-50 border-2 border-rose-300 text-rose-800 opacity-80';
            } else {
              optionStyle = 'bg-slate-50 border border-slate-200 opacity-50';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswerChecked}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl shadow-2xs transition-all active:scale-95 ${optionStyle}`}
            >
              {/* Show pictogram unless in pic-to-word mode */}
              {currentQ.mode !== 'pic-to-word' ? (
                <div className="w-20 h-20 mb-2 flex items-center justify-center">
                  <img
                    src={getArasaacImageUrl(option.arasaacId)}
                    alt={option.word}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}

              <span className="text-sm font-bold text-slate-800 block text-center">
                {option.word}
              </span>

              {isAnswerChecked && isCorrect && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Next Step / Feedback action bar */}
      {isAnswerChecked && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            {selectedOptionId === currentQ.targetItem.id ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Super! Well done!
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                <Smile className="w-4 h-4 text-amber-500" />
                Good try! The answer is {currentQ.targetItem.word}.
              </span>
            )}
          </div>

          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next' : 'See Results'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
