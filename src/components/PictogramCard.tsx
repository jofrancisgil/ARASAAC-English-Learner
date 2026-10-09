import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { getCategoryById } from '../data/categories';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import { speakText } from '../utils/speech';
import { Volume2, Plus, Sparkles, ImageOff, Check } from 'lucide-react';

interface PictogramCardProps {
  item: VocabularyItem;
  speechRate?: number;
  onAddToSentence?: (item: VocabularyItem) => void;
  onOpenFlashcard?: (item: VocabularyItem) => void;
  size?: 'spacious' | 'normal' | 'compact';
  showCategoryBadge?: boolean;
  isInteractive?: boolean;
  showSentenceAddButton?: boolean;
}

export const PictogramCard: React.FC<PictogramCardProps> = ({
  item,
  speechRate = 0.85,
  onAddToSentence,
  onOpenFlashcard,
  size = 'spacious',
  showCategoryBadge = false,
  isInteractive = true,
  showSentenceAddButton = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const category = getCategoryById(item.category);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSpeaking(true);
    speakText(item.word, {
      rate: speechRate,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleCardClick = () => {
    if (!isInteractive) return;
    handleSpeak();
    if (onAddToSentence && showSentenceAddButton) {
      onAddToSentence(item);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 900);
    }
  };

  // Dimensions designed specifically for SNE students (large touch areas, no cramped clutter)
  const cardPadding = size === 'spacious' ? 'p-5 min-h-[220px]' : 'p-3.5 min-h-[175px]';
  const imgBoxSize = size === 'spacious' ? 'w-32 h-32' : 'w-24 h-24';
  const wordFontSize = size === 'spacious' ? 'text-xl sm:text-2xl font-extrabold' : 'text-base font-bold';

  return (
    <div
      onClick={handleCardClick}
      className={`relative flex flex-col items-center justify-between rounded-3xl bg-white border-3 shadow-sm transition-all duration-200 select-none ${cardPadding} ${
        isInteractive
          ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
          : ''
      } ${
        isSpeaking
          ? 'ring-4 ring-teal-400 ring-offset-2 scale-[1.03] bg-teal-50/50'
          : 'hover:border-teal-400'
      }`}
      style={{
        borderColor: category.aacColorCode || '#E2E8F0',
      }}
      role="button"
      tabIndex={0}
      aria-label={`ARASAAC pictogram for ${item.word}. Tap to listen.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Top indicator: Category badge or clean spacing */}
      <div className="w-full flex items-center justify-between mb-1">
        {showCategoryBadge ? (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${category.badgeBg}`}
          >
            {category.name}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {category.name}
          </span>
        )}

        {/* Audio Listen icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSpeak(e);
          }}
          className={`p-2 rounded-full transition ${
            isSpeaking
              ? 'bg-teal-500 text-white animate-bounce'
              : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50'
          }`}
          title="Listen in English"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* ARASAAC Official Pictogram */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-slate-50/70 p-2 my-2 transition ${imgBoxSize}`}
      >
        {!imgError ? (
          <img
            src={getArasaacImageUrl(item.arasaacId)}
            alt={item.word}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter contrast-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-slate-400">
            <ImageOff className="w-8 h-8 mb-1 text-slate-300" />
            <span className="text-xs font-bold text-slate-600">{item.word}</span>
          </div>
        )}

        {isSpeaking && (
          <div className="absolute inset-0 rounded-2xl bg-teal-300/30 ring-2 ring-teal-400 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* English Word Label in high readability font */}
      <div className="w-full text-center mt-1">
        <span className={`block text-slate-900 tracking-wide font-fredoka ${wordFontSize}`}>
          {item.word}
        </span>
        {item.syllables && size === 'spacious' && (
          <span className="block text-xs font-medium text-teal-700/80 mt-0.5">
            {item.syllables}
          </span>
        )}
      </div>

      {/* "Added!" visual badge feedback when student taps */}
      {justAdded && (
        <div className="absolute -top-2 -right-2 bg-teal-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md animate-in zoom-in-75">
          <Check className="w-3 h-3" />
          <span>Added!</span>
        </div>
      )}
    </div>
  );
};
