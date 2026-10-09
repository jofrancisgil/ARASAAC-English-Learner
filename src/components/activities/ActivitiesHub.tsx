import React from 'react';
import { SemanticCategory, SemanticCategoryId } from '../../types';
import { Sparkles, Play, Volume2, Grid, Award, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export type ActivityType =
  | 'listen-choose'
  | 'memory'
  | 'picture-word'
  | 'odd-one-out'
  | 'put-in-group'
  | 'flashcards';

interface ActivitiesHubProps {
  categories: SemanticCategory[];
  selectedCategory: SemanticCategoryId | 'all';
  onSelectCategory: (cat: SemanticCategoryId | 'all') => void;
  onLaunchActivity: (activity: ActivityType) => void;
}

export const ActivitiesHub: React.FC<ActivitiesHubProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onLaunchActivity,
}) => {
  const activities = [
    {
      id: 'listen-choose' as ActivityType,
      title: 'Listen & choose',
      emoji: '🎧',
      description: 'Hear an English word and choose the correct pictogram. Three choices at most.',
      pastelBg: 'bg-teal-50 hover:bg-teal-100/70',
      pastelBorder: 'border-teal-200',
      badgeBg: 'bg-teal-100 text-teal-900',
      tag: 'Listening & Receptive',
    },
    {
      id: 'memory' as ActivityType,
      title: 'Pictogram Memory',
      emoji: '🧠🧩',
      description: 'Find matching picture pairs. Great for attention and vocabulary recall.',
      pastelBg: 'bg-purple-50 hover:bg-purple-100/70',
      pastelBorder: 'border-purple-200',
      badgeBg: 'bg-purple-100 text-purple-900',
      tag: 'Memory & Attention',
    },
    {
      id: 'picture-word' as ActivityType,
      title: 'Picture → word',
      emoji: '🖼️🔤',
      description: 'Look at the pictogram and choose the English word.',
      pastelBg: 'bg-sky-50 hover:bg-sky-100/70',
      pastelBorder: 'border-sky-200',
      badgeBg: 'bg-sky-100 text-sky-900',
      tag: 'Reading & Identification',
    },
    {
      id: 'odd-one-out' as ActivityType,
      title: "Which one doesn't belong?",
      emoji: '🔎🧩',
      description: 'Find the pictogram from a different topic.',
      pastelBg: 'bg-amber-50 hover:bg-amber-100/70',
      pastelBorder: 'border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-900',
      tag: 'Semantic Categorization',
    },
    {
      id: 'put-in-group' as ActivityType,
      title: 'Put it in the group',
      emoji: '🗂️😊',
      description: 'Choose the correct semantic category for a pictogram.',
      pastelBg: 'bg-emerald-50 hover:bg-emerald-100/70',
      pastelBorder: 'border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-900',
      tag: 'Concept Sorting',
    },
    {
      id: 'flashcards' as ActivityType,
      title: 'Flashcards',
      emoji: '⭐🔊',
      description: 'See a picture, hear the word and practise at your own pace.',
      pastelBg: 'bg-rose-50 hover:bg-rose-100/70',
      pastelBorder: 'border-rose-200',
      badgeBg: 'bg-rose-100 text-rose-900',
      tag: 'Self-Paced Practice',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Activity Filter Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 font-fredoka flex items-center gap-2">
            <span>🎮</span>
            <span>English Learning Activities</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive multi-sensory games using official ARASAAC pictograms
          </p>
        </div>

        {/* Category Topic Pill Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">
            Topic Filter:
          </span>
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Topics
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                selectedCategory === c.id
                  ? 'ring-2 ring-teal-500 shadow-2xs bg-teal-50 text-teal-900 border border-teal-300'
                  : `${c.pastelBg} ${c.pastelText} border ${c.pastelBorder}`
              }`}
            >
              <span>{c.emoji || '🏷️'}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 6 Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {activities.map((act) => (
          <div
            key={act.id}
            onClick={() => onLaunchActivity(act.id)}
            className={`flex flex-col justify-between p-6 rounded-3xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] ${act.pastelBg} ${act.pastelBorder}`}
          >
            <div>
              {/* Emoji & Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{act.emoji}</span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${act.badgeBg}`}>
                  {act.tag}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-black text-slate-800 font-fredoka mb-1.5">
                {act.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {act.description}
              </p>
            </div>

            {/* Play Button */}
            <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Play Activity
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-black text-teal-800 bg-white/90 px-3.5 py-1.5 rounded-xl shadow-2xs border border-teal-200 hover:bg-white">
                <span>Play</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
