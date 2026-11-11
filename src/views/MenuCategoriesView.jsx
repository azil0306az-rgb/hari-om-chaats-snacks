import React from 'react';
import { CATEGORIES } from '../data/menuData';
import { ChevronRight, Sparkles } from 'lucide-react';

export const MenuCategoriesView = ({ onSelectCategory }) => {
  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Title & subtitle matching Screen 02 */}
      <div>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight">
          Our Menu
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Explore our delicious range of authentic street chaats, toasts & drinks
        </p>
      </div>

      {/* 2-Column Category Grid matching Screen 02 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group bg-white rounded-2xl p-3 border border-stone-200/80 hover:border-brand-400 shadow-soft hover:shadow-card transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Category Image */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-2.5">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                {cat.count} Dishes
              </span>
            </div>

            {/* Category Name & Item count + chevron */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="font-display font-bold text-sm text-stone-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-stone-500">
                  {cat.count} Items
                </span>
              </div>

              <div className="w-6 h-6 rounded-full bg-stone-50 group-hover:bg-brand-50 flex items-center justify-center text-stone-400 group-hover:text-brand-600 transition-colors">
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
