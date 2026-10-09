import React from 'react';
import { SemanticCategoryId } from '../types';
import { SEMANTIC_CATEGORIES } from '../data/categories';
import {
  GraduationCap,
  Users,
  Home,
  CloudSun,
  Smile,
  Activity,
  Apple,
  LayoutGrid,
  Search,
  X,
} from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: SemanticCategoryId | 'all';
  onSelectCategory: (category: SemanticCategoryId | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  categoryCounts,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'school':
        return <GraduationCap className="w-4 h-4" />;
      case 'family':
        return <Users className="w-4 h-4" />;
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'weather':
        return <CloudSun className="w-4 h-4" />;
      case 'moods':
        return <Smile className="w-4 h-4" />;
      case 'actions':
        return <Activity className="w-4 h-4" />;
      case 'food':
        return <Apple className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full flex flex-col gap-3 mb-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search vocabulary (e.g. pencil, happy, sunny, book)..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 shadow-2xs transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Semantic Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
        {/* All Categories Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
            selectedCategory === 'all'
              ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>All Vocabulary</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedCategory === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Categories */}
        {SEMANTIC_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'ring-2 ring-teal-500 shadow-xs text-slate-900 border-teal-400'
                  : 'text-slate-700 hover:shadow-xs'
              } ${cat.pastelBg} ${cat.pastelBorder}`}
            >
              <span className={cat.pastelText}>{getIcon(cat.id)}</span>
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white shadow-2xs font-extrabold' : 'bg-white/80'
                } ${cat.pastelText}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
