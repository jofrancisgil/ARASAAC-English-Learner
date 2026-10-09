import React from 'react';
import { SemanticCategory, SemanticCategoryId } from '../../types';

interface ActivityTopicSelectorProps {
  categories: SemanticCategory[];
  selectedCategory: SemanticCategoryId | 'all';
  onSelectCategory: (catId: SemanticCategoryId | 'all') => void;
  compact?: boolean;
}

export const ActivityTopicSelector: React.FC<ActivityTopicSelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  compact = false,
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-2.5 py-1">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
        Topic:
      </span>
      <select
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value as SemanticCategoryId | 'all')}
        className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none cursor-pointer"
      >
        <option value="all">🌟 All Topics</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.emoji || '🏷️'} {c.name} {c.custom ? '(Custom)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};
