import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Plus, Minus, Heart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CategoryListingView = ({ category, onBack, onOpenDetail }) => {
  const { cart, addToCart, updateQuantity, getProductQuantity } = useCart();
  const [subFilter, setSubFilter] = useState('all');
  const [favorites, setFavorites] = useState({});

  if (!category) return null;

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Sub-filter items
  const items = category.items || [];
  const filteredItems = items.filter((item) => {
    if (subFilter === 'all') return true;
    return item.name.toLowerCase().includes(subFilter.toLowerCase());
  });

  // Extract quick pill keywords from item names
  const subPills = ['All', ...new Set(items.map((i) => i.name.split(' ')[0]))].slice(0, 5);

  return (
    <div className="px-4 py-3 space-y-3.5 animate-fade-in">
      {/* Category Header matching Screen 03 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center border border-stone-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900 leading-tight">
              {category.name}
            </h2>
            <span className="text-xs text-stone-500">{items.length} Items Available</span>
          </div>
        </div>
      </div>

      {/* Subcategory Filter Pills matching Screen 03 */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {subPills.map((pill) => {
          const isSelected = subFilter === (pill === 'All' ? 'all' : pill.toLowerCase());
          return (
            <button
              key={pill}
              onClick={() => setSubFilter(pill === 'All' ? 'all' : pill.toLowerCase())}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* Product List Cards matching Screen 03 */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const qty = getProductQuantity(item.id);
          const cartItem = cart.find((c) => c.productId === item.id);
          const isFav = !!favorites[item.id];

          return (
            <div
              key={item.id}
              onClick={() => onOpenDetail(item)}
              className="bg-white rounded-2xl p-3 border border-stone-200/80 hover:border-brand-300 shadow-soft flex items-center gap-3.5 cursor-pointer transition-all duration-200"
            >
              {/* Left Photo */}
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80';
                  }}
                />
                {/* Veg tag */}
                <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 bg-white/95 rounded flex items-center justify-center border border-emerald-600 shadow-2xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </div>
              </div>

              {/* Middle Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-snug truncate">
                    {item.name}
                  </h3>
                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="p-1 text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Rating & Prep */}
                <div className="mt-1 flex items-center gap-2 text-[10px] text-stone-400">
                  <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    {item.rating}
                  </span>
                  <span>•</span>
                  <span>{item.prepTime}</span>
                </div>

                {/* Bottom Row: Price + Add Button */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-base text-stone-900">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-brand-50 border border-brand-300 rounded-full px-2 py-0.5 shadow-2xs">
                        <button
                          onClick={() => cartItem && updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="w-5 h-5 rounded-full bg-white text-brand-600 flex items-center justify-center shadow-2xs hover:bg-brand-500 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs text-brand-700 min-w-[12px] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => cartItem ? updateQuantity(cartItem.id, cartItem.quantity + 1) : addToCart(item, [])}
                          className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-2xs hover:bg-brand-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => addToCart(item, [], e.currentTarget)}
                        className="px-3 py-1 rounded-full border border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <span>Add</span>
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
