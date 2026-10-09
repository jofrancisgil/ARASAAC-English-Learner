import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import { speakText, stopSpeech } from '../utils/speech';
import { Play, RotateCcw, Delete, Volume2, Plus, Sparkles } from 'lucide-react';

interface SentenceBuilderStripProps {
  sentenceItems: VocabularyItem[];
  onRemoveItem: (index: number) => void;
  onClear: () => void;
  onAddStarter: (text: string, arasaacId?: number) => void;
  speechRate?: number;
}

const COMMON_STARTERS = [
  { text: 'I want', arasaacId: 5441, category: 'actions' },
  { text: 'I feel', arasaacId: 35533, category: 'moods' },
  { text: 'I see', arasaacId: 6564, category: 'actions' },
  { text: 'The weather is', arasaacId: 7252, category: 'weather' },
  { text: 'Please', arasaacId: 8195, category: 'actions' },
];

export const SentenceBuilderStrip: React.FC<SentenceBuilderStripProps> = ({
  sentenceItems,
  onRemoveItem,
  onClear,
  onAddStarter,
  speechRate = 0.85,
}) => {
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fullSentenceText = sentenceItems.map((i) => i.word).join(' ');

  const handleSpeakFullSentence = async () => {
    if (sentenceItems.length === 0) return;

    setIsPlaying(true);

    // Speak sequentially with visual highlight for SNE learners
    for (let i = 0; i < sentenceItems.length; i++) {
      setActiveHighlightIndex(i);
      await new Promise<void>((resolve) => {
        speakText(sentenceItems[i].word, {
          rate: speechRate,
          onEnd: () => {
            setTimeout(resolve, 150); // slight pause between words
          },
          onError: () => resolve(),
        });
      });
    }

    setActiveHighlightIndex(null);
    setIsPlaying(false);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 shadow-sm border-2 border-teal-100 mb-6 transition-all">
      {/* Strip Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">AAC Sentence Builder Strip</h3>
            <p className="text-[11px] text-slate-500">
              Tap pictograms below to build phrases in English
            </p>
          </div>
        </div>

        {/* Quick Starters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Starters:</span>
          {COMMON_STARTERS.map((starter) => (
            <button
              key={starter.text}
              onClick={() => onAddStarter(starter.text, starter.arasaacId)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium transition border border-slate-200 active:scale-95"
            >
              + {starter.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sentence Strip Display */}
      <div className="mt-3 flex items-center gap-3 min-h-[96px] bg-slate-50/70 rounded-2xl p-3 border-2 border-dashed border-teal-200 overflow-x-auto">
        {sentenceItems.length === 0 ? (
          <div className="flex items-center justify-center w-full py-4 text-slate-400 text-xs italic">
            Tap any ARASAAC pictogram below to add it to your sentence...
          </div>
        ) : (
          sentenceItems.map((item, idx) => {
            const isCurrentSpeaking = activeHighlightIndex === idx;
            return (
              <div
                key={`${item.id}-${idx}`}
                className={`relative group shrink-0 flex flex-col items-center justify-between bg-white rounded-xl p-2 border-2 shadow-xs transition-all duration-200 ${
                  isCurrentSpeaking
                    ? 'ring-4 ring-teal-400 scale-105 bg-teal-50 border-teal-500'
                    : 'border-slate-200 hover:border-teal-300'
                } w-20 h-24`}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src={getArasaacImageUrl(item.arasaacId)}
                    alt={item.word}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 truncate w-full text-center">
                  {item.word}
                </span>

                <button
                  onClick={() => onRemoveItem(idx)}
                  className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-sm hover:bg-rose-600 transition"
                  title="Remove from sentence"
                >
                  <Delete className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sentence Controls */}
      {sentenceItems.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-teal-900 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
              "{fullSentenceText}"
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakFullSentence}
              disabled={isPlaying}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white shadow-sm transition active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlaying ? 'Speaking...' : 'Speak Sentence'}</span>
            </button>

            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              title="Clear entire sentence"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
