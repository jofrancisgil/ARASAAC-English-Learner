import React, { useState } from 'react';
import { SemanticCategory } from '../types';
import { PASTEL_COLOR_THEMES } from '../data/categories';
import { X, Sparkles, FolderPlus, Tag } from 'lucide-react';

interface AddCategoryModalProps {
  onAddCategory: (category: SemanticCategory) => void;
  onClose: () => void;
}

const CATEGORY_EMOJIS = ['🐶', '👕', '🧸', '🎨', '🚗', '🌳', '🏥', '⚽', '🎶', '🍕', '💻', '💡'];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  onAddCategory,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🐶');
  const [description, setDescription] = useState('');
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const theme = PASTEL_COLOR_THEMES[selectedThemeIndex] || PASTEL_COLOR_THEMES[0];
    const categoryId = `custom-${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    const newCategory: SemanticCategory = {
      id: categoryId,
      name: name.trim(),
      emoji,
      description: description.trim() || `Vocabulary for ${name.trim()}`,
      pastelBg: theme.pastelBg,
      pastelBorder: theme.pastelBorder,
      pastelText: theme.pastelText,
      badgeBg: theme.badgeBg,
      aacColorCode: theme.aacColorCode,
      custom: true,
    };

    onAddCategory(newCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-800 font-fredoka">
              Create Custom Category
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Animals, Clothing, Toys, Daily Routines"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium"
            />
          </div>

          {/* Emoji selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Choose Category Icon / Emoji
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORY_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition ${
                    emoji === e
                      ? 'bg-teal-100 ring-2 ring-teal-500 scale-110 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Pastel Color Theme */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Pastel Color Palette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PASTEL_COLOR_THEMES.map((theme, idx) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedThemeIndex(idx)}
                  className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                    selectedThemeIndex === idx
                      ? `${theme.pastelBg} ${theme.pastelBorder} ring-2 ring-teal-400 text-slate-900 shadow-xs`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-1 border border-black/10"
                    style={{ backgroundColor: theme.aacColorCode }}
                  />
                  <span>{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Short Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Farm and domestic animals for English vocabulary"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
