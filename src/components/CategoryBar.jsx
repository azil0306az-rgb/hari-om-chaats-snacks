import React, { useRef } from 'react';
import { CATEGORIES } from '../data/menuData';

export const CategoryBar = ({ activeCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);

  const handleSelect = (categoryId) => {
    onSelectCategory(categoryId);
  };

  return (
    <div className="sticky top-[57px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-2.5 border-b border-stone-200/60 shadow-xs">
      <div className="max-w-2xl mx-auto px-4">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-102 ring-2 ring-brand-500/30'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
