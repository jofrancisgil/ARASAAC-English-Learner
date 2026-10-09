import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { getCategoryById } from '../data/categories';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import { speakText } from '../utils/speech';
import { Volume2, X, ChevronLeft, ChevronRight, Sparkles, Snail, CheckCircle2 } from 'lucide-react';

interface FlashcardModalProps {
  item: VocabularyItem | null;
  itemsList: VocabularyItem[];
  onClose: () => void;
  onSelectNext: (nextItem: VocabularyItem) => void;
  onSelectPrev: (prevItem: VocabularyItem) => void;
  speechRate?: number;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  item,
  itemsList,
  onClose,
  onSelectNext,
  onSelectPrev,
  speechRate = 0.85,
}) => {
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [isPlayingSentence, setIsPlayingSentence] = useState(false);

  if (!item) return null;

  const category = getCategoryById(item.category);
  const currentIndex = itemsList.findIndex((i) => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < itemsList.length - 1;

  const handleSpeakWord = (rate: number = speechRate) => {
    setIsPlayingWord(true);
    speakText(item.word, {
      rate,
      onEnd: () => setIsPlayingWord(false),
      onError: () => setIsPlayingWord(false),
    });
  };

  const handleSpeakSentence = () => {
    if (!item.exampleSentence) return;
    setIsPlayingSentence(true);
    speakText(item.exampleSentence, {
      rate: speechRate,
      onEnd: () => setIsPlayingSentence(false),
      onError: () => setIsPlayingSentence(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Bar */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b ${category.pastelBg} ${category.pastelBorder}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${category.badgeBg}`}
            >
              {category.name}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Card {currentIndex + 1} of {itemsList.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Main ARASAAC Image */}
          <div
            className={`w-44 h-44 rounded-2xl bg-white p-3 border-4 flex items-center justify-center shadow-xs mb-4`}
            style={{ borderColor: category.aacColorCode || '#CBD5E1' }}
          >
            <img
              src={getArasaacImageUrl(item.arasaacId)}
              alt={item.word}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Word Heading */}
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-wide mb-1 font-fredoka">
            {item.word}
          </h2>

          {/* Syllables & Phonetic breakdown */}
          <div className="flex items-center gap-3 mb-4">
            {item.syllables && (
              <span className="text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {item.syllables}
              </span>
            )}
            {item.phonetic && (
              <span className="text-xs font-mono text-slate-400">
                {item.phonetic}
              </span>
            )}
          </div>

          {/* Audio Pronunciation Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => handleSpeakWord(speechRate)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs transition active:scale-95 ${
                isPlayingWord
                  ? 'bg-teal-500 text-white animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen</span>
            </button>

            <button
              onClick={() => handleSpeakWord(0.6)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition active:scale-95"
              title="Speak very slowly for clear speech modeling"
            >
              <Snail className="w-4 h-4 text-amber-600" />
              <span>Slow Audio</span>
            </button>
          </div>

          {/* Example Sentence Box */}
          {item.exampleSentence && (
            <div className="w-full bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-left mb-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Example Sentence:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{item.exampleSentence}"
              </p>
              <button
                onClick={handleSpeakSentence}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingSentence ? 'Speaking sentence...' : 'Listen to sentence'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => hasPrev && onSelectPrev(itemsList[currentIndex - 1])}
            disabled={!hasPrev}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              hasPrev
                ? 'text-slate-700 hover:bg-slate-200 active:scale-95'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400">
            {item.category.toUpperCase()}
          </span>

          <button
            onClick={() => hasNext && onSelectNext(itemsList[currentIndex + 1])}
            disabled={!hasNext}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              hasNext
                ? 'text-slate-700 hover:bg-slate-200 active:scale-95'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
