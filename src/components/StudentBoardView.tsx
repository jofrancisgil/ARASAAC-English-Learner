import React, { useState } from 'react';
import { VocabularyItem, SemanticCategory, SemanticCategoryId } from '../types';
import { getCategoryById } from '../data/categories';
import { PictogramCard } from './PictogramCard';
import { SentenceBuilderStrip } from './SentenceBuilderStrip';
import {
  GraduationCap,
  Users,
  Home,
  CloudSun,
  Smile,
  Activity,
  Apple,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  FolderPlus,
  Plus,
  Tag,
} from 'lucide-react';

interface StudentBoardViewProps {
  vocabularyList: VocabularyItem[];
  categories: SemanticCategory[];
  selectedCategory: SemanticCategoryId | 'all';
  onSelectCategory: (cat: SemanticCategoryId | 'all') => void;
  sentenceItems: VocabularyItem[];
  onAddToSentence: (item: VocabularyItem) => void;
  onRemoveSentenceItem: (index: number) => void;
  onClearSentence: () => void;
  onAddStarter: (text: string, arasaacId?: number) => void;
  onOpenAddCategoryModal: () => void;
  onOpenAddWordModal: () => void;
  speechRate?: number;
}

export const StudentBoardView: React.FC<StudentBoardViewProps> = ({
  vocabularyList,
  categories,
  selectedCategory,
  onSelectCategory,
  sentenceItems,
  onAddToSentence,
  onRemoveSentenceItem,
  onClearSentence,
  onAddStarter,
  onOpenAddCategoryModal,
  onOpenAddWordModal,
  speechRate = 0.85,
}) => {
  // Density: 4 (Focus), 6 (Standard), 8 (Expanded)
  const [pageSize, setPageSize] = useState<4 | 6 | 8>(6);
  const [pageIndex, setPageIndex] = useState(0);
  const [showSentenceStrip, setShowSentenceStrip] = useState(true);

  // Filter items
  const items =
    selectedCategory === 'all'
      ? vocabularyList
      : vocabularyList.filter((v) => v.category === selectedCategory);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const currentItems = items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const handleCategoryClick = (catId: SemanticCategoryId | 'all') => {
    onSelectCategory(catId);
    setPageIndex(0);
  };

  const activeCategoryMeta =
    selectedCategory !== 'all' ? getCategoryById(selectedCategory, categories) : null;

  return (
    <div className="w-full space-y-5">
      {/* Optional AAC Sentence Strip */}
      {showSentenceStrip && (
        <div className="animate-in fade-in duration-200">
          <SentenceBuilderStrip
            sentenceItems={sentenceItems}
            onRemoveItem={onRemoveSentenceItem}
            onClear={onClearSentence}
            onAddStarter={onAddStarter}
            speechRate={speechRate}
          />
        </div>
      )}

      {/* Spacious, Tactile Category Switcher for Students */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2 px-1 flex-wrap gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Choose Vocabulary Topic:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddWordModal}
              className="flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full border border-teal-200 transition"
              title="Add a new word and import its ARASAAC pictogram"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>+ Add Word (Import ARASAAC)</span>
            </button>

            <button
              onClick={onOpenAddCategoryModal}
              className="flex items-center gap-1 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full border border-purple-200 transition"
              title="Create a new custom category"
            >
              <FolderPlus className="w-3.5 h-3.5 text-purple-600" />
              <span>+ New Category</span>
            </button>

            <button
              onClick={() => setShowSentenceStrip((prev) => !prev)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full transition"
            >
              {showSentenceStrip ? 'Hide Strip' : 'Show Strip'}
            </button>
          </div>
        </div>

        {/* Big tactile category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all border-2 ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm scale-102'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>All Words ({vocabularyList.length})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = vocabularyList.filter((v) => v.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all border-2 ${
                  isSelected
                    ? 'ring-3 ring-teal-400 shadow-md scale-102 border-teal-500 bg-white text-slate-900'
                    : `${cat.pastelBg} ${cat.pastelBorder} text-slate-700 hover:shadow-2xs`
                }`}
              >
                <span>{cat.emoji || '🏷️'}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Density & Paging Controls */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          {activeCategoryMeta && (
            <span
              className={`font-black text-sm px-3 py-1 rounded-full ${activeCategoryMeta.badgeBg}`}
            >
              {activeCategoryMeta.emoji || '🏷️'} Topic: {activeCategoryMeta.name}
            </span>
          )}
          <span className="text-slate-500 font-medium hidden sm:inline">
            Showing {currentItems.length} of {items.length} symbols
          </span>
        </div>

        {/* Card Density selector */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase px-1 hidden md:inline">
            Card Size:
          </span>
          <button
            onClick={() => {
              setPageSize(4);
              setPageIndex(0);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
              pageSize === 4 ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
            title="4 Big Cards - Low Cognitive Load"
          >
            4 (Big)
          </button>
          <button
            onClick={() => {
              setPageSize(6);
              setPageIndex(0);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
              pageSize === 6 ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
            title="6 Cards - Standard"
          >
            6 (Standard)
          </button>
          <button
            onClick={() => {
              setPageSize(8);
              setPageIndex(0);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
              pageSize === 8 ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
            title="8 Cards"
          >
            8 (Grid)
          </button>
        </div>
      </div>

      {/* Spacious Grid of Large ARASAAC Pictograms */}
      {currentItems.length > 0 ? (
        <div
          className={`grid gap-4 sm:gap-6 ${
            pageSize === 4
              ? 'grid-cols-2 md:grid-cols-2 max-w-3xl mx-auto'
              : pageSize === 6
              ? 'grid-cols-2 sm:grid-cols-3 max-w-4xl mx-auto'
              : 'grid-cols-2 sm:grid-cols-4 max-w-5xl mx-auto'
          }`}
        >
          {currentItems.map((item) => (
            <PictogramCard
              key={item.id}
              item={item}
              speechRate={speechRate}
              onAddToSentence={onAddToSentence}
              size={pageSize === 4 ? 'spacious' : 'normal'}
              showSentenceAddButton={showSentenceStrip}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700 font-fredoka">
            No words in this category yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Import official ARASAAC pictograms directly into this category.
          </p>
          <button
            onClick={onOpenAddWordModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Word & Import ARASAAC Pictogram</span>
          </button>
        </div>
      )}

      {/* Big Friendly Pagination Arrows */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4 pb-2">
          <button
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-slate-300 text-slate-800 font-black text-sm shadow-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-extrabold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200">
            Page {pageIndex + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            disabled={pageIndex >= totalPages - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 border-2 border-teal-600 text-white font-black text-sm shadow-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-teal-700 active:scale-95 transition"
          >
            <span>Next Page</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
