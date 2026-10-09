import React, { useState } from 'react';
import { VocabularyItem, SemanticCategoryId } from '../types';
import { SEMANTIC_CATEGORIES } from '../data/categories';
import { searchArasaacPictograms, ArasaacSearchResult } from '../services/arasaacApi';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import { Search, Plus, X, Loader2, Sparkles, Check } from 'lucide-react';

interface ArasaacSearchModalProps {
  onAddVocabulary: (item: VocabularyItem) => void;
  onClose: () => void;
}

export const ArasaacSearchModal: React.FC<ArasaacSearchModalProps> = ({
  onAddVocabulary,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ArasaacSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ArasaacSearchResult | null>(null);
  const [targetCategory, setTargetCategory] = useState<SemanticCategoryId>('school');
  const [customWord, setCustomWord] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSelectedResult(null);

    const data = await searchArasaacPictograms(query);
    setResults(data);
    setIsLoading(false);
  };

  const handleSelectPictogram = (item: ArasaacSearchResult) => {
    setSelectedResult(item);
    const mainKeyword = item.keywords?.[0]?.keyword || query;
    setCustomWord(mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1));
    setExampleSentence(`I see the ${mainKeyword.toLowerCase()}.`);
  };

  const handleConfirmAdd = () => {
    if (!selectedResult || !customWord.trim()) return;

    const newItem: VocabularyItem = {
      id: `custom-${selectedResult._id}-${Date.now()}`,
      arasaacId: selectedResult._id,
      word: customWord.trim(),
      category: targetCategory,
      exampleSentence: exampleSentence.trim(),
      difficulty: 'beginner',
      custom: true,
    };

    onAddVocabulary(newItem);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedResult(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 font-fredoka">
                Search ARASAAC Pictograms API
              </h2>
              <p className="text-xs text-slate-500">
                Search thousands of official ARASAAC symbols and add to your curriculum
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search English word (e.g. rabbit, bus, sandwich, play, jump)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-slate-400">Try:</span>
            {['butterfly', 'playground', 'sandwich', 'sleep', 'rainbow'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  searchArasaacPictograms(tag).then((d) => {
                    setResults(d);
                    setHasSearched(true);
                  });
                }}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="p-6 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <span className="text-xs">Connecting to ARASAAC API...</span>
            </div>
          ) : results.length > 0 ? (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Select a pictogram from ARASAAC ({results.length} found):
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {results.map((item) => {
                  const isSelected = selectedResult?._id === item._id;
                  const label = item.keywords?.[0]?.keyword || query;

                  return (
                    <button
                      key={item._id}
                      onClick={() => handleSelectPictogram(item)}
                      className={`flex flex-col items-center p-2 rounded-2xl border-2 transition text-center aspect-square justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center my-auto">
                        <img
                          src={getArasaacImageUrl(item._id)}
                          alt={label}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 truncate w-full">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No ARASAAC pictograms found for "{query}". Try another keyword or check internet connectivity.
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs italic">
              Type an English vocabulary word above to search the official ARASAAC database.
            </div>
          )}
        </div>

        {/* Add Configuration Footer */}
        {selectedResult && (
          <div className="p-5 bg-teal-50/50 border-t border-teal-100 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Vocabulary Word
                </label>
                <input
                  type="text"
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Semantic Category
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as SemanticCategoryId)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  {SEMANTIC_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Example Sentence
                </label>
                <input
                  type="text"
                  value={exampleSentence}
                  onChange={(e) => setExampleSentence(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-teal-800 font-medium">
                ARASAAC ID: <strong>{selectedResult._id}</strong>
              </span>

              <button
                onClick={handleConfirmAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Curriculum!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to {targetCategory.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
