import React from 'react';
import { MapPin, Clock, Star, Flame, ChevronRight, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS } from '../data/menuData';
import { HeroSlideshow } from './HeroSlideshow';

export const Hero = ({ onOpenInfo, onSelectCategory, activeCategory, onSeeAllSpecials }) => {
  const { addToCart } = useCart();

  // Quick categories with authentic food photography thumbnails
  const quickCategories = [
    { 
      id: 'all', 
      label: 'All', 
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=160&q=80' 
    },
    { 
      id: 'chaat', 
      label: 'Chaats', 
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=160&q=80' 
    },
    { 
      id: 'snacks', 
      label: 'Snacks', 
      image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=160&q=80' 
    },
    { 
      id: 'sandwiches', 
      label: 'Sandwiches', 
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=160&q=80' 
    },
    { 
      id: 'beverages', 
      label: 'Beverages', 
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=160&q=80' 
    },
    { 
      id: 'special-picks', 
      label: 'Combos', 
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=160&q=80' 
    },
  ];

  const comboItem = MENU_ITEMS.find((i) => i.id === 'pani-puri-combo') || {
    id: 'pani-puri-combo',
    name: 'Pani Puri Combo (6 Pcs + Drink)',
    price: 59,
    originalPrice: 70,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    description: "6 Pcs Crispy Pani Puri + Choice of Chilled Refresher",
  };

  return (
    <div className="space-y-4 pt-2">
      {/* 1. Automatic Image & Video Hero Slideshow */}
      <HeroSlideshow onOpenInfo={onOpenInfo} onExploreMenu={onSeeAllSpecials} />

      {/* 2. Category Shortcuts with Real Food Photos */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {quickCategories.map((qc) => {
          const isActive = activeCategory === qc.id;
          return (
            <button
              key={qc.id}
              onClick={() => onSelectCategory(qc.id)}
              className={`flex-1 min-w-[68px] py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all group ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-102 font-bold ring-2 ring-brand-500'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 font-medium'
              }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden mb-1 border border-stone-200/60 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={qc.image}
                  alt={qc.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] leading-tight tracking-tight">{qc.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Today's Specials matching Screen 01 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-display font-bold text-sm text-stone-900">
            <Flame className="w-4 h-4 text-brand-500 fill-brand-500" />
            <span>Today's Specials</span>
          </div>
          <button
            onClick={onSeeAllSpecials}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Special Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-3.5 border border-stone-800 shadow-soft flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-sm sm:text-base text-white truncate">
              {comboItem.name}
            </h4>
            <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
              (6 Pcs + Drink)
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display font-extrabold text-base text-white">
                ₹{comboItem.price}
              </span>
              <span className="text-xs text-stone-400 line-through">
                ₹{comboItem.originalPrice || 70}
              </span>
              <span className="text-[10px] font-extrabold bg-brand-500 text-white px-1.5 py-0.5 rounded shadow-xs">
                Save ₹11
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/20 shadow-xs">
              <img
                src={comboItem.image}
                alt={comboItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => addToCart(comboItem, [])}
              className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-full shadow-xs transition-colors"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
