import React, { useState } from 'react';
import { VocabularyItem, SemanticCategory, SemanticCategoryId } from '../types';
import { searchArasaacPictograms, ArasaacSearchResult } from '../services/arasaacApi';
import { getArasaacImageUrl } from '../data/initialVocabulary';
import { X, Search, Plus, Sparkles, Check, Loader2, Download, Image as ImageIcon } from 'lucide-react';

interface AddWordModalProps {
  categories: SemanticCategory[];
  defaultCategory?: SemanticCategoryId;
  onAddWord: (word: VocabularyItem) => void;
  onClose: () => void;
}

export const AddWordModal: React.FC<AddWordModalProps> = ({
  categories,
  defaultCategory,
  onAddWord,
  onClose,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<SemanticCategoryId>(
    defaultCategory || categories[0]?.id || 'school'
  );
  const [wordText, setWordText] = useState('');
  const [syllables, setSyllables] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate'>('beginner');

  // ARASAAC Import state
  const [isSearchingArasaac, setIsSearchingArasaac] = useState(false);
  const [arasaacResults, setArasaacResults] = useState<ArasaacSearchResult[]>([]);
  const [selectedArasaacId, setSelectedArasaacId] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const handleSearchAndImportPictogram = async () => {
    const query = wordText.trim();
    if (!query) return;

    setIsSearchingArasaac(true);
    setSearchError(null);
    setHasSearched(true);
    setSelectedArasaacId(null);

    try {
      const results = await searchArasaacPictograms(query);
      setArasaacResults(results);
      if (results.length > 0) {
        // Automatically pre-select the primary result
        setSelectedArasaacId(results[0]._id);
        if (!exampleSentence) {
          setExampleSentence(`This is a ${query.toLowerCase()}.`);
        }
      } else {
        setSearchError(`No ARASAAC pictograms found for "${query}". Try another word or spelling.`);
      }
    } catch (err: any) {
      setSearchError('Could not reach ARASAAC API. Please check your internet connection.');
    } finally {
      setIsSearchingArasaac(false);
    }
  };

  const handleSelectPictogram = (res: ArasaacSearchResult) => {
    setSelectedArasaacId(res._id);
    if (!exampleSentence) {
      setExampleSentence(`This is a ${wordText.trim().toLowerCase()}.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordText.trim() || !selectedArasaacId) return;

    const formattedWord = wordText.trim().charAt(0).toUpperCase() + wordText.trim().slice(1);

    const newItem: VocabularyItem = {
      id: `word-${selectedArasaacId}-${Date.now()}`,
      arasaacId: selectedArasaacId,
      word: formattedWord,
      category: selectedCategoryId,
      syllables: syllables.trim() || undefined,
      exampleSentence: exampleSentence.trim() || `Look at the ${formattedWord.toLowerCase()}.`,
      difficulty,
      custom: true,
    };

    onAddWord(newItem);
    setJustAdded(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const targetCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 font-fredoka">
                Add Word & Import ARASAAC Pictogram
              </h2>
              <p className="text-xs text-slate-500">
                Create new vocabulary and link official ARASAAC symbols
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Category */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Category *
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white font-semibold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji || '🏷️'} {c.name} {c.custom ? '(Custom)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Word Input + Import Button */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              English Vocabulary Word *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={wordText}
                onChange={(e) => setWordText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchAndImportPictogram();
                  }
                }}
                placeholder="e.g. Rabbit, Coat, Playground, Dance, Apple"
                className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 font-bold"
              />
              <button
                type="button"
                onClick={handleSearchAndImportPictogram}
                disabled={isSearchingArasaac || !wordText.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-50 shrink-0"
                title="Search and import pictogram directly from ARASAAC API"
              >
                {isSearchingArasaac ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Import from ARASAAC</span>
              </button>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Type the English word and click <strong>"Import from ARASAAC"</strong> to fetch the official symbol.
            </span>
          </div>

          {/* ARASAAC Results Picker */}
          {hasSearched && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase block mb-2">
                Official ARASAAC Pictograms Found ({arasaacResults.length}):
              </span>

              {isSearchingArasaac ? (
                <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span>Connecting to ARASAAC API...</span>
                </div>
              ) : arasaacResults.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                  {arasaacResults.map((res) => {
                    const isSelected = selectedArasaacId === res._id;
                    const label = res.keywords?.[0]?.keyword || wordText;

                    return (
                      <button
                        key={res._id}
                        type="button"
                        onClick={() => handleSelectPictogram(res)}
                        className={`flex flex-col items-center p-1.5 rounded-xl border-2 transition text-center bg-white ${
                          isSelected
                            ? 'border-teal-500 ring-2 ring-teal-300 shadow-xs'
                            : 'border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img
                            src={getArasaacImageUrl(res._id)}
                            alt={label}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 truncate w-full mt-1">
                          {label}
                        </span>
                        {isSelected && (
                          <span className="text-[8px] font-extrabold text-teal-700 uppercase">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-amber-700 p-2 text-center">
                  {searchError || 'No pictograms found. Please try another word.'}
                </div>
              )}
            </div>
          )}

          {/* Syllables & Example Sentence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Syllables (Optional)
              </label>
              <input
                type="text"
                value={syllables}
                onChange={(e) => setSyllables(e.target.value)}
                placeholder="e.g. rab • bit"
                className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate')}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Example Sentence (Optional)
            </label>
            <input
              type="text"
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
              placeholder="e.g. The rabbit hops in the green grass."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Selected Symbol Preview */}
          {selectedArasaacId && (
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-2xl border border-teal-200">
              <img
                src={getArasaacImageUrl(selectedArasaacId)}
                alt="Selected"
                className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-teal-100"
              />
              <div>
                <span className="text-xs font-bold text-teal-950 block">
                  Ready to add to {targetCategory.name}: <strong>{wordText || 'Word'}</strong>
                </span>
                <span className="text-[10px] text-teal-700">
                  ARASAAC Model ID: #{selectedArasaacId}
                </span>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!wordText.trim() || !selectedArasaacId}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Word to {targetCategory.name}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
