import React, { useState, useEffect } from 'react';
import { VocabularyItem, StudentProfile, QuizSession, SemanticCategory, SemanticCategoryId } from '../../types';
import { getArasaacImageUrl } from '../../data/initialVocabulary';
import { speakText } from '../../utils/speech';
import { ActivityTopicSelector } from './ActivityTopicSelector';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Award, Sparkles } from 'lucide-react';

interface MemoryCard {
  uniqueId: string;
  itemId: string;
  word: string;
  arasaacId: number;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface PictogramMemoryProps {
  vocabularyList: VocabularyItem[];
  categories: SemanticCategory[];
  activeStudent: StudentProfile | null;
  selectedCategory: SemanticCategoryId | 'all';
  onCategoryChange?: (cat: SemanticCategoryId | 'all') => void;
  onComplete: (session: QuizSession) => void;
  onExit: () => void;
}

export const PictogramMemoryActivity: React.FC<PictogramMemoryProps> = ({
  vocabularyList,
  categories,
  activeStudent,
  selectedCategory,
  onCategoryChange,
  onComplete,
  onExit,
}) => {
  const [currentTopic, setCurrentTopic] = useState<SemanticCategoryId | 'all'>(selectedCategory);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const setupGame = (topic: SemanticCategoryId | 'all') => {
    const pool =
      topic === 'all'
        ? vocabularyList
        : vocabularyList.filter((v) => v.category === topic);
    const safePool = pool.length >= 3 ? pool : vocabularyList;

    // Pick 3 or 4 vocabulary items for pairs (6 or 8 cards)
    const chosenItems = [...safePool].sort(() => 0.5 - Math.random()).slice(0, 4);

    const cardPairs: MemoryCard[] = [];
    chosenItems.forEach((item) => {
      cardPairs.push({
        uniqueId: `${item.id}-a`,
        itemId: item.id,
        word: item.word,
        arasaacId: item.arasaacId,
        category: item.category,
        isFlipped: false,
        isMatched: false,
      });
      cardPairs.push({
        uniqueId: `${item.id}-b`,
        itemId: item.id,
        word: item.word,
        arasaacId: item.arasaacId,
        category: item.category,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(cardPairs.sort(() => 0.5 - Math.random()));
    setFlippedIds([]);
    setMoves(0);
    setIsFinished(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    setupGame(currentTopic);
  }, [currentTopic, vocabularyList]);

  const handleTopicChange = (newTopic: SemanticCategoryId | 'all') => {
    setCurrentTopic(newTopic);
    if (onCategoryChange) {
      onCategoryChange(newTopic);
    }
  };

  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || flippedIds.length >= 2) return;

    const newFlipped = [...flippedIds, card.uniqueId];
    setFlippedIds(newFlipped);

    speakText(card.word, { rate: activeStudent?.speechRate || 0.85 });

    setCards((prev) =>
      prev.map((c) => (c.uniqueId === card.uniqueId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.uniqueId === newFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.itemId === secondCard.itemId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.itemId === firstCard.itemId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIds([]);
          speakText(`Match! ${firstCard.word}`, { rate: activeStudent?.speechRate || 0.85 });

          const remainingUnmatched = cards.filter(
            (c) => !c.isMatched && c.itemId !== firstCard.itemId
          );
          if (remainingUnmatched.length === 0) {
            handleGameWin();
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.uniqueId) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIds([]);
        }, 1100);
      }
    }
  };

  const handleGameWin = () => {
    setIsFinished(true);
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    const session: QuizSession = {
      id: `sess-${Date.now()}`,
      date: new Date().toISOString(),
      studentId: activeStudent?.id || 'guest',
      category: currentTopic,
      totalQuestions: 4,
      correctAnswers: 4,
      accuracy: 100,
      durationSeconds,
      attempts: [],
    };
    onComplete(session);

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-sm">
      {/* Header with Topic Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
              🧠🧩 Pictogram Memory
            </span>
            <span className="text-[11px] text-slate-400">
              Find matching picture pairs. Moves: {moves}
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
          <button
            onClick={() => setupGame(currentTopic)}
            className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {isFinished ? (
        <div className="text-center py-10 animate-in zoom-in-95 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 font-fredoka mb-1">
            Memory Master!
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            You matched all ARASAAC pairs in {moves} turns.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setupGame(currentTopic)}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
            >
              Play Again
            </button>
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Activities Menu
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-4 max-w-2xl mx-auto">
          {cards.map((card) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(card)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-3 aspect-square transition-all duration-300 select-none ${
                  card.isMatched
                    ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200 opacity-90'
                    : isRevealed
                    ? 'border-teal-400 bg-white ring-2 ring-teal-200 scale-102 shadow-md'
                    : 'border-purple-200 bg-purple-50 hover:bg-purple-100/80 cursor-pointer shadow-xs active:scale-95'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-between w-full h-full">
                    <div className="w-20 h-20 my-auto flex items-center justify-center">
                      <img
                        src={getArasaacImageUrl(card.arasaacId)}
                        alt={card.word}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate w-full text-center">
                      {card.word}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-purple-400">
                    <Sparkles className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      Tap
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
